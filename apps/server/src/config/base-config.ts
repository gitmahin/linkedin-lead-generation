type BaseConfigTypes = {
    PORT: number;
    BASE_URL: string;
    REDIS_HOST: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: number;
}

export const BaseConfig: BaseConfigTypes = {
    PORT: Number(process.env.PORT) || 5000,
    BASE_URL: "",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_USERNAME: process.env.REDIS_USERNAME || "",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
}