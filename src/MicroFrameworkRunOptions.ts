export interface MicroFrameworkRunOptions {
    baseDirectory: string; // __dirname
    configurationFiles?: string[]; // './configuration/config.json'
    parametersFiles?: string[]; // './configuration/parameters.json'
    controllersDirectories?: string[];
    odmDocumentsDirectories?: string[];
    odmSubscribersDirectories?: string[];
    environment?: string;
}