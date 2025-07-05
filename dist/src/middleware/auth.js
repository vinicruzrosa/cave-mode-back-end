"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({
                error: 'Token de autenticação não fornecido'
            });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const payload = (0, jwt_1.verifyToken)(token);
        // Adiciona userId ao request para uso posterior
        request.userId = payload.userId;
    }
    catch (error) {
        return reply.status(401).send({
            error: 'Token inválido'
        });
    }
});
exports.authenticate = authenticate;
