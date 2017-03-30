import {createConnection} from "typeorm";
import {MicroframeworkSettings} from "../../src/MicroframeworkSettings";

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