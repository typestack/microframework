export class DependenciesMissingException extends Error {
    name = "DependenciesMissingException";

    constructor(moduleName: string, dependModules: string[]) {
        super();
        this.message = "Module error. " + moduleName + " depend on " + dependModules + " but no dependencies were " +
            "resolved. Maybe you need to install and register theses modules in a microframework?";
    }

}