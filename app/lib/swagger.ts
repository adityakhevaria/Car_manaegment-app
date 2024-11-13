// app/lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Car Management API',
        version: '1.0',
      },
    },
  })
  return spec
}