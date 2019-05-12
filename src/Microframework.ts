import {MicroframeworkSettings} from "./MicroframeworkSettings";
import {MicroframeworkLoader} from "./MicroframeworkLoader";
import {MicroframeworkConfig} from "./MicroframeworkConfig";
import {MicroframeworkNotBootstrappedError} from "./error/MicroframeworkNotBootstrappedError";
import {MicroframeworkAsciiArtNotInstalledError} from "./error/MicroframeworkAsciiArtNotInstalledError";

/**
 * Launches microframework.
 */
export class Microframework {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    /**
     * Stores framework configuration.
     */
    private frameworkConfig?: MicroframeworkConfig;

    /**
     * Stores configurations from all configuration files provided to microframework.
     */
    private allConfiguration: any = {};

    /**
     * Stores all registered microframework loaders.
     */
    private loaders: MicroframeworkLoader[] = [];

    /**
     * Stores all settings of loaders bootstrapped by microframework.
     * If its undefined it means framework is not bootstrapped yet.
     */
    private frameworkSettings?: MicroframeworkSettings;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Configs microframework.
     */
    config(config: MicroframeworkConfig|string|string[]): this {

        const appRootDir = require("app-root-path").path;
        if (config instanceof String) {
            this.allConfiguration = require(appRootDir + "/" + config + ".json") || {};
            if (this.allConfiguration.microframework)
                this.frameworkConfig = this.allConfiguration.microframework;

        } else if (config instanceof Array) { // string[]
            if (config.length > 0) {
                this.allConfiguration = {};
                Object.assign(this.allConfiguration, ...config.map(conf => require(appRootDir + "/" + conf + ".json") || {}));
            }
        } else {
            this.frameworkConfig = config;
        }

        return this;
    }

    /**
     * Registers loader in the framework.
     */
    registerLoader(loader: MicroframeworkLoader): this {
        this.loaders.push(loader);
        return this;
    }

    /**
     * Registers loaders in the framework.
     */
    registerLoaders(loaders: MicroframeworkLoader[]): this;

    /**
     * Registers loaders in the framework.
     */
    registerLoaders(...loaders: MicroframeworkLoader[]): this;

    /**
     * Registers loaders in the framework.
     */
    registerLoaders(loaders: any /* MicroframeworkModule[]|MicroframeworkModule[][] */): this {
        ((loaders as any[]) || []).forEach(loader => {
            if (loader instanceof Array) {
                this.loaders.push(...loader);
            } else {
                this.loaders.push(loader);
            }
        });
        return this;
    }

    /**
     * Bootstraps microframework and loads all loaders.
     */
    bootstrap(): Promise<this> {
        const settings = new MicroframeworkSettings(this.allConfiguration);
        const bootstrapTime = +new Date();

        return this.generateLogo()
            .then(logo => {
                if (logo) console.log(logo);
                return this.createBootstrapTimeout();

            }).then(() => {
                return this.runInSequence(this.loaders, loader => {
                    const loaderResult = loader(settings);
                    if (loaderResult != null && typeof loaderResult.then !== "function") {
                        return loaderResult;
                    } else {
                        return Promise.resolve();
                    }
                });

            }).then(() => {
                if (this.frameworkConfig && this.frameworkConfig.showBootstrapTime)
                    console.log(`Application is up and running. It took ${+new Date() - bootstrapTime - (this.frameworkConfig.bootstrapTimeout || 0)} ms to bootstrap the app.`);

                return this;
            });
    }

    /**
     * Shutdowns microframework and everything loaders registered for shutdown.
     */
    shutdown(): Promise<this> {
        if (!this.frameworkSettings)
            throw new MicroframeworkNotBootstrappedError();

        return this.runInSequence(this.frameworkSettings.getShutdownHandlers(), handler => {
            const handlerResult = handler();
            return handlerResult instanceof Promise ? handlerResult : Promise.resolve();
        }).then(() => this);
    }

    /**
     * Returns microframework settings used and modified by bootstrapped loaders.
     * If framework was not bootstrapped yet, this accessor will throw an error.
     */
    get settings(): MicroframeworkSettings {
        if (!this.frameworkSettings)
            throw new MicroframeworkNotBootstrappedError();

        return this.frameworkSettings;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    /**
     * Runs given callback that returns promise for each item in the given collection in order.
     * Operations executed after each other, right after previous promise being resolved.
     */
    private runInSequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
        const results: U[] = [];
        return collection.reduce((promise, item) => {
            return promise.then(() => {
                return callback(item);
            }).then(result => {
                results.push(result);
            });
        }, Promise.resolve()).then(() => {
            return results;
        });
    }

    /**
     * Prints the logo if it was set in the configuration.
     */
    private generateLogo(): Promise<string> {
        return new Promise((ok, fail) => {
            if (!this.frameworkConfig || !this.frameworkConfig.logo)
                return ok();

            try {
                const asciiArt = require("ascii-art");
                asciiArt.font(this.frameworkConfig.logo, "Doom", (logo: string) => ok(logo.trim() + "\r\n"));

            } catch (err) {
                fail(new MicroframeworkAsciiArtNotInstalledError());
            }
        });
    }

    /**
     * Creates a promise which will resolve when bootstrap timeout is out.
     */
    private createBootstrapTimeout(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            if (!this.frameworkConfig || !this.frameworkConfig.bootstrapTimeout)
                return ok();

            setTimeout(ok, this.frameworkConfig.bootstrapTimeout);
        });
    }

}