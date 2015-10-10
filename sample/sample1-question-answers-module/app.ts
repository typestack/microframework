import {MicroFrameworkConfig} from "../../src/MicroFrameworkConfig";
import {MicroFrameworkBootstrapper} from "../../src/MicroFrameworkBootstrapper";

let microframework = new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
    .bootstrap()
    .then(result => console.log('Module is running. Open localhost:3001'))
    .catch(error => console.error('Error: ', error));

// to access (and deeply configure) express use: microframework.express.*;
// to access (and deeply configure) TypeODM use: microframework.odmConnectionManager.*;