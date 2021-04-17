import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
// import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomLogger } from './common/middleware/loggerService';
import { AllExceptionsFilter } from './common/exceptions/all-exeptions.filter';
import { config, isProd } from './config';
import { TransformInterceptor } from './common/interceptors/transform-interceptor';

// const getHttpsOptions = () =>
//  isProd
//   ? {
//      key: fs.readFileSync(config.privateKeyPath),
//      cert: fs.readFileSync(config.publicKeyPath),
//     }
//   : null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new CustomLogger(),
    // httpsOptions: getHttpsOptions(),
  });
  // app.use(helmet());

  app.setGlobalPrefix(`api/v${config.apiVersion}`);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('ledev')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(1213);
}

bootstrap();
