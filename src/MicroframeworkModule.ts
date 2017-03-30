import {MicroframeworkSettings} from "./MicroframeworkSettings";

/**
 * Microframework module is some functionality needs to be executed in order.
 */
export interface MicroframeworkModule {
    (options?: MicroframeworkSettings): Promise<any>|any;
}