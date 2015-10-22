/**
 * Settings used my microframework.
 */
export interface MicroFrameworkSettings {

    /**
     * Need to pass a node's __dirname constant here, this let framework to know your base directory.
     */
    baseDirectory: string;

    /**
     * Current environment where framework is running right now.
     */
    environment?: string;

    /**
     * List of configuration files that will be loaded to get configurations from it.
     */
    configurationFiles?: string[]; // default is './configuration/config.json'

    /**
     * List of parameter files that will be loaded to get parameters from it.
     */
    parametersFiles?: string[]; // defaults is './configuration/parameters.json'

}