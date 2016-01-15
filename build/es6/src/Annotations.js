var MicroFrameworkRegistry_1 = require("./MicroFrameworkRegistry");
var Container_1 = require("typedi/Container");
function ModuleExports(microframeworkNameOrModuleType, moduleType) {
    let name;
    if (typeof microframeworkNameOrModuleType === 'string') {
        name = microframeworkNameOrModuleType;
    }
    else {
        moduleType = microframeworkNameOrModuleType;
    }
    return function (target, key, index) {
        Container_1.Container.registerParamHandler({
            type: target,
            index: index,
            getValue: () => {
                const microFramework = MicroFrameworkRegistry_1.MicroFrameworkRegistry.get(name || 'default');
                if (!microFramework)
                    return;
                const module = microFramework.findModuleByType(moduleType);
                if (!module)
                    throw new Error('Module ' + moduleType + ' was not found in the microframework ' + name);
                if (!module.getModuleExports)
                    throw new Error('Module ' + moduleType + ' in the microframework ' + name + ' does not export anything.');
                return module.getModuleExports();
            }
        });
    };
}
exports.ModuleExports = ModuleExports;
//# sourceMappingURL=Annotations.js.map