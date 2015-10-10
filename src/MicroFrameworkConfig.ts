import {ConnectionOptions} from "typeodm/connection/ConnectionOptions";

/**
 * Configuration based on that micro framework gonna config its components.
 */
export interface MicroFrameworkConfig {
    framework?: {

    },
    express?: {
        port?: number,
        bodyParser?: string, // "raw", "text", "urlencoded" or "json"
        bodyParserOptions?: any
    },
    typeodm?: {
        driver: string, // only "mongodb" for now
        documentsDirectories?: string[];
        subscribersDirectories?: string[];
        connection: ConnectionOptions
    },
    controllers?: {
        controllerDirectories?: string[]
    }
}
