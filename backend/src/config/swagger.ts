import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Modular Form Creator App API',
      version: '1.0.0',
      description: 'API for managing resources and modules.',
    },
    servers: [{ url: 'http://localhost:5001' }],
    tags: [
      {
        name: 'Resources',
        description:
          'Business APIs for resource lifecycle: create, edit modules, provision to completed, and replace full data.',
      },
      {
        name: 'Admin',
        description: 'Administrative API for environment reset operations.',
      },
    ],
    components: {
      schemas: {
        ResourceStatus: {
          type: 'string',
          enum: ['draft', 'completed'],
        },
        BasicInfo: {
          type: 'object',
          properties: {
            resourceName: { type: 'string' },
            owner: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
          },
        },
        ProjectDetails: {
          type: 'object',
          properties: {
            projectName: { type: 'string' },
            budget: { type: 'string' },
            category: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
          },
        },
        Resource: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            resourceId: { type: 'number' },
            name: { type: 'string' },
            status: { $ref: '#/components/schemas/ResourceStatus' },
            basicInfo: { $ref: '#/components/schemas/BasicInfo' },
            projectDetails: { $ref: '#/components/schemas/ProjectDetails' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        ResourceListResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/Resource' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 },
                totalItems: { type: 'number', example: 24 },
                totalPages: { type: 'number', example: 3 },
              },
            },
          },
        },
        CreateResourceInput: {
          type: 'object',
          required: ['resourceName'],
          properties: {
            resourceName: { type: 'string', example: 'Example resource' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Resource not found' },
            details: {},
          },
        },
        ProvisioningResponse: {
          oneOf: [
            { $ref: '#/components/schemas/Resource' },
            {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Resource is already completed',
                },
                resource: { $ref: '#/components/schemas/Resource' },
              },
            },
          ],
        },
      },
    },
  },
  apis: ['./src/modules/resources/*.ts', './src/routes/*.ts'],
})
