import {Module} from "../Module";

export class ModuleWithoutNameException extends Error {
    name = "ModuleWithoutNameException";

    constructor(module: Module) {
        super();
        this.message = "Invalid module has been supplied. Given module " + JSON.stringify(module) + " must have a name.";
    }

}