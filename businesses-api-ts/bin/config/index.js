"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_extended_1 = __importDefault(require("dotenv-extended"));
const dotenv_parse_variables_1 = __importDefault(require("dotenv-parse-variables"));
const env = dotenv_extended_1.default.load({
    path: process.env.ENV_FILE,
    defaults: './config/.env.defaults',
    schema: './config/.env.schema',
    includeProcessEnv: true,
    silent: false,
    errorOnMissing: true,
    errorOnExtra: true,
});
const parsedEnv = (0, dotenv_parse_variables_1.default)(env);
const config = {
    privateKeyFile: parsedEnv.PRIVATE_KEY_FILE,
    privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE,
    publicKeyFile: parsedEnv.PUBLIC_KEY_FILE,
    localCacheTtl: parsedEnv.LOCAL_CACHE_TTL,
    redisUrl: parsedEnv.REDIS_URL,
    mongo: {
        url: parsedEnv.MONGO_URL,
        useCreateIndex: parsedEnv.MONGO_CREATE_INDEX,
        autoIndex: parsedEnv.MONGO_AUTO_INDEX,
    },
    morganLogger: parsedEnv.MORGAN_LOGGER,
    morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER,
    exmplDevLogger: parsedEnv.EXMPL_DEV_LOGGER,
    loggerLevel: parsedEnv.LOGGER_LEVEL,
};
exports.default = config;
