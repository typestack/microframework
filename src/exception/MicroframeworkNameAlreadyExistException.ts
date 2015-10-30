export class MicroframeworkNameAlreadyExistException extends Error {
    name = 'MicroframeworkNameAlreadyExistException';

    constructor(name: string) {
        super();
        if (name) {
            throw new Error('Microframework without name already was bootstrapped once, you cannot create two ' +
                'microframework instances without name. Please specify a name to your microframework instance on creation.');
        } else {
            throw new Error('Microframework with name ' + name + ' already was bootstrapped. You cannot bootstrap two ' +
                'microframework instances with the same name. Please specify different name on your microframework instance creation.');
        }
    }

}