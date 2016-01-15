class ModuleProblemsException extends Error {
    constructor(message) {
        super();
        this.name = 'ModuleProblemsException';
        this.message = 'Registered modules have a problems: ' + message;
    }
}
exports.ModuleProblemsException = ModuleProblemsException;
//# sourceMappingURL=ModuleProblemsException.js.map