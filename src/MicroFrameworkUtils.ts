import * as path from "path";
import {Module} from "./Module";

export class MicroFrameworkUtils {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    static getEnvironmentFile(file: string, environment: string) {
        let baseName = path.basename(file);
        let extension = path.extname(file);
        let fileName = baseName.substr(0, baseName.lastIndexOf(extension)) + "." + environment + extension;
        return path.dirname(file) + "/" + fileName;
    }

    static sortModulesByDependencies(modules: Module[]) {
        let modulesDependencyTree = modules.reduce(function(object: any, mod: Module) {
            if (mod.getDependentModules)
                object[mod.getName()] = mod.getDependentModules();
            return object;
        }, {});

        let sortedModuleNames = this.recursiveDependencies(modulesDependencyTree);

        modules.sort(function(a: Module, b: Module) {
            return sortedModuleNames.indexOf(a.getName()) - sortedModuleNames.indexOf(b.getName());
        });
    }

    static deepClone<T>(object: T): T {
        let newObj: any = (object instanceof Array) ? [] : {};
        let obj: any = object;
        for (let i in obj) {
            if (obj[i] && typeof obj[i] === "object") {
                newObj[i] = this.deepClone(obj[i]);
            } else {
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private static recursiveDependencies(dependencies: any, root?: any): string[] {
        let nodes: any = {};
        let nodeCount: number = 0;
        let ready: any[] = [];
        let output: any[] = [];

        // build the graph
        function add(element: any) {
            nodeCount++;
            nodes[element] = {needs: [], neededBy: [], name: element};
            if (dependencies[element]) {
                dependencies[element].forEach(function (dependency: any) {
                    if (!nodes[dependency]) add(dependency);
                    nodes[element].needs.push(nodes[dependency]);
                    nodes[dependency].neededBy.push(nodes[element]);
                });
            }
            if (!nodes[element].needs.length) ready.push(nodes[element]);
        }

        if (root) {
            add(root);
        } else {
            for (let element in dependencies) {
                if (!nodes[element]) add(element);
            }
        }

        // sort the graph
        while (ready.length) {
            let dependency = ready.pop();
            output.push(dependency.getName);
            dependency.neededBy.forEach(function (element: any) {
                element.needs = element.needs.filter(function (x: any) {
                    return x !== dependency;
                });
                if (!element.needs.length)
                    ready.push(element);
            });
        }

        // error-check
        if (output.length !== nodeCount) {
            throw "circular dependency in modules detected: " + JSON.stringify(dependencies);
        }

        return output;
    }

}