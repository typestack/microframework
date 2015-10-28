# MicroFramework

Micro framework integrates popular libraries like [express.js][1], [Mongodb ODM][2], [validator.ts][5],
[controllers.ts][4], [event-dispatcher.ts][7]
and others for use in your Typescript application. Framework ships by default [dependency injection framework][3] and
[configuration framework][6] to make all modules to work like a sh

## Notice

Library is under active development and API may change from version to version. 
Please consider it before using this library.

## Quick Start

You use framework with one or more the available modules. Lets say you want to use [express.js][1], [Mongodb ODM][2],
[validator][5], [event-dispatcher][7] and [restful controllers][4].

1. Install npm modules: 

`npm install microframework microframework-express microframework-typeodm microframework-controllers.ts microframework-validator.ts microframework-event-dispatcher.ts --save`

2. Create `app.ts`:
    
    ```typescript
    import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";
    import {ExpressModule} from "microframework-express/ExpressModule";
    import {ControllersTsModule} from "microframework-controllers.ts/ControllersTsModule";
    import {TypeOdmModule} from "microframework-typeodm/TypeOdmModule";
    import {ValidatorTsModule} from "microframework-validator.ts/ValidatorTsModule";
    import {EventDispatcherTsModule} from "microframework-event-dispatcher.ts/EventDispatcherTsModule";
    
    new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
        .registerModules([
            new ExpressModule(),
            new TypeOdmModule(),
            new ControllersTsModule(),
            new ValidatorTsModule(),
            new EventDispatcherTsModule()
        ])
        .bootstrap()
        .then(result => console.log('Module is running. Open localhost:3000'))
        .catch(error => console.error('Error: ', error));
    ```
    
3. Create configuration file `configuration/config.yml`:
    
    ```json
    {
      "express": {
        "port": "3000",
        "bodyParser": {
            "type": "json"
        }
      },
      "typeodm": {
        "connection": {
          "url": "mongodb://localhost:27017/microframework-sample"
        }
      }
    }
    ```
    
4. Now create your first controller, lets say QuestionController: `controller/QuestionController.ts`:
    
    ```typescript
    import {Controller, Get} from "controllers.ts/Annotations";
    import {Response} from "express";
    import {Request} from "express";
    
    @Controller()
    export class QuestionController {
    
        @Get('/questions')
        all(request: Request, response: Response): any[] {
            return [
                { title: 'Which processor to choose?', text: 'Which processor is better: Core i5 or Core i7?' },
                { title: 'When new star wars gonna be released?', text: 'When star wars gonna be released? I think in december' }
            ];
        }
    }
    ```

5. Run your app and open `http://localhost:3000/questions` in browser. You should see list of your questions.

## Available Modules

* [microframework-express](https://github.com/PLEEROCK/microframework-express) - integration with [express.js][1]
* [microframework-typeodm](https://github.com/PLEEROCK/microframework-typeodm) - integration with [TypeODM][2]
* [microframework-controllers.ts](https://github.com/PLEEROCK/microframework-controllers.ts) - integration with [controllers.ts][4]
* [microframework-validator.ts](https://github.com/PLEEROCK/microframework-validator.ts) - integration with [validator.ts][5]
* [microframework-event-dispatcher.ts](https://github.com/PLEEROCK/microframework-event-dispatcher.ts) - integration with [event-dispatcher.ts][7]

## Todos

* cover with tests
* more documentation and examples
* more modules

[1]: http://expressjs.com/
[2]: https://github.com/PLEEROCK/typeodm
[3]: https://github.com/PLEEROCK/typedi
[4]: https://github.com/PLEEROCK/controllers.ts
[5]: https://github.com/PLEEROCK/validator.ts
[6]: https://github.com/PLEEROCK/configurator.ts
[7]: https://github.com/PLEEROCK/event-dispatcher.ts
