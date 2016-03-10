export class ModuleConfigurationMissingException extends Error {
    name = "ModuleConfigurationMissingException";

    constructor(moduleName: string) {
        super();
        this.message = "Configuration for module " + moduleName + " is required, however its not set";
    }

}