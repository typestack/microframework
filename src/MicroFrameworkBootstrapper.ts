import * as path from "path";
import {Container} from "typedi/Container";
import {ModuleRegistry} from "./ModulesRegistry";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";
import {ConfigLoader} from "./ConfigLoader";
import {defaultConfigurator, Configurator} from "configurator.ts/Configurator";
import {Module} from "./Module";
import {MicroFrameworkConfig} from "./MicroFrameworkConfig";
import {MicroFrameworkRegistry} from "./MicroFrameworkRegistry";
import {MicroframeworkNameAlreadyExistException} from "./exception/MicroframeworkNameAlreadyExistException";

/**
 * This class runs microframework and its specified modules.
 */
export class MicroFrameworkBootstrapper {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _name: string;
    private settings: MicroFrameworkSettings;
    private configuration: MicroFrameworkConfig;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(settings: MicroFrameworkSettings);
    constructor(name: string, settings: MicroFrameworkSettings);
    constructor(nameOrSettings: string|MicroFrameworkSettings,
                settings?: MicroFrameworkSettings,
                private _configurator?: Configurator,
                private modulesRegistry?: ModuleRegistry,
                configLoader?: ConfigLoader) {
        if (typeof nameOrSettings === "string") {
            this._name = (<string> nameOrSettings);
            this.settings = settings;
        } else {
            this._name = "default";
            this.settings = <MicroFrameworkSettings> nameOrSettings;
        }

        // normalize settings
        this.settings.srcDirectory = path.normalize(this.settings.srcDirectory);
        if (!this.settings.baseDirectory)
            this.settings.baseDirectory = require("find-root")(this.settings.srcDirectory);

        if (!_configurator)
            this._configurator = defaultConfigurator;
        if (!configLoader)
            configLoader = new ConfigLoader(this.settings);

        configLoader.load();
        this.configuration = this._configurator.get("framework") || {};
        if (this.settings && !modulesRegistry)
            this.modulesRegistry = new ModuleRegistry(this.settings, this.configuration, this._configurator);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Gets the Container of the typedi module.
     */
    get container(): Container {
        return Container;
    }

    get name(): string {
        return this._name;
    }

    /**
     * Gets the configurator used to config framework and its modules.
     */
    get configurator(): Configurator {
        return this._configurator; // todo: find the way to remove global dependency
    }

    /**
     * Gets the root directory of the running application.
     */
    get rootDirectory(): string {
        return this.settings.baseDirectory; // todo: later rename this to rootDirectory too
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Sets the name used by microframework. Note that name must be set before bootstrapping the framework.
     */
    setName(name: string): MicroFrameworkBootstrapper {
        if (MicroFrameworkRegistry.has(name || "default"))
            throw new MicroframeworkNameAlreadyExistException(name);

        this._name = name || "default";
        return this;
    }

    /**
     * Sets the settings. Used if settings was not passed during object construction.  Note that settings must be set
     * before bootstrapping the framework.
     */
    setSettings(settings: MicroFrameworkSettings): MicroFrameworkBootstrapper {
        this.settings = settings;
        return this;
    }

    /**
     * Registers all given modules in the framework.
     */
    registerModules(modules: Module[]): MicroFrameworkBootstrapper {
        this.modulesRegistry.registerModules(modules);
        return this;
    }

    /**
     * Registers a new module in the framework.
     */
    registerModule(module: Module): MicroFrameworkBootstrapper {
        this.modulesRegistry.registerModule(module);
        return this;
    }

    findModuleByType(type: Function): Module {
        return this.modulesRegistry.findModuleByType(type);
    }

    /**
     * Bootstraps the framework and all its modules.
     */
    bootstrap(): Promise<MicroFrameworkBootstrapper> {
        MicroFrameworkRegistry.put(this);
        return this.modulesRegistry.bootstrapAllModules().then(() => this);
    }

    /**
     * Shutdowns the framework and all its modules.
     */
    shutdown(): Promise<void> {
        MicroFrameworkRegistry.remove(this);
        return this.modulesRegistry.shutdownAllModules();
    }

}