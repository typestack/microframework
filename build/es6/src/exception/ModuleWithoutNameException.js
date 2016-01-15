class ModuleWithoutNameException extends Error {
    constructor(module) {
        super();
        this.name = 'ModuleWithoutNameException';
        this.message = 'Invalid module has been supplied. Given module ' + JSON.stringify(module) + ' must have a name.';
    }
}
exports.ModuleWithoutNameException = ModuleWithoutNameException;
//# sourceMappingURL=ModuleWithoutNameException.js.map