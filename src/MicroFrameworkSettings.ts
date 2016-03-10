/**
 * Settings used my microframework.
 */
export interface MicroFrameworkSettings {

    /**
     * This must be a root of your application, where your package.json is located. Used to access non-source code
     * resources like configurations, schemas, etc. This variable is calucalted automatically by framework,
     * however you can specify your path in some cases.
     */
    baseDirectory?: string;

    /**
     * Path to your source code. (usually "src" or "app"). Usually its a "__dirname" of your microframework bootstrapper.
     * This variable is going throw the process of normalization, so no worry of specifying relative paths.
     */
    srcDirectory: string;

    /**
     * Current environment where framework is running right now.
     */
    environment?: string;

    /**
     * List of configuration files that will be loaded to get configurations from it.
     */
    configurationFiles?: string[]; // default is "./config/config.json"

    /**
     * List of parameter files that will be loaded to get parameters from it.
     */
    parametersFiles?: string[]; // defaults is "./config/parameters.json"

}