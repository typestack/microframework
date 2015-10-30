import {MicroFrameworkRegistry} from "./MicroFrameworkRegistry";
import {Container} from "typedi/Container";

/**
 * Gets the module
 */
export function ModuleExports(moduleType: Function): Function;
export function ModuleExports(microframeworkName: string, moduleType: Function): Function;
export function ModuleExports(microframeworkNameOrModuleType?: string|Function, moduleType?: Function): Function {
    let name: string;
    if (typeof microframeworkNameOrModuleType === 'string') {
        name = <string> microframeworkNameOrModuleType;
    } else {
        moduleType = <Function> microframeworkNameOrModuleType;
    }

    return function (target: Function, key: string, index: number) {
        const module = MicroFrameworkRegistry.get(name || 'default').findModuleByType(moduleType);
        if (!module)
            throw new Error('Module ' + moduleType + ' was not found in the microframework ' + name);
        if (!module.getModuleExports)
            throw new Error('Module ' + moduleType + ' in the microframework ' + name + ' does not export anything.');

        Container.registerCustomParamHandler({
            type: target,
            index: index,
            getValue: () => {
                return module.getModuleExports();
            }
        });
    };
}