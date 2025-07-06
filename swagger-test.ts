import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const app = fastify();

app.register(swagger, {
  mode: 'dynamic',
  openapi: {
    info: { title: 'Test API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  }
});

app.register(swaggerUi, { routePrefix: '/docs' });

app.get('/protected', {
  schema: { security: [{ bearerAuth: [] }] }
}, async () => ({ ok: true }));

app.listen({ port: 3333 }); 