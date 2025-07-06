export const swaggerSchemas = {
  // ========================================
  // SCHEMAS DE REQUISIÇÃO
  // ========================================
  
  RegisterRequest: {
    $id: 'RegisterRequest',
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email válido do usuário para registro',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100,
        description: 'Senha do usuário (mínimo 6 caracteres)',
        pattern: '^.{6,100}$'
      }
    },
    additionalProperties: false
  },
  
  LoginRequest: {
    $id: 'LoginRequest',
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário para login'
      },
      password: {
        type: 'string',
        description: 'Senha do usuário'
      }
    },
    additionalProperties: false
  },

  // ========================================
  // SCHEMAS DE RESPOSTA
  // ========================================
  
  User: {
    $id: 'User',
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único do usuário',
        minimum: 1
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação da conta'
      }
    },
    required: ['id', 'email']
  },

  AuthResponse: {
    $id: 'AuthResponse',
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'JWT token para autenticação (válido por 24 horas)'
      },
      user: {
        $ref: 'User'
      }
    },
    required: ['token', 'user']
  },

  ProfileResponse: {
    $id: 'ProfileResponse',
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensagem de confirmação'
      },
      userId: {
        type: 'integer',
        description: 'ID do usuário autenticado'
      },
      user: {
        $ref: 'User'
      }
    },
    required: ['message', 'userId']
  },

  DashboardResponse: {
    $id: 'DashboardResponse',
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensagem de confirmação'
      },
      userId: {
        type: 'integer',
        description: 'ID do usuário autenticado'
      },
      data: {
        type: 'object',
        description: 'Dados do dashboard do usuário',
        properties: {
          totalItems: {
            type: 'integer',
            description: 'Total de itens do usuário'
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            description: 'Último login do usuário'
          },
          preferences: {
            type: 'object',
            description: 'Preferências do usuário',
            properties: {
              theme: {
                type: 'string',
                enum: ['light', 'dark']
              },
              notifications: {
                type: 'boolean'
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
    $id: 'ErrorResponse',
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensagem de erro descritiva'
      },
      code: {
        type: 'string',
        description: 'Código do erro (opcional)'
      },
      details: {
        type: 'object',
        description: 'Detalhes adicionais do erro (opcional)'
      }
    },
    required: ['error']
  },

  ValidationErrorResponse: {
    $id: 'ValidationErrorResponse',
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensagem de erro de validação'
      },
      validationErrors: {
        type: 'array',
        description: 'Lista de erros de validação',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Campo com erro'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro do campo'
            },
            value: {
              type: 'string',
              description: 'Valor fornecido'
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
    $id: 'SuccessResponse',
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensagem de sucesso'
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp da operação'
      }
    },
    required: ['message']
  },

  HealthResponse: {
    $id: 'HealthResponse',
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['OK', 'ERROR'],
        description: 'Status da aplicação'
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp da verificação'
      },
      uptime: {
        type: 'number',
        description: 'Tempo de atividade em segundos'
      },
      version: {
        type: 'string',
        description: 'Versão da aplicação'
      }
    },
    required: ['status', 'timestamp']
  },

  // ========================================
  // SCHEMAS DE ALARME
  // ========================================
  
  CreateAlarmRequest: {
    $id: 'CreateAlarmRequest',
    type: 'object',
    required: ['time', 'repeat'],
    properties: {
      time: {
        type: 'string',
        format: 'date-time',
        description: 'Horário do alarme (ISO string)'
      },
      repeat: {
        type: 'string',
        enum: ['once', 'daily', 'weekly'],
        description: 'Frequência de repetição do alarme'
      }
    }
  },

  UpdateAlarmRequest: {
    $id: 'UpdateAlarmRequest',
    type: 'object',
    properties: {
      time: {
        type: 'string',
        format: 'date-time',
        description: 'Horário do alarme (ISO string)'
      },
      repeat: {
        type: 'string',
        enum: ['once', 'daily', 'weekly'],
        description: 'Frequência de repetição do alarme'
      },
      active: {
        type: 'boolean',
        description: 'Status ativo do alarme'
      }
    }
  },

  AlarmResponse: {
    $id: 'AlarmResponse',
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID do alarme'
      },
      userId: {
        type: 'integer',
        description: 'ID do usuário'
      },
      time: {
        type: 'string',
        format: 'date-time',
        description: 'Horário do alarme'
      },
      active: {
        type: 'boolean',
        description: 'Status ativo do alarme'
      },
      repeat: {
        type: 'string',
        enum: ['once', 'daily', 'weekly'],
        description: 'Frequência de repetição'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de atualização'
      }
    }
  },

  SelfieResponse: {
    $id: 'SelfieResponse',
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID da selfie'
      },
      alarmId: {
        type: 'integer',
        description: 'ID do alarme'
      },
      imagePath: {
        type: 'string',
        description: 'Caminho da imagem'
      },
      brightness: {
        type: 'number',
        description: 'Brilho médio da imagem (0-255)'
      },
      approved: {
        type: 'boolean',
        description: 'Se a selfie foi aprovada'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação'
      }
    }
  },

  AlarmIdParam: {
    $id: 'AlarmIdParam',
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'ID do alarme'
      }
    }
  }
};

export const swaggerTags = [
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
    name: 'Alarms',
    description: 'Endpoints para gerenciamento de alarmes com verificação de selfie',
    externalDocs: {
      description: 'Guia de alarmes',
      url: 'https://docs.cavemode.com/alarms'
    }
  },
  {
    name: 'System',
    description: 'Endpoints do sistema e monitoramento'
  }
];

export const swaggerSecuritySchemes = {
  bearerAuth: {
    type: 'http' as const,
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'JWT token obtido através do endpoint de login. Use no formato: Bearer <token>'
  }
}; 