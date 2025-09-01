import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "fs08 studyForest API",
    version: "1.0.0",
    description: "초급 프로젝트 공부의 숲 API 문서",
    contact: {
      name: "초급 프로젝트 1팀",
      email: "ed125248@gmail.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Development Server",
    },
    {
      // Production Server 연결
      url: "http://api.example.com",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [
  "./app.js", // API 파일
  "./docs/swagger.js", // docs 폴더의 주석 파일
  ],
};

const specs = swaggerJSDoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar {display: none}
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 5px; }
  `,
  customSiteTitle: "공부의 숲 API 문서",
};

export { specs, swaggerUiOptions };
