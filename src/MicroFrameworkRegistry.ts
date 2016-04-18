import {MicroFrameworkBootstrapper} from "./MicroFrameworkBootstrapper";

export class MicroFrameworkRegistry {

    // -------------------------------------------------------------------------
    // Private Static Properties
    // -------------------------------------------------------------------------

    private static instances: MicroFrameworkBootstrapper[] = [];

    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------

    static put(microFramework: MicroFrameworkBootstrapper) {
        this.instances.push(microFramework);
    }

    static remove(microFramework: MicroFrameworkBootstrapper) {
        const index = this.instances.indexOf(microFramework);
        if (index !== -1)
            this.instances.splice(index, 1);
    }

    static get(name: string): MicroFrameworkBootstrapper {
        return this.instances.reduce((found, instance) => instance.name === name ? instance : found, undefined);
    }

    static has(name: string) {
        return this.get(name) !== undefined;
    }

}