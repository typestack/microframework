import {MicroframeworkConfig} from "./MicroframeworkConfig";
import {MicroframeworkModule} from "./MicroframeworkModule";

/**
 * Microframework bootstrap configuration.
 */
export interface MicroframeworkBootstrapConfig {

    /**
     * Microframework configuration.
     */
    config?: MicroframeworkConfig;

    /**
     * Modules needs to be registered in microframework.
     */
    modules?: MicroframeworkModule[];

}
