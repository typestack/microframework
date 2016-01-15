var path = require("path");
class MicroFrameworkUtils {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    static getEnvironmentFile(file, environment) {
        let baseName = path.basename(file);
        let extension = path.extname(file);
        let fileName = baseName.substr(0, baseName.lastIndexOf(extension)) + '.' + environment + extension;
        return path.dirname(file) + '/' + fileName;
    }
    static sortModulesByDependencies(modules) {
        let modulesDependencyTree = modules.reduce(function (object, mod) {
            if (mod.getDependentModules)
                object[mod.getName()] = mod.getDependentModules();
            return object;
        }, {});
        let sortedModuleNames = this.recursiveDependencies(modulesDependencyTree);
        modules.sort(function (a, b) {
            return sortedModuleNames.indexOf(a.getName()) - sortedModuleNames.indexOf(b.getName());
        });
    }
    static deepClone(object) {
        let newObj = (object instanceof Array) ? [] : {};
        let obj = object;
        for (let i in obj) {
            if (obj[i] && typeof obj[i] == "object") {
                newObj[i] = this.deepClone(obj[i]);
            }
            else {
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    static recursiveDependencies(dependencies, root) {
        var nodes = {};
        var nodeCount = 0;
        var ready = [];
        var output = [];
        // build the graph
        function add(element) {
            nodeCount++;
            nodes[element] = { needs: [], neededBy: [], name: element };
            if (dependencies[element]) {
                dependencies[element].forEach(function (dependency) {
                    if (!nodes[dependency])
                        add(dependency);
                    nodes[element].needs.push(nodes[dependency]);
                    nodes[dependency].neededBy.push(nodes[element]);
                });
            }
            if (!nodes[element].needs.length)
                ready.push(nodes[element]);
        }
        if (root) {
            add(root);
        }
        else {
            for (let element in dependencies) {
                if (!nodes[element])
                    add(element);
            }
        }
        //sort the graph
        while (ready.length) {
            var dependency = ready.pop();
            output.push(dependency.getName);
            dependency.neededBy.forEach(function (element) {
                element.needs = element.needs.filter(function (x) {
                    return x != dependency;
                });
                if (!element.needs.length)
                    ready.push(element);
            });
        }
        //error-check
        if (output.length != nodeCount) {
            throw 'circular dependency in modules detected: ' + JSON.stringify(dependencies);
        }
        return output;
    }
}
exports.MicroFrameworkUtils = MicroFrameworkUtils;
//# sourceMappingURL=MicroFrameworkUtils.js.map