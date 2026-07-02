// server/config/swagger.js
// Serves the OpenAPI spec (openapi.yaml) at /api-docs via Swagger UI.
//
// Install:
//   npm install swagger-ui-express yamljs --save
//
// Place openapi.yaml at: server/docs/openapi.yaml
// (or update the path below if you keep it elsewhere)

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, '../docs/openapi.yaml');
const swaggerDocument = YAML.load(openapiPath);

export function setupSwagger(app) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: 'HanMemo API Docs',
    })
  );

  // Optional: expose the raw spec as JSON too, useful for Postman import
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
  });

  console.log('Swagger docs available at /api-docs');
}