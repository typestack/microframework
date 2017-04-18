# Microframework

Microframework is a simple tool that allows you to execute and configure your modules (called *loaders*) in a proper order, 
helping you to organize bootstrap code in your application.

## Usage

First, install microframework:

```
npm i microframework
```

Second, create a simple "loader" named `expressLoader`. 
Loader is a place where you can configure all your modules during microframework bootstrap.
All loaders are executed one by one in a sequential order.

```typescript
import {MicroframeworkSettings} from "microframework";

export function expressLoader(settings: MicroframeworkSettings) {

    // create express app
    const app = express();

    // register all routes, Routes are just routes that should be stored outside of this module
    const routes: any = Routes;
    Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

    // run application to listen on given port
    app.listen(3000);
    
    // your loader also can return a promise and microframework will wait for it in a proper order
}
```

Create `app.ts` and bootstrap a microframework and your express loader:

```typescript
import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./expressLoader";

bootstrapMicroframework([
    expressLoader
])
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error));
```

That's all. You can do same for other loaders. 
Take a look on sample to understand better how concept of loaders and their bootstrapping in microframework.

## Settings

You can specify additional options to microframework.

* `logo` - Logo needs to be used before application launches. To use logo ansi-art node module should be installed.
* `showBootstrapTime` - If set to true then framework shows how much time was spend to bootstrap microframework.
* `bootstrapTimeout` - Number of milliseconds to wait before framework will bootstrap.

Example of using settings:

```typescript
import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./expressLoader";

bootstrapMicroframework({
    config: {
        logo: "MyApp",
        showBootstrapTime: true,
        bootstrapTimeout: 10
    }, 
    loaders: [
        expressLoader,
        // ...
    ]
})
    .then(() => console.log("Application is up and running."))
    .catch(error => console.log("Application is crashed: " + error));
```

## Sharing data across loaders

Sometimes few loaders need to communicate between each other and use shared data.
For such purpose you can store the data in `settings` object passed to each loader
and use stored data across all other loaders. For example:

```typescript
import {MicroframeworkSettings} from "microframework";

export function expressLoader(settings: MicroframeworkSettings) {

    // create express app
    const app = express();

    // register all routes, Routes are just routes that should be stored outside of this loader
    const routes: any = Routes;
    Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

    // run application to listen on given port
    app.listen(3000);
    
    settings.setData("express_app", app);
}
```

And another loaders can use data this way:

```typescript
import {MicroframeworkSettings} from "microframework";

export function socketIoLoader(settings: MicroframeworkSettings) {
    const io = io();
    io.useExpress(settings.getData("express_app"));
}
```

## Application Shutdown

In the case if you want to shutdown running application you need to do following:

```typescript
import {bootstrapMicroframework} from "microframework";
import {expressLoader} from "./expressLoader";

bootstrapMicroframework({
    config: {
        logo: "MyApp",
        showBootstrapTime: true,
        bootstrapTimeout: 10
    }, 
    loaders: [
        expressLoader,
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

All loaders which use resources should release them, for example:

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

    settings.onShutdown(() => connection.close()); // closing connection on microframework shutdown
}
```