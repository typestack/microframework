import {MicroFrameworkConfig} from "../../src/MicroFrameworkConfig";
import {MicroFrameworkBootstrapper, RunOptions} from "../../src/MicroFrameworkBootstrapper";

new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
    .bootstrap([
        RunOptions.TYPEODM
    ])
    .then(result => console.log('Module is running, typeodm is initialized, but express is not'))
    .catch(error => console.error('Error: ', error));
