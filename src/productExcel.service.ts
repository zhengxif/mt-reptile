/**
 * 爬出利润导出excel
 */

import axios from 'axios'
import xlsx from 'node-xlsx';
const fs = require('fs')
const cheerio = require('cheerio');
export class ProductExcelServer {
    htmlUrl = 'http://quotes.money.163.com/f10/zycwzb_600519.html#01c01'
    constructor() {
        
    }
    async start() {
        // 获取页面数据
        let res = await axios.get(this.htmlUrl);
        // 解析
        let data = this.parserHtml(res.data)
        // 生成excel
        this.generateExcel(data)
    }
    parserHtml(html) {
        let $ = cheerio.load(html);
        let oTable = $('.table_bg001.border_box.limit_sale.scr_table');
        // title
        let oTitleTr = oTable.find('tbody tr:first-child');
        let aTitleThs = oTitleTr.children();
        // 利润
        let oProfitTr = oTable.find('tbody tr:nth-child(12)');
        let aProfitTds = oProfitTr.children();
        let titleArr = [];
        let profitArr = [];
        for (let i = 0; i < aTitleThs.length; i++) {
            let title = $(aTitleThs[i]).text().trim();
            titleArr.push(title);
            let profit = $(aProfitTds[i]).text().trim();
            profitArr.push(profit);
        }
        return {
            titleArr,
            profitArr
        }
    }
    generateExcel(data) {
        const values = Object.values(data);
        let buffer = xlsx.build([{name: "茅台", data: values}]); // Returns a buffer
        fs.writeFileSync('茅台.xlsx', buffer, 'buffer');
        console.log('导出 excel 成功');
    }
}