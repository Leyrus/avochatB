import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { CustomLogger } from './common/middleware/loggerService';
import { AllExceptionsFilter } from './common/middleware/allExeptions.filter';

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
    await app.listen(4000);
}
bootstrap();
