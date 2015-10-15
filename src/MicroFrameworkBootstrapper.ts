import {ModuleRegistry} from "./ModulesRegistry";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";
import {ConfigLoader} from "./ConfigLoader";
import {Container} from "typedi/Container";
import {Configurator} from "t-configurator/Configurator";
import {Module} from "./Module";
import {defaultConfigurator} from "t-configurator/Configurator";

/**
 * This class runs microframework and its specified modules.
 */
export class MicroFrameworkBootstrapper {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private modulesRegistry: ModuleRegistry;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private settings: MicroFrameworkSettings) {
        this.modulesRegistry = new ModuleRegistry(settings);
        new ConfigLoader(settings).load();
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

    /**
     * Gets the configurator used to config framework and its modules.
     */
    get configurator(): Configurator {
        return defaultConfigurator; // todo: find the way to remove global dependency
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

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

    /**
     * Bootstraps the framework and all its modules.
     */
    bootstrap(): Promise<void> {
        return this.modulesRegistry.bootstrapAllModules();
    }

    /**
     * Shutdowns the framework and all its modules.
     */
    shutdown(): Promise<void> {
        return this.modulesRegistry.shutdownAllModules();
    }

}