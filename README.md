# Microframework

Microframework is a simple tool that allows you to execute your modules in a proper order, 
helping you to organize bootstrap code in your application.

## Usage

First, install the module:

```
npm i microframework
```

Second, create a simple "module" named `expressModule`:

```typescript
import {MicroframeworkSettings} from "microframework";

export function expressModule(settings: MicroframeworkSettings) {

    // create express app
    const app = express();

    // register all routes, Routes are just routes that should be stored outside of this module
    const routes: any = Routes;
    Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

    // run application to listen on given port
    app.listen(3000);
    
    // your module also can return a promise
}
```

Create `app.ts` and bootstrap a microframework and your express module:

```typescript
import {bootstrapMicroframework} from "microframework";
import {expressModule} from "./expressModule";

bootstrapMicroframework([
    expressModule
])
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error));
```

That's all. You can do same for other modules. 
Take a look on sample to understand better how concept of modules and their bootstrapping in microframework.

## Settings

You can specify additional options to microframework.

* `logo` - Logo needs to be used before application launches. To use logo ansi-art module should be installed.
* `showBootstrapTime` - If set to true then framework shows how much time was spend to bootstrap all modules.
* `bootstrapTimeout` - Number of milliseconds to wait before framework will bootstrap all modules.

Example of using settings:

```typescript
import {bootstrapMicroframework} from "microframework";

bootstrapMicroframework({
    config: {
        logo: "MyApp",
        showBootstrapTime: true,
        bootstrapTimeout: 10
    }, 
    modules: [
        expressModule,
        // ...
    ]
})
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error));
```

## Sharing data across modules

Sometimes few modules need to communicate between each other and use shared data.
For such purpose you can store the data in `settings` object passed to each module
and use stored data across all other modules. For example:

```typescript
import {MicroframeworkSettings} from "microframework";

export function expressModule(settings: MicroframeworkSettings) {

    // create express app
    const app = express();

    // register all routes, Routes are just routes that should be stored outside of this module
    const routes: any = Routes;
    Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

    // run application to listen on given port
    app.listen(3000);
    
    settings.setData("express_app", app);
}
```

And another modules can use data this way:

```typescript
import {MicroframeworkSettings} from "microframework";

export function socketIoModule(settings: MicroframeworkSettings) {
    const io = io();
    io.useExpress(settings.getData("express_app"));
}
```

## Application Shutdown

In the case if you want to shutdown running application you need to do following:

```typescript
import {bootstrapMicroframework} from "microframework";

bootstrapMicroframework({
    config: {
        logo: "MyApp",
        showBootstrapTime: true,
        bootstrapTimeout: 10
    }, 
    modules: [
        expressModule,
        // ...
    ]
})
    .then(framework => {
        // do something before shutdown
        
        // and shutdown everything
        return framework.shutdown();
    })
    .then(() => {
        // now everything is turned off
    })
    .catch(error => console.log("Application is crashed: " + error));
```

All modules which use resources should release them, for example:

```typescript
export async function typeormModule(settings: MicroframeworkSettings) {
    const connection = await createConnection({
        driver: {
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test"
        }
    });

    settings.onShutdown(() => connection.close());
}
```