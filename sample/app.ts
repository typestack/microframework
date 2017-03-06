import {bootstrapMicroframework} from "../src/index";
import {expressModule} from "./framework/expressModule";
import {typeormModule} from "./framework/typeormModule";
import {winstonModule} from "./framework/winstonModule";

bootstrapMicroframework({
    config: { // completely optional
        logo: "MyAwesomeApp", // completely optional, to use this setting you'll need to install ascii-art module
        showBootstrapTime: true, // completely optional
    },
    modules: [
        winstonModule,
        expressModule,
        typeormModule, // comment this module if you don't have database to setup connection with

        // here we can setup other databases, any other lib we want to setup in our application
    ]
})
    .then(() => console.log("All modules has been loaded."))
    .catch(error => console.log("Application is crashed: " + error));