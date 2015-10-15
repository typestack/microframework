import {Module} from "../Module";

export class NoModulesLoadedException extends Error {
    name = 'NoModulesLoadedException';

    constructor() {
        super();
        this.message = 'You did not register any modules into framework.';
    }

}