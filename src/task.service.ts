import { Injectable } from '@nestjs/common';
import axios from 'axios'
import { AppService } from './app.service';
import { LoginService } from './login.service';

const moment = require('moment')
const {parsed:env} = require('dotenv').config()
const CronJob = require('cron').CronJob;


class SchedulerRegistry{
    jobs = [];
    addCronJob(name, job) {
        this.jobs.push({
            name,
            job
        })
    }
}
export class TaskService {
    schedulerRegistry
    context
    constructor(
       
    ) {
        this.schedulerRegistry = new SchedulerRegistry()
    }
  /**
   *
   * 处理时差 添加任务
   * @memberof TasksService
   */
  async handleTimeDiff(context) {
    this.context = context
    const url = 'https://a.jd.com//ajax/queryServerData.html';
    const res = await axios.get(url); // 获得的是时间戳
    const now = Date.now();
    const diff = (now - res.data.serverTime) / 1000;
    const differtime = moment.duration(Math.abs(diff), 'seconds');
    const origintime = moment(
      `${env.SEC}-${env.MINUTE}-${env.HOUR}-${env.DAY}-${env.MONTH}`,
      's-m-H-D-M',
    );
    console.warn(`您设定时间为${origintime.format('M月D日H点m分s秒')}`);
    let fixStart: moment.Moment;
    if (diff > 0) {
      console.warn(`您电脑时间比京东快${diff}秒`);
      fixStart = origintime.add(differtime);
    } else {
      console.warn(`您的电脑时间比京东慢${-diff}秒`);
      fixStart = origintime.subtract(differtime);
    }
    console.warn(`已修正启动时间为${fixStart.format('M月D日H点m分s秒')}`);
    const month = fixStart.get('month');
    const fixCornTime = fixStart.format('s m H D ') + month + ' *';
    console.log('fixCornTime', fixCornTime)
    this.addCronJob('user', '*/5 * * * * *');
  }
  /**
   *
   * 添加修正时间后的任务
   * @param {string} name
   * @param {string} coreTime
   * @memberof TasksService
   */
  async addCronJob(name: string, coreTime: string) {
    const job = new CronJob(coreTime, () => {
      console.log(`执行脚本启动`);
      this.context.main();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    console.log(`任务coretime为${coreTime}`);
    // 如果要提前登录就放开
    console.log('检查登录情况');
    try {
        this.context.loginService.init();
    } catch (error) {
    }
    
  }
}

