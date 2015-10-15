/**
 * Microframework configuration.
 */
export interface MicroFrameworkConfig {

    /**
     * List of configuration files that will be loaded to get configurations from it.
     */
    configurationFiles?: string[]; // default is './configuration/config.json'

    /**
     * List of parameter files that will be loaded to get parameters from it.
     */
    parametersFiles?: string[]; // defaults is './configuration/parameters.json'

    /**
     * Current environment where framework is running right now.
     */
    environment?: string;

}
