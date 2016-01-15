var fs = require("fs");
var Configurator_1 = require("configurator.ts/Configurator");
var MicroFrameworkUtils_1 = require("./MicroFrameworkUtils");
/**
 * Loads configuration files into the framework.
 */
class ConfigLoader {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(settings) {
        this.settings = settings;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Loads all configuration files and parameters.
     */
    load() {
        this.loadConfigurations();
        this.loadParameters();
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    loadConfigurations() {
        let configFiles = this.getConfigFiles();
        configFiles
            .map(file => this.requireFile(file))
            .filter(file => !!file)
            .forEach(file => Configurator_1.defaultConfigurator.addConfiguration(file));
        configFiles
            .map(file => this.requireEnvironmentFile(file))
            .filter(envFile => !!envFile)
            .forEach(envFile => Configurator_1.defaultConfigurator.addConfiguration(envFile));
    }
    loadParameters() {
        let merge = (file, parameters) => Object.keys(file).forEach(c => parameters[c] = file[c]);
        let parameters = {};
        let parametersFiles = this.getParameterFiles();
        parametersFiles
            .map(file => this.requireFile(file))
            .filter(file => !!file)
            .forEach(file => merge(file, parameters));
        parametersFiles
            .map(fileName => this.requireEnvironmentFile(fileName))
            .filter(envFile => !!envFile)
            .forEach(envFile => merge(envFile, parameters));
        Configurator_1.defaultConfigurator.replaceWithParameters(parameters);
    }
    requireFile(file) {
        try {
            fs.statSync(file);
            return require(file);
        }
        catch (e) { }
        return undefined;
    }
    requireEnvironmentFile(file) {
        let environment = this.getEnvironment();
        if (environment) {
            let envConfig = MicroFrameworkUtils_1.MicroFrameworkUtils.getEnvironmentFile(file, environment);
            try {
                fs.statSync(envConfig);
                return require(envConfig);
            }
            catch (e) { }
        }
        return undefined;
    }
    getEnvironment() {
        if (!this.settings.environment)
            return process.env.NODE_ENV;
        return this.settings.environment;
    }
    getConfigFiles() {
        if (!this.settings.configurationFiles)
            return [this.settings.baseDirectory + '/' + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + '/' + ConfigLoader.DEFAULT_CONFIG_FILE];
        return this.settings.configurationFiles;
    }
    getParameterFiles() {
        if (!this.settings.parametersFiles)
            return [this.settings.baseDirectory + '/' + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + '/' + ConfigLoader.DEFAULT_PARAMETERS_FILE];
        return this.settings.parametersFiles;
    }
}
// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------
ConfigLoader.DEFAULT_CONFIG_DIRECTORY = 'config';
ConfigLoader.DEFAULT_CONFIG_FILE = 'config.json';
ConfigLoader.DEFAULT_PARAMETERS_FILE = 'parameters.json';
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=ConfigLoader.js.map