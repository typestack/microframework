class NoModulesLoadedException extends Error {
    constructor() {
        super();
        this.name = 'NoModulesLoadedException';
        this.message = 'You did not register any modules into framework.';
    }
}
exports.NoModulesLoadedException = NoModulesLoadedException;
//# sourceMappingURL=NoModulesLoadedException.js.map