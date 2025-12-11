import { server } from "./app";
import { BaseConfig } from "./config";


server.listen(() => {
    console.log(`server is listening on port ${BaseConfig.PORT}`)
})