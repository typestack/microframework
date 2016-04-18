export class ModuleAlreadyRegisteredException extends Error {
    name = "ModuleAlreadyRegisteredException";

    constructor(moduleName: string) {
        super();
        this.message = "Module with such name (" + moduleName + ") already registered ";
    }

}