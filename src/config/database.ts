import { IConfig } from "../types/variables";

const config: { [key: string]: IConfig } = {
  development: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "password",
    database: "test_db",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: "postgres",
  },
};

export default config;