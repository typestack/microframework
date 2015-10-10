# MicroFramework

Micro framework is a bundle of [express.js][1], [Mongodb ODM][2], [validator][5],
[dependancy injection framework][3], [configuration framework][6] and [restful controllers][4] for 
your apps using Typescript.

## Usage

Create your main application entry point `app.ts` and put there:

```typescript
import {MicroFrameworkConfig} from "microframework/MicroFrameworkConfig";
import {MicroFrameworkRunner} from "microframework/MicroFrameworkRunner";

let configuration = {
    express: {
        bodyParser: "json"
    },
    odm: {
        driver: "mongodb",
        connection: {
            url: "mongodb://localhost:27017/microframework-samples"
        }
    }
}; // you can also store this configuration in separate json file and require it

new MicroFrameworkRunner(__dirname, configuration)
    .run()
    .then(result => console.log('Express app is running. Open localhost:3000/questions'))
    .catch(error => console.error('Error: ', error));
```

Now create your first controller in the `controller/` directory. Lets call it `QuestionController`:

```typescript
import {Controller, Get} from "type-controllers/Annotations";
import {Response} from "express";
import {Request} from "express";

@Controller()
export class QuestionController {

    @Get('/questions')
    all(request: Request, response: Response): any[] {
        return [
            { title: 'Which processor to choose?', text: 'Which processor is better: Core i5 or Core i7?' },
            { title: 'When new star wars gonna be released?', text: 'When star wars gonna be released? I heard in november' }
        ];
    }
}
```

Now run your app and open `http://localhost:3000/questions` in browser. You should see list of your questions.
Take a look on samples in `./sample` for more examples of usages.

## Todos

* cover with tests
* more documentation and samples


[1]: http://expressjs.com/
[2]: https://github.com/PLEEROCK/typeodm
[3]: https://github.com/PLEEROCK/typedi
[4]: https://github.com/PLEEROCK/type-controllers
[5]: https://github.com/PLEEROCK/t-validator
[6]: https://github.com/PLEEROCK/t-configurator
