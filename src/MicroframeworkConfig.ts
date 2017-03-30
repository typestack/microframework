/**
 * Microframework configuration.
 */
export interface MicroframeworkConfig {

    /**
     * Logo needs to be used before application launches.
     * To use logo ansi-art module should be installed.
     *
     * @experimental
     */
    logo?: string;

    /**
     * If set to true then framework shows how much time was spend to bootstrap all modules.
     */
    showBootstrapTime?: boolean;

    /**
     * Indicates is debug mode is enabled. In debug mode some extra information and logs can be exposed to the developer.
     */
    debug?: boolean;

    /**
     * Number of milliseconds to wait before framework will bootstrap all modules.
     * One use case of this may be, for example if you are launching other services in parallel and want to be sure
     * that small amount of time is passed and they all are launched before framework bootstrap all modules.
     */
    bootstrapTimeout?: number;

}
