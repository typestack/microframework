import {MicroFrameworkConfig} from "../../src/MicroFrameworkConfig";
import {MicroFrameworkRunner} from "../../src/MicroFrameworkRunner";

new MicroFrameworkRunner({ baseDirectory: __dirname })
    .run()
    .then(result => console.log('Module is running. Open localhost:3001'))
    .catch(error => console.error('Error: ', error));

// to access (and deeply configure) express use: microframework.express.*;
// to access (and deeply configure) TypeODM use: microframework.odmConnectionManager.*;