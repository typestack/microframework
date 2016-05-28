import * as fs from "fs";
import Configurator from "configuration-manager";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";
import {MicroFrameworkUtils} from "./MicroFrameworkUtils";

/**
 * Loads configuration files into the framework.
 */
export class ConfigLoader {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONFIG_DIRECTORY = "config";
    public static DEFAULT_CONFIG_FILE = "config.json";
    public static DEFAULT_PARAMETERS_FILE = "parameters.json";

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private settings: MicroFrameworkSettings) {
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

    private loadConfigurations() {
        let configFiles = this.getConfigFiles();
        configFiles
            .map(file => this.requireFile(file))
            .filter(file => !!file)
            .forEach(file => Configurator.addConfiguration(file));

        configFiles
            .map(file => this.requireEnvironmentFile(file))
            .filter(envFile => !!envFile)
            .forEach(envFile => Configurator.addConfiguration(envFile));
    }

    private loadParameters() {
        let merge = (file: any, parameters: any) => Object.keys(file).forEach(c => parameters[c] = file[c]);
        let parameters: any = {};
        let parametersFiles = this.getParameterFiles();

        parametersFiles
            .map(file => this.requireFile(file))
            .filter(file => !!file)
            .forEach(file => merge(file, parameters));
        parametersFiles
            .map(fileName => this.requireEnvironmentFile(fileName))
            .filter(envFile => !!envFile)
            .forEach(envFile => merge(envFile, parameters));

        Configurator.replaceWithParameters(parameters);
    }

    private requireFile(file: string): any {
        try {
            fs.statSync(file);
            return require(file);
        } catch (e) { /* file does not exist, skip */ }
        return undefined;
    }

    private requireEnvironmentFile(file: string): any {
        let environment = this.getEnvironment();
        if (environment) {
            let envConfig = MicroFrameworkUtils.getEnvironmentFile(file, environment);
            try {
                fs.statSync(envConfig);
                return require(envConfig);
            } catch (e) { /* file does not exist, skip */ }
        }

        return undefined;
    }

    private getEnvironment(): string {
        if (!this.settings.environment && process.env.MICROFRAMEWORK_ENV)
            return process.env.MICROFRAMEWORK_ENV;

        return this.settings.environment;
    }

    private getConfigFiles(): string[] {
        if (!this.settings.configurationFiles)
            return [this.settings.baseDirectory + "/" + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + "/" + ConfigLoader.DEFAULT_CONFIG_FILE];

        return this.settings.configurationFiles;
    }

    private getParameterFiles(): string[] {
        if (!this.settings.parametersFiles)
            return [this.settings.baseDirectory + "/" + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + "/" + ConfigLoader.DEFAULT_PARAMETERS_FILE];

        return this.settings.parametersFiles;
    }

}