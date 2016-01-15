var path = require("path");
var Container_1 = require("typedi/Container");
var ModulesRegistry_1 = require("./ModulesRegistry");
var ConfigLoader_1 = require("./ConfigLoader");
var Configurator_1 = require("configurator.ts/Configurator");
var MicroFrameworkRegistry_1 = require("./MicroFrameworkRegistry");
var MicroframeworkNameAlreadyExistException_1 = require("./exception/MicroframeworkNameAlreadyExistException");
/**
 * This class runs microframework and its specified modules.
 */
class MicroFrameworkBootstrapper {
    constructor(nameOrSettings, settings, _configurator, modulesRegistry, configLoader) {
        this._configurator = _configurator;
        this.modulesRegistry = modulesRegistry;
        if (typeof nameOrSettings === 'string') {
            this._name = nameOrSettings;
            this.settings = settings;
        }
        else {
            this._name = 'default';
            this.settings = nameOrSettings;
        }
        // normalize settings
        this.settings.srcDirectory = path.normalize(this.settings.srcDirectory);
        if (!this.settings.baseDirectory)
            this.settings.baseDirectory = require('find-root')(this.settings.srcDirectory);
        if (!_configurator)
            this._configurator = Configurator_1.defaultConfigurator;
        if (!configLoader)
            configLoader = new ConfigLoader_1.ConfigLoader(this.settings);
        configLoader.load();
        this.configuration = this._configurator.get('framework') || {};
        if (this.settings && !modulesRegistry)
            this.modulesRegistry = new ModulesRegistry_1.ModuleRegistry(this.settings, this.configuration, this._configurator);
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Gets the Container of the typedi module.
     */
    get container() {
        return Container_1.Container;
    }
    get name() {
        return this._name;
    }
    /**
     * Gets the configurator used to config framework and its modules.
     */
    get configurator() {
        return this._configurator; // todo: find the way to remove global dependency
    }
    /**
     * Gets the root directory of the running application.
     */
    get rootDirectory() {
        return this.settings.baseDirectory; // todo: later rename this to rootDirectory too
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Sets the name used by microframework. Note that name must be set before bootstrapping the framework.
     */
    setName(name) {
        if (MicroFrameworkRegistry_1.MicroFrameworkRegistry.has(name || 'default'))
            throw new MicroframeworkNameAlreadyExistException_1.MicroframeworkNameAlreadyExistException(name);
        this._name = name || 'default';
        return this;
    }
    /**
     * Sets the settings. Used if settings was not passed during object construction.  Note that settings must be set
     * before bootstrapping the framework.
     */
    setSettings(settings) {
        this.settings = settings;
        return this;
    }
    /**
     * Registers all given modules in the framework.
     */
    registerModules(modules) {
        this.modulesRegistry.registerModules(modules);
        return this;
    }
    /**
     * Registers a new module in the framework.
     */
    registerModule(module) {
        this.modulesRegistry.registerModule(module);
        return this;
    }
    findModuleByType(type) {
        return this.modulesRegistry.findModuleByType(type);
    }
    /**
     * Bootstraps the framework and all its modules.
     */
    bootstrap() {
        MicroFrameworkRegistry_1.MicroFrameworkRegistry.put(this);
        return this.modulesRegistry.bootstrapAllModules().then(() => this);
    }
    /**
     * Shutdowns the framework and all its modules.
     */
    shutdown() {
        MicroFrameworkRegistry_1.MicroFrameworkRegistry.remove(this);
        return this.modulesRegistry.shutdownAllModules();
    }
}
exports.MicroFrameworkBootstrapper = MicroFrameworkBootstrapper;
//# sourceMappingURL=MicroFrameworkBootstrapper.js.map