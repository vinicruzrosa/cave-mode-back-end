"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSecuritySchemes = exports.swaggerTags = exports.swaggerSchemas = void 0;
exports.swaggerSchemas = {
    // ========================================
    // SCHEMAS DE REQUISIÇÃO
    // ========================================
    RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Email válido do usuário para registro',
                example: 'usuario@exemplo.com',
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            },
            password: {
                type: 'string',
                minLength: 6,
                maxLength: 100,
                description: 'Senha do usuário (mínimo 6 caracteres)',
                example: 'minhasenha123',
                pattern: '^.{6,100}$'
            }
        },
        additionalProperties: false
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Email do usuário para login',
                example: 'usuario@exemplo.com'
            },
            password: {
                type: 'string',
                description: 'Senha do usuário',
                example: 'minhasenha123'
            }
        },
        additionalProperties: false
    },
    // ========================================
    // SCHEMAS DE RESPOSTA
    // ========================================
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'ID único do usuário',
                example: 1,
                minimum: 1
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Email do usuário',
                example: 'usuario@exemplo.com'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data e hora de criação da conta',
                example: '2024-01-15T10:30:00.000Z'
            }
        },
        required: ['id', 'email']
    },
    AuthResponse: {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                description: 'JWT token para autenticação (válido por 24 horas)',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXN1YXJpb0BleGVtcGxvLmNvbSIsImlhdCI6MTcwNTMwMDAwMCwiZXhwIjoxNzA1Mzg2NDAwfQ.example_signature'
            },
            user: {
                $ref: '#/components/schemas/User'
            }
        },
        required: ['token', 'user']
    },
    ProfileResponse: {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                description: 'Mensagem de confirmação',
                example: 'Perfil do usuário obtido com sucesso'
            },
            userId: {
                type: 'integer',
                description: 'ID do usuário autenticado',
                example: 1
            },
            user: {
                $ref: '#/components/schemas/User'
            }
        },
        required: ['message', 'userId']
    },
    DashboardResponse: {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                description: 'Mensagem de confirmação',
                example: 'Dashboard carregado com sucesso'
            },
            userId: {
                type: 'integer',
                description: 'ID do usuário autenticado',
                example: 1
            },
            data: {
                type: 'object',
                description: 'Dados do dashboard do usuário',
                properties: {
                    totalItems: {
                        type: 'integer',
                        description: 'Total de itens do usuário',
                        example: 42
                    },
                    lastLogin: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Último login do usuário',
                        example: '2024-01-15T09:15:00.000Z'
                    },
                    preferences: {
                        type: 'object',
                        description: 'Preferências do usuário',
                        properties: {
                            theme: {
                                type: 'string',
                                enum: ['light', 'dark'],
                                example: 'dark'
                            },
                            notifications: {
                                type: 'boolean',
                                example: true
                            }
                        }
                    }
                }
            }
        },
        required: ['message', 'userId', 'data']
    },
    // ========================================
    // SCHEMAS DE ERRO
    // ========================================
    ErrorResponse: {
        type: 'object',
        properties: {
            error: {
                type: 'string',
                description: 'Mensagem de erro descritiva',
                example: 'Email ou senha inválidos'
            },
            code: {
                type: 'string',
                description: 'Código do erro (opcional)',
                example: 'INVALID_CREDENTIALS'
            },
            details: {
                type: 'object',
                description: 'Detalhes adicionais do erro (opcional)',
                example: {
                    field: 'email',
                    value: 'invalid-email'
                }
            }
        },
        required: ['error']
    },
    ValidationErrorResponse: {
        type: 'object',
        properties: {
            error: {
                type: 'string',
                description: 'Mensagem de erro de validação',
                example: 'Dados de entrada inválidos'
            },
            validationErrors: {
                type: 'array',
                description: 'Lista de erros de validação',
                items: {
                    type: 'object',
                    properties: {
                        field: {
                            type: 'string',
                            description: 'Campo com erro',
                            example: 'email'
                        },
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro do campo',
                            example: 'Email inválido'
                        },
                        value: {
                            type: 'string',
                            description: 'Valor fornecido',
                            example: 'invalid-email'
                        }
                    }
                }
            }
        },
        required: ['error', 'validationErrors']
    },
    // ========================================
    // SCHEMAS DE SUCESSO
    // ========================================
    SuccessResponse: {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                description: 'Mensagem de sucesso',
                example: 'Operação realizada com sucesso'
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp da operação',
                example: '2024-01-15T10:30:00.000Z'
            }
        },
        required: ['message']
    },
    HealthResponse: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: ['OK', 'ERROR'],
                description: 'Status da aplicação',
                example: 'OK'
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp da verificação',
                example: '2024-01-15T10:30:00.000Z'
            },
            uptime: {
                type: 'number',
                description: 'Tempo de atividade em segundos',
                example: 3600
            },
            version: {
                type: 'string',
                description: 'Versão da aplicação',
                example: '1.0.0'
            }
        },
        required: ['status', 'timestamp']
    }
};
exports.swaggerTags = [
    {
        name: 'Auth',
        description: 'Endpoints de autenticação e gerenciamento de usuários',
        externalDocs: {
            description: 'Documentação de autenticação',
            url: 'https://docs.cavemode.com/auth'
        }
    },
    {
        name: 'Protected',
        description: 'Endpoints protegidos que requerem autenticação JWT',
        externalDocs: {
            description: 'Guia de autenticação',
            url: 'https://docs.cavemode.com/protected-routes'
        }
    },
    {
        name: 'System',
        description: 'Endpoints do sistema e monitoramento'
    }
];
exports.swaggerSecuritySchemes = {
    bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtido através do endpoint de login. Use no formato: Bearer <token>',
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
};
