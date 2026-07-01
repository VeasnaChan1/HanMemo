import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HanMemo API',
      version: '1.0.0',
      description: 'Mandarin Chinese spaced repetition vocabulary app for Cambodian learners',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://hanmemo-production.up.railway.app'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

export const specs = swaggerJsdoc(options);