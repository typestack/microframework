import {Microframework} from "./Microframework";
import {MicroframeworkBootstrapConfig} from "./MicroframeworkBootstrapConfig";
import {MicroframeworkLoader} from "./MicroframeworkLoader";

// -------------------------------------------------------------------------
// Handy Exports
// -------------------------------------------------------------------------

export * from "./MicroframeworkSettings";
export * from "./Microframework";
export * from "./MicroframeworkLoader";
export * from "./ShutdownHandler";
export * from "./MicroframeworkConfig";
export * from "./MicroframeworkBootstrapConfig";

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
export function bootstrapMicroframework(modules: MicroframeworkLoader[]): Promise<Microframework>;

/**
 * Creates a new microframework instance that can be configured and launched.
 */
export function bootstrapMicroframework(configOrModules: MicroframeworkBootstrapConfig|MicroframeworkLoader[]): Promise<Microframework> {
    const bootstrapConfig: MicroframeworkBootstrapConfig = configOrModules instanceof Array ? { loaders: configOrModules } : configOrModules;
    return new Microframework()
        .config(bootstrapConfig.config)
        .registerLoaders(bootstrapConfig.loaders)
        .bootstrap();
}