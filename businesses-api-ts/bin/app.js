"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./utils/server");
const logger_1 = __importDefault(require("@root/utils/logger"));
(0, server_1.createServer)()
    .then((server) => {
    server.listen(3000, () => {
        logger_1.default.info(`Listening on http://localhost:3000`);
    });
})
    .catch((err) => {
    logger_1.default.error(`Error: ${err}`);
});
