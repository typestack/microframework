import {MicroFrameworkBootstrapper} from "./MicroFrameworkBootstrapper";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";

/**
 * Options passed to the init method of the module.
 */
export interface ModuleInitOptions {

    /**
     * Options used by Microframework.
     */
    frameworkSettings: MicroFrameworkSettings;

    /**
     * Container used by Microframework.
     */
    container?: { get(cls: any): any };

    /**
     * Indicates if debug mode is enabled or not.
     */
    debugMode?: boolean;

}

/**
 * Each microframework module must implement this interface and some of required methods.
 */
export interface Module {

    /**
     * The name of the module.
     */
    getName(): string;

    /**
     * Gets the name of the configuration block used in the module.
     */
    getConfigurationName?(): string;

    /**
     * Indicates if configuration block is required for this module or not. By default its not required.
     */
    isConfigurationRequired?(): boolean;

    /**
     * The list of modules (their names) from which this module is dependant.
     */
    getDependentModules?(): string[];

    /**
     * Module can export some data which supposed to be used by other components.
     */
    getModuleExports?<T>(): T;

    /**
     * Initializes module based on the given options. If this module's dependant modules are specified then instances
     * of theses modules will be passed to this method.
     */
    init(options: ModuleInitOptions, configuration?: any, dependentModules?: Module[]): void;

    /**
     * Runs when framework is getting bootstrapped.
     */
    onBootstrap(): Promise<any>;

    /**
     * Runs right after framework is finished its bootstrapping.
     */
    afterBootstrap?(): Promise<any>;

    /**
     * Runs when framework is shouted down or terminated. At this point basically module must close all opened
     * connections if he did and close all opened resources he used.
     */
    onShutdown(): Promise<any>;

}