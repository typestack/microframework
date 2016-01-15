class MicroFrameworkRegistry {
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    static put(microFramework) {
        this.instances.push(microFramework);
    }
    static remove(microFramework) {
        const index = this.instances.indexOf(microFramework);
        if (index !== -1)
            this.instances.splice(index, 1);
    }
    static get(name) {
        return this.instances.reduce((found, instance) => instance.name === name ? instance : found, undefined);
    }
    static has(name) {
        return this.get(name) !== undefined;
    }
}
// -------------------------------------------------------------------------
// Private Static Properties
// -------------------------------------------------------------------------
MicroFrameworkRegistry.instances = [];
exports.MicroFrameworkRegistry = MicroFrameworkRegistry;
//# sourceMappingURL=MicroFrameworkRegistry.js.map