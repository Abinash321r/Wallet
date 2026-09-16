"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running at http://localhost:${port}`);
    console.log(`📊 GraphQL playground at http://localhost:${port}/graphql`);
}
bootstrap();
//# sourceMappingURL=main.js.map