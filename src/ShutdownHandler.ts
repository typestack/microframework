/**
 * Signature of the function that will be executed when framework will call its shutdown method.
 * Function can return a Promise, and in the case if it will return a Promise, shutdown function will wait until its resolved.
 */
export interface ShutdownHandler {
    (): Promise<any>|any;
}