/**
 * Thrown when microframework is shutdown before being bootstrapped.
 */
export class MicroframeworkNotBootstrappedError extends Error {

    constructor() {
        super();
        Object.setPrototypeOf(this, MicroframeworkNotBootstrappedError.prototype);

        this.name = "MicroframeworkNotBootstrappedError";
        this.message = `Cannot shutdown microframework because its not bootstrapped yet.`;
    }

}