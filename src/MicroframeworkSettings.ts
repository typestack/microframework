import {ShutdownHandler} from "./ShutdownHandler";

/**
 * Bootstrap settings used across all loader.
 * Used to register shutdown handlers - special functions that will be executed when framework is shutdown.
 * Also can be used to store and share data across modules.
 */
export class MicroframeworkSettings {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    /**
     * Data which can be used to share data across modules.
     */
    private data: { [key: string]: any } = {};

    /**
     * Special functions that will be executed when framework is shutdown.
     */
    private shutdownHandlers: ShutdownHandler[] = [];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private config: any) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Sets data that can be used across other modules.
     */
    setData(key: string, value: any): this {
        this.data[key] = value;
        return this;
    }

    /**
     * Gets previously set data by this or before executed module.
     */
    getData(key: string): any {
        return this.data[key];
    }

    /**
     * Adds a shutdown handler - special function that will be executed when framework is shutdown.
     */
    onShutdown(handler: ShutdownHandler): this {
        this.shutdownHandlers.push(handler);
        return this;
    }

    /**
     * Gets all shutdown handlers - special functions that will be executed when framework is shutdown.
     */
    getShutdownHandlers(): ShutdownHandler[] {
        return this.shutdownHandlers.map(handlers => handlers);
    }

}