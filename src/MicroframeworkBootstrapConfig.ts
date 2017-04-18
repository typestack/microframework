import {MicroframeworkConfig} from "./MicroframeworkConfig";
import {MicroframeworkLoader} from "./MicroframeworkLoader";

/**
 * Microframework bootstrap configuration.
 */
export interface MicroframeworkBootstrapConfig {

    /**
     * Microframework configuration.
     * Can be file name, or array of file names from where to read configuration.
     * File should be relative to package.json of the project (project root).
     */
    config?: MicroframeworkConfig|string|string[];

    /**
     * Loaders to be registered in microframework and executed on microframework bootstrap.
     */
    loaders?: MicroframeworkLoader[];

}
