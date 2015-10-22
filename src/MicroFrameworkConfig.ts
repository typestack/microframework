/**
 * Microframework configuration.
 */
export interface MicroFrameworkConfig {

    /**
     * Indicates is debug mode is enabled. In debug mode some extra information and logs can be exposed to the developer.
     */
    debugMode?: boolean;

    /**
     * Framework bootstrap configuration.
     */
    bootstrap?: {

        /**
         * Number of milliseconds to wait before framework will bootstrap all modules.
         */
        timeout: number;
    };

}
