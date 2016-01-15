var Container_1 = require("typedi/Container");
var MicroFrameworkUtils_1 = require("./MicroFrameworkUtils");
var DependenciesMissingException_1 = require("./exception/DependenciesMissingException");
var ModuleConfigurationMissingException_1 = require("./exception/ModuleConfigurationMissingException");
var ModuleProblemsException_1 = require("./exception/ModuleProblemsException");
var NoModulesLoadedException_1 = require("./exception/NoModulesLoadedException");
var ModuleAlreadyRegisteredException_1 = require("./exception/ModuleAlreadyRegisteredException");
var ModuleWithoutNameException_1 = require("./exception/ModuleWithoutNameException");
/**
 * Registry for framework modules.
 */
class ModuleRegistry {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(settings, configuration, configurator) {
        this.settings = settings;
        this.configuration = configuration;
        this.configurator = configurator;
        // -------------------------------------------------------------------------
        // Properties
        // -------------------------------------------------------------------------
        this.modules = [];
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Registers all given modules in the framework.
     */
    registerModules(modules) {
        modules.forEach(mod => this.registerModule(mod));
    }
    /**
     * Registers a new module in the framework.
     */
    registerModule(module) {
        if (!module.getName())
            throw new ModuleWithoutNameException_1.ModuleWithoutNameException(module);
        let moduleWithSameName = this.modules.reduce((found, mod) => mod.getName() === module.getName() ? mod : found, undefined);
        if (moduleWithSameName)
            throw new ModuleAlreadyRegisteredException_1.ModuleAlreadyRegisteredException(module.getName());
        this.modules.push(module);
    }
    /**
     * Finds a module with given type registered in the registry.
     */
    findModuleByType(type) {
        return this.modules.reduce((found, module) => module instanceof type ? module : found, undefined);
    }
    /**
     * Bootstraps all modules.
     */
    bootstrapAllModules() {
        if (this.modules.length === 0)
            throw new NoModulesLoadedException_1.NoModulesLoadedException();
        // sort modules in a
        try {
            MicroFrameworkUtils_1.MicroFrameworkUtils.sortModulesByDependencies(this.modules);
        }
        catch (error) {
            throw new ModuleProblemsException_1.ModuleProblemsException(error.message ? error.message : '');
        }
        this.modules.forEach(mod => {
            const config = {
                frameworkSettings: MicroFrameworkUtils_1.MicroFrameworkUtils.deepClone(this.settings),
                debugMode: this.configuration.debugMode || false,
                container: Container_1.Container
            };
            mod.init(config, this.findConfigurationForModule(mod), this.findDependantModulesForModule(mod));
        });
        if (this.configuration.bootstrap && this.configuration.bootstrap.timeout > 0) {
            return new Promise((ok, fail) => {
                setTimeout(() => ok(this.bootstrapModules()), this.configuration.bootstrap.timeout);
            });
        }
        return this.bootstrapModules();
    }
    /**
     * Shutdowns all modules.
     */
    shutdownAllModules() {
        return Promise.all(this.modules.map(mod => mod.onShutdown()))
            .then(() => { });
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    bootstrapModules() {
        return Promise.all(this.modules.map(mod => mod.onBootstrap()))
            .then(() => Promise.all(this.modules.map(module => module.afterBootstrap ? module.afterBootstrap() : undefined)))
            .then(() => { })
            .catch(err => {
            return this.shutdownAllModules().then(function () { throw err; });
        });
    }
    findConfigurationForModule(module) {
        if (!module.getConfigurationName || !module.getConfigurationName())
            return undefined;
        let config = this.configurator.get(module.getConfigurationName());
        if (!config && module.isConfigurationRequired && module.isConfigurationRequired())
            throw new ModuleConfigurationMissingException_1.ModuleConfigurationMissingException(module.getName());
        return config;
    }
    findDependantModulesForModule(module) {
        if (!module.getDependentModules || !module.getDependentModules() || !module.getDependentModules().length)
            return undefined;
        let missingDependantModuleNames = [];
        let dependantModules = module.getDependentModules().map(dependantModuleName => {
            let dependantModule = this.modules.reduce((found, mod) => mod.getName() === dependantModuleName ? mod : found, undefined);
            if (!dependantModule)
                missingDependantModuleNames.push(dependantModuleName);
            return dependantModule;
        });
        if (missingDependantModuleNames.length > 0)
            throw new DependenciesMissingException_1.DependenciesMissingException(module.getName(), missingDependantModuleNames);
        return dependantModules;
    }
}
exports.ModuleRegistry = ModuleRegistry;
//# sourceMappingURL=ModulesRegistry.js.map