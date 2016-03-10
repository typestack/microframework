export class ModuleProblemsException extends Error {
    name = "ModuleProblemsException";

    constructor(message: string) {
        super();
        this.message = "Registered modules have a problems: " + message;
    }

}