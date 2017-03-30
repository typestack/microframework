import {MicroframeworkSettings} from "./MicroframeworkSettings";
import {MicroframeworkModule} from "./MicroframeworkModule";
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
     * Stores all registered microframework modules.
     */
    private modules: MicroframeworkModule[] = [];

    /**
     * Stores all settings of modules bootstrapped by microframework.
     * If its undefined it means framework is not bootstrapped yet.
     */
    private settings?: MicroframeworkSettings;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Configs microframework.
     */
    config(config: MicroframeworkConfig): this {
        this.frameworkConfig = config;
        return this;
    }

    /**
     * Registers module in the framework.
     */
    registerModule(module: MicroframeworkModule): this {
        this.modules.push(module);
        return this;
    }

    /**
     * Registers modules in the framework.
     */
    registerModules(modules: MicroframeworkModule[]): this;

    /**
     * Registers modules in the framework.
     */
    registerModules(...modules: MicroframeworkModule[]): this;

    /**
     * Registers modules in the framework.
     */
    registerModules(modules: any /* MicroframeworkModule[]|MicroframeworkModule[][] */): this {
        ((modules as any[]) || []).forEach(module => {
            if (module instanceof Array) {
                this.modules.push(...module);
            } else {
                this.modules.push(module);
            }
        });
        return this;
    }

    /**
     * Bootstraps all modules.
     */
    bootstrap(): Promise<this> {
        const settings = new MicroframeworkSettings();
        const bootstrapTime = +new Date();

        return this.generateLogo()
            .then(logo => {
                if (logo) console.log(logo);
                return this.createBootstrapTimeout();

            }).then(() => {
                return this.runInSequence(this.modules, module => {
                    const moduleResult = module(settings);
                    return moduleResult instanceof Promise ? moduleResult : Promise.resolve();
                });

            }).then(() => {
                if (this.frameworkConfig && this.frameworkConfig.showBootstrapTime)
                    console.log(`Application is up and running. It took ${+new Date() - bootstrapTime - (this.frameworkConfig.bootstrapTimeout || 0)} ms to bootstrap the app.`);

                return this;
            });
    }

    /**
     * Shutdowns all modules.
     */
    shutdown(): Promise<this> {
        if (!this.settings)
            throw new MicroframeworkNotBootstrappedError();

        return this.runInSequence(this.settings.getShutdownHandlers(), handler => {
            const handlerResult = handler();
            return handlerResult instanceof Promise ? handlerResult : Promise.resolve();
        }).then(() => this);
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