import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskService } from './task.service';
import { LoginService } from './login.service';
import { ProductExcelServer } from './productExcel.service';


@Module({
  imports: [],
  exports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppService
    },
    {
      provide: TaskService,
      useClass: TaskService
    },
    {
      provide: LoginService,
      useClass: LoginService
    },
    {
      provide: ProductExcelServer,
      useClass: ProductExcelServer
    }
  ],
})
export class AppModule {}
