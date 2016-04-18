import {MicroFrameworkRegistry} from "./MicroFrameworkRegistry";
import {Container} from "typedi/typedi";

/**
 * Gets the module
 */
export function ModuleExports(moduleType: Function): Function;
export function ModuleExports(microframeworkName: string, moduleType: Function): Function;
export function ModuleExports(microframeworkNameOrModuleType?: string|Function, moduleType?: Function): Function {
    let name: string;
    if (typeof microframeworkNameOrModuleType === "string") {
        name = <string> microframeworkNameOrModuleType;
    } else {
        moduleType = <Function> microframeworkNameOrModuleType;
    }

    return function (target: Function, key: string, index: number) {
        Container.registerParamHandler({
            type: target,
            index: index,
            getValue: () => {
                const microFramework = MicroFrameworkRegistry.get(name || "default");
                if (!microFramework) // if microframework is not bootstrapped then do nothing
                    return;

                const module = microFramework.findModuleByType(moduleType);
                if (!module)
                    throw new Error("Module " + moduleType + " was not found in the microframework " + name);
                if (!module.getModuleExports)
                    throw new Error("Module " + moduleType + " in the microframework " + name + " does not export anything.");

                return module.getModuleExports();
            }
        });
    };
}