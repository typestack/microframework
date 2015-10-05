import * as bodyParser from 'body-parser';
import {Express} from "express";
import {Container} from "typedi/Container";
import {ControllerUtils} from "type-controllers/ControllerUtils";
import {defaultActionRegistry} from "type-controllers/ActionRegistry";
import {ConnectionOptions} from "typeodm/connection/ConnectionOptions";
import {ConnectionManager} from "typeodm/connection/ConnectionManager";
import {MongodbDriver} from "typeodm/driver/MongodbDriver";
import {MicroFrameworkConfig} from "./MicroFrameworkConfig";
import {Server} from "http";

/**
 * MicroFramework is a bundle of express.js, mongodb ODM, dependancy injection framework and restful controllers for
 * your apps using Typescript.
 */
export class MicroFrameworkRunner {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_ODM_DOCUMENT_DIRECTORY = 'document';
    public static DEFAULT_ODM_SUBSCRIBER_DIRECTORY = 'subscriber';
    public static DEFAULT_CONTROLLER_DIRECTORY = 'controller';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _express: Express;
    private _odmConnectionManager: ConnectionManager;
    private _expressServer: Server;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private directory: string,
                private configuration: MicroFrameworkConfig) { }

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

    run(): Promise<void> {
        let promises: Promise<void>[] = [];
        this.setupExpress();

        if (this.configuration.odm)
            promises.push(this.setupODM());

        return Promise.all(promises)
            .then(() => this.setupControllers())
            .then(() => { })
            .catch(err => {
                if (this._expressServer) this._expressServer.close();
                throw err;
            });
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    private setupODM(): Promise<any> {
        let documentDirectories = this.configuration.odm.documentsDirectories ||
            [this.directory + '/' + MicroFrameworkRunner.DEFAULT_ODM_DOCUMENT_DIRECTORY];
        let subscriberDirectories = this.configuration.odm.subscribersDirectories ||
            [this.directory + '/' + MicroFrameworkRunner.DEFAULT_ODM_SUBSCRIBER_DIRECTORY];

        this._odmConnectionManager = Container.get(ConnectionManager);
        this._odmConnectionManager.container = Container;

        if (this.configuration.odm.driver === 'mongodb')
            this._odmConnectionManager.addConnection(new MongodbDriver(require('mongodb')));

        this._odmConnectionManager.importDocumentsFromDirectories(documentDirectories);
        this._odmConnectionManager.importSubscribersFromDirectories(subscriberDirectories);
        return this._odmConnectionManager.getConnection().connect(this.configuration.odm.connection);
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
        let controllersDirectories = this.configuration.controllers ? this.configuration.controllers.controllerDirectories : null;
        controllersDirectories = controllersDirectories || [this.directory + '/' + MicroFrameworkRunner.DEFAULT_CONTROLLER_DIRECTORY];

        ControllerUtils.requireAll(controllersDirectories);
        defaultActionRegistry.container = Container;
        defaultActionRegistry.registerActions(this._express); // register actions in the app
    }

}