import * as path from "path";

export class MicroFrameworkUtils {

    static getEnvironmentFile(file: string, environment: string) {
        let baseName = path.basename(file);
        let extension = path.extname(file);
        let fileName = baseName.substr(0, baseName.lastIndexOf(extension)) + '.' + environment + extension;
        return path.dirname(file) + '/' + fileName;
    }

}