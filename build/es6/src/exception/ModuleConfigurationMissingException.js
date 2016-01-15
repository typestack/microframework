class ModuleConfigurationMissingException extends Error {
    constructor(moduleName) {
        super();
        this.name = 'ModuleConfigurationMissingException';
        this.message = 'Configuration for module ' + moduleName + ' is required, however its not set';
    }
}
exports.ModuleConfigurationMissingException = ModuleConfigurationMissingException;
//# sourceMappingURL=ModuleConfigurationMissingException.js.map