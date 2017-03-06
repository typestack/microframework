import {MicroframeworkBootstrapSettings} from "./MicroframeworkBootstrapSettings";

/**
 * Microframework module is some functionality needs to be executed in order.
 */
export interface MicroframeworkModule {
    (options?: MicroframeworkBootstrapSettings): Promise<any>|any;
}