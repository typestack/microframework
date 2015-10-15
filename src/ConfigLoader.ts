import * as fs from "fs";
import {Container} from "typedi/Container";
import {defaultConfigurator} from "t-configurator/Configurator";
import {MicroFrameworkConfig} from "./MicroFrameworkConfig";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";
import {MicroFrameworkUtils} from "./MicroFrameworkUtils";
import {Configurator} from "t-configurator/Configurator";
import {Module} from "./Module";
import {DependenciesMissingException} from "./exception/DependenciesMissingException";

/**
 * Loads configuration files into the framework.
 */
export class ConfigLoader {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONFIG_DIRECTORY = 'configuration';
    public static DEFAULT_CONFIG_FILE = 'config.json';
    public static DEFAULT_PARAMETERS_FILE = 'parameters.json';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private configuration: MicroFrameworkConfig;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private settings: MicroFrameworkSettings) {
        this.configuration = defaultConfigurator.get('framework');
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
            .forEach(file => defaultConfigurator.addConfiguration(file));

        configFiles
            .map(file => this.requireEnvironmentFile(file))
            .filter(envFile => !!envFile)
            .forEach(envFile => defaultConfigurator.addConfiguration(envFile));
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

        defaultConfigurator.replaceWithParameters(parameters);
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
        if (!this.configuration || !this.configuration.environment)
            return process.env.NODE_ENV;

        return this.configuration.environment;
    }

    private getConfigFiles(): string[] {
        if (!this.configuration || !this.configuration.configurationFiles)
            return [this.settings.baseDirectory + '/' + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + '/' + ConfigLoader.DEFAULT_CONFIG_FILE];

        return this.configuration.configurationFiles;
    }

    private getParameterFiles(): string[] {
        if (!this.configuration || !this.configuration.parametersFiles)
            return [this.settings.baseDirectory + '/' + ConfigLoader.DEFAULT_CONFIG_DIRECTORY + '/' + ConfigLoader.DEFAULT_PARAMETERS_FILE];

        return this.configuration.parametersFiles;
    }

}