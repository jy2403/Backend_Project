import { NestFactory } from '@nestjs/core';
import { ReportsModule } from './reports.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportsModule); 
  await app.listen(3000); // Puerto donde escucha
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();