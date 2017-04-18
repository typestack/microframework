import {bootstrapMicroframework} from "../src/index";
import {expressLoader} from "./modules/expressLoader";
import {typeormLoader} from "./modules/typeormLoader";
import {winstonLoader} from "./modules/winstonLoader";

bootstrapMicroframework({
    config: { // completely optional
        logo: "MyAwesomeApp", // completely optional, to use this setting you'll need to install ascii-art module
        showBootstrapTime: true, // completely optional
    },
    loaders: [
        expressLoader,
        winstonLoader,
        typeormLoader, // comment this module if you don't have database to setup connection with

        // here we can setup other databases, any other lib we want to setup in our application
    ]
})
    .then(() => console.log("All modules has been loaded."))
    .catch(error => console.log("Application is crashed: " + error));