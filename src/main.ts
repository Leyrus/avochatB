import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { CustomLogger } from './common/middleware/loggerService';
import { AllExceptionsFilter } from './common/middleware/allExeptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const getHttpsOptions = () => ({
  key: fs.readFileSync('./key/private.pem'),
  cert: fs.readFileSync('./key/public.pem'),
});

async function bootstrap() {
    const httpsOptions = null && process.env.NODE_ENV === 'production'
        ? getHttpsOptions() : null;
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: new CustomLogger(),
        httpsOptions,
    });
    app.use(helmet());
    // app.use(csurf({ cookie: true }));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 300,
        })
    );
    const options = new DocumentBuilder()
       .setTitle('Avochat api')
       .setVersion('1.0')
       .build();
     const document = SwaggerModule.createDocument(app, options);
     SwaggerModule.setup('api', app, document);
    await app.listen(4000);
}
bootstrap();
