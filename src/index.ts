import {Microframework} from "./Microframework";
import {MicroframeworkBootstrapConfig} from "./MicroframeworkBootstrapConfig";
import {MicroframeworkModule} from "./MicroframeworkModule";

// -------------------------------------------------------------------------
// Handy Exports
// -------------------------------------------------------------------------

export * from "./MicroframeworkBootstrapSettings";
export * from "./Microframework";
export * from "./MicroframeworkModule";
export * from "./MicroframeworkShutdownHandler";
export * from "./MicroframeworkConfig";

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

/**
 * Creates a new microframework instance that can be configured and launched.
 */
export function bootstrapMicroframework(config: MicroframeworkBootstrapConfig): Promise<Microframework>;

/**
 * Creates a new microframework instance that can be configured and launched.
 */
export function bootstrapMicroframework(modules: MicroframeworkModule[]): Promise<Microframework>;

/**
 * Creates a new microframework instance that can be configured and launched.
 */
export function bootstrapMicroframework(configOrModules: MicroframeworkBootstrapConfig|MicroframeworkModule[]): Promise<Microframework> {
    const bootstrapConfig: MicroframeworkBootstrapConfig = configOrModules instanceof Array ? { modules: configOrModules } : configOrModules;
    return new Microframework()
        .config(bootstrapConfig.config)
        .registerModules(bootstrapConfig.modules)
        .bootstrap();
}