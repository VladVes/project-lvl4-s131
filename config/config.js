module.exports = {
  "development": {
    storage: "./db.development.sqlite",
    dialect: "sqlite",
  },
  "test": {
    storage: ":memory:",
    dialect: "sqlite",
  },
  "production": {
    use_env_variable: "DATABASE_URL",
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
