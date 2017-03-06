import {createConnection} from "typeorm";
import {MicroframeworkBootstrapSettings} from "../../src/MicroframeworkBootstrapSettings";

export async function typeormModule(settings: MicroframeworkBootstrapSettings) {
    const connection = await createConnection({
        driver: {
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test"
        }
    });

    settings.addShutdownHandler(() => connection.close());
}