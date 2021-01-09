import { Injectable } from '@nestjs/common';
import { TaskService } from './task.service'
import { LoginService } from './login.service'
import { ProductExcelServer } from './productExcel.service'

@Injectable()
export class AppService {
  constructor(
    // private taskService: TaskService,
    // private loginService: LoginService,
    private productExcelServer: ProductExcelServer,
  ) { }
  start() {
    // const context = this;
    // this.taskService.handleTimeDiff(context)
    this.productExcelServer.start();
  }
  // main() {
  //   console.log('main')
  // }
}
