import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { MyLogger } from './common/middleware/loggerService';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: new MyLogger(),
    });
    app.use(helmet());
    // app.use(csurf({ cookie: true }));

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 200,
        })
    );
    await app.listen(4000);
}
bootstrap();
