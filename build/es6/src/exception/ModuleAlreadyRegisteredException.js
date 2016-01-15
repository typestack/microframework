class ModuleAlreadyRegisteredException extends Error {
    constructor(moduleName) {
        super();
        this.name = 'ModuleAlreadyRegisteredException';
        this.message = 'Module with such name (' + moduleName + ') already registered ';
    }
}
exports.ModuleAlreadyRegisteredException = ModuleAlreadyRegisteredException;
//# sourceMappingURL=ModuleAlreadyRegisteredException.js.map