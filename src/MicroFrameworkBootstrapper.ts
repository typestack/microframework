import * as bodyParser from "body-parser";
import * as fs from "fs";
import {Express} from "express";
import {Container} from "typedi/Container";
import {ControllerUtils} from "type-controllers/ControllerUtils";
import {defaultActionRegistry} from "type-controllers/ActionRegistry";
import {ConnectionManager} from "typeodm/connection/ConnectionManager";
import {MongodbDriver} from "typeodm/driver/MongodbDriver";
import {defaultConfigurator} from "t-configurator/Configurator";
import {MicroFrameworkConfig} from "./MicroFrameworkConfig";
import {Server} from "http";
import {MicroFrameworkRunOptions} from "./MicroFrameworkRunOptions";
import {MicroFrameworkUtils} from "./MicroFrameworkUtils";

export enum RunOptions {
    EXPRESS = 1,
    TYPEODM = 2,
    CONTROLLERS = 3
}

/**
 * MicroFramework is a bundle of express.js, mongodb ODM, dependancy injection framework and restful controllers for
 * your apps using Typescript.
 */
export class MicroFrameworkBootstrapper {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_ODM_DOCUMENT_DIRECTORY = 'document';
    public static DEFAULT_ODM_SUBSCRIBER_DIRECTORY = 'subscriber';
    public static DEFAULT_CONTROLLER_DIRECTORY = 'controller';
    public static DEFAULT_CONFIG_DIRECTORY = 'configuration';
    public static DEFAULT_CONFIG_FILE = 'config.json';
    public static DEFAULT_PARAMETERS_FILE = 'parameters.json';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _express: Express;
    private _odmConnectionManager: ConnectionManager;
    private _expressServer: Server;
    private configuration: MicroFrameworkConfig;
    private defaultRunOptions:RunOptions[] = [
        RunOptions.EXPRESS,
        RunOptions.TYPEODM,
        RunOptions.CONTROLLERS
    ];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private options: MicroFrameworkRunOptions) {
        this.loadConfigurations();
        this.loadParameters();
        this.configuration = defaultConfigurator.getAll();
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get express(): Express {
        return this._express;
    }

    get expressServer(): Server {
        return this._expressServer;
    }

    get odmConnectionManager(): ConnectionManager {
        return this._odmConnectionManager;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    bootstrap(runOptions?: RunOptions[]): Promise<void> {
        runOptions = runOptions || this.defaultRunOptions;

        let promises: Promise<void>[] = [];
        let isExpress = runOptions.indexOf(RunOptions.EXPRESS) !== -1;
        let isTypeodm = runOptions.indexOf(RunOptions.TYPEODM) !== -1;
        let isControllers = runOptions.indexOf(RunOptions.CONTROLLERS) !== -1;

        if (isExpress)
            this.setupExpress();

        if (isTypeodm && this.configuration.typeodm)
            promises.push(this.setupODM());

        return Promise.all(promises)
            .then(() => {
                if (isExpress && isControllers)
                    this.setupControllers();
            })
            .then(() => { })
            .catch(err => {
                if (isExpress && this._expressServer) this._expressServer.close();
                throw err;
            });
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    private setupODM(): Promise<any> {
        this._odmConnectionManager = Container.get<ConnectionManager>(ConnectionManager);
        this._odmConnectionManager.container = Container;

        if (this.configuration.typeodm.driver === 'mongodb')
            this._odmConnectionManager.addConnection(new MongodbDriver(require('mongodb')));

        this._odmConnectionManager.importDocumentsFromDirectories(this.getOdmDocumentDirectories());
        this._odmConnectionManager.importSubscribersFromDirectories(this.getOdmSubscriberDirectories());
        return this._odmConnectionManager.getConnection().connect(this.configuration.typeodm.connection);
    }

    private setupExpress() {
        let port = (this.configuration.express ? this.configuration.express.port : undefined) || 3000;
        let bodyParserType = this.configuration.express ? this.configuration.express.bodyParser : undefined;
        let bodyParserOptions = this.configuration.express ? this.configuration.express.bodyParserOptions : undefined;

        this._express = require('express')();
        if (bodyParserType) {
            switch (bodyParserType) {
                case 'json':
                    this._express.use(bodyParser.json(bodyParserOptions));
                    break;
                case 'text':
                    this._express.use(bodyParser.text(bodyParserOptions));
                    break;
                case 'raw':
                    this._express.use(bodyParser.raw(bodyParserOptions));
                    break;
                case 'urlencoded':
                    this._express.use(bodyParser.urlencoded(bodyParserOptions));
                    break;
                default:
                    throw new Error('Incorrect body parser type (' + bodyParserType + ') is specified in the microframework configuration');
            }
        }
        this._expressServer = this._express.listen(port);
    }

    private setupControllers() {
        ControllerUtils.requireAll(this.getControllerDirectories());
        defaultActionRegistry.container = Container;
        defaultActionRegistry.registerActions(this._express); // register actions in the app
    }

    private getConfigFiles(): string[] {
        return this.options.configurationFiles ||
            [this.options.baseDirectory + '/' + MicroFrameworkBootstrapper.DEFAULT_CONFIG_DIRECTORY + '/' + MicroFrameworkBootstrapper.DEFAULT_CONFIG_FILE];
    }

    private getParameterFiles(): string[] {
        return this.options.parametersFiles ||
            [this.options.baseDirectory + '/' + MicroFrameworkBootstrapper.DEFAULT_CONFIG_DIRECTORY + '/' + MicroFrameworkBootstrapper.DEFAULT_PARAMETERS_FILE];
    }

    private getOdmDocumentDirectories(): string[] {
        return this.options.odmDocumentsDirectories ||
            [this.options.baseDirectory + '/' + MicroFrameworkBootstrapper.DEFAULT_ODM_DOCUMENT_DIRECTORY];
    }

    private getOdmSubscriberDirectories(): string[] {
        return this.options.odmSubscribersDirectories ||
            [this.options.baseDirectory + '/' + MicroFrameworkBootstrapper.DEFAULT_ODM_SUBSCRIBER_DIRECTORY];
    }

    private getControllerDirectories(): string[] {
        return this.options.controllersDirectories ||
            [this.options.baseDirectory + '/' + MicroFrameworkBootstrapper.DEFAULT_CONTROLLER_DIRECTORY];

    }

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
        let environment = this.options.environment || process.env.NODE_ENV;
        if (environment) {
            let envConfig = MicroFrameworkUtils.getEnvironmentFile(file, environment);
            try {
                fs.statSync(envConfig);
                return require(envConfig);
            } catch (e) { /* file does not exist, skip */ }
        }

        return undefined;
    }

}