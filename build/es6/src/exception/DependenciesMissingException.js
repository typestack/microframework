class DependenciesMissingException extends Error {
    constructor(moduleName, dependModules) {
        super();
        this.name = 'DependenciesMissingException';
        this.message = 'Module error. ' + moduleName + ' depend on ' + dependModules + ' but no dependencies were ' +
            'resolved. Maybe you need to install and register theses modules in a microframework?';
    }
}
exports.DependenciesMissingException = DependenciesMissingException;
//# sourceMappingURL=DependenciesMissingException.js.map