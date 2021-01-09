import axios from 'axios'

const shell = require('shelljs')
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const cookiePath = '.cookie';
const qrcodePath = 'qrcodePath'
export class LoginService {
  cookies;
  islogin;
  ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
  async init() {
    const isExist = fs.existsSync(cookiePath);
    if (isExist) {
      const data = await this.getCookieFromLocal();
      this.cookies = data.cookie;
    } else {
      console.log('未找到cookie文件');
    }
    const sign = await this.validate();
    console.log('sign', sign)
    if (!sign) {
      // 验证失败不是过期就是未登录。都需要清理cookie
      this.cookies = [];
      const fn = async () => {
        return new Promise(async resolve => {
          const s = await this.main();
          if (!s) {
            setTimeout(() => {
              fn();
            }, 2000);
          } else {
            resolve('');
          }
        });
      };
      await fn();
    }
    console.log('已在登录状态');
    return;
  }
  /**
   *
   * 验证是否能登录
   * @return {*}
   * @memberof LoginService
   */
  async validate() {
    const url = 'https://order.jd.com/center/list.action';
    try {
      await axios.get(url, {
        headers: {
          'User-Agent': this.ua,
          cookie: this.cookieToHeader(),
        },
        params: {
          rid: Date.now(),
        },
        maxRedirects: 0,
      });
      // this.storeCookieTolocal();
      console.log('验证成功');
      this.islogin = true;
      return true;
    } catch {
      console.log('验证失败');
      this.islogin = false;
      return false;
    }
  }
  async getCookieFromLocal() {
    let cookie = await readFile(cookiePath, 'utf8')
    return {
      cookie
    }
  }
  async cookieToHeader() {
    let cookie = await this.getCookieFromLocal();
    return cookie
  }
  /**
   *
   * 主登录流程
   * @memberof LoginService
   */
  async main() {
    console.log('进行登录流程');
    // const res = await axios.get('https://passport.jd.com/new/login.aspx', {
    //   headers: this.getHeaders(),
    // });
    // this.cookieStore(res.headers);
    // const sign = await this.getQrcode();
    // if (!sign) {
    //   console.log('未获取到登录二维码');
    //   return false;
    // }
    // console.log(`二维码文件位于${qrcodePath}`);
    // this.openQrcode();
    // const ticket = await this.qrcodeScan();
    // const result = await this.validateTicket(ticket);
    // if (!result) {
    //   console.log('登录票据有误');
    //   return false;
    // }
    // return await this.validate();
    return false
  }
  /**
   *
   * 获取qrcode
   * @returns
   * @memberof LoginService
   */
  // async getQrcode() {
  //   const url = 'https://qr.m.jd.com/show';
  //   const cookie = this.cookieToHeader();
  //   return new Promise<boolean>(resolve => {
  //     axios
  //       .get(url, {
  //         headers: {
  //           'User-Agent': this.ua,
  //           Referer: 'https://passport.jd.com/new/login.aspx',
  //           cookie,
  //         },
  //         responseType: 'arraybuffer',
  //         params: {
  //           appid: 133,
  //           size: 147,
  //           t: Date.now(),
  //         },
  //       })
  //       .then(res => {
  //         if (res.status === 200) {
  //           this.cookieStore(res.headers);
  //           fs.writeFile(qrcodePath, res.data, err => {
  //             if (err) throw err;
  //             resolve(true);
  //           });
  //         }
  //       })
  //       .catch(e => {
  //         console.log(e);
  //         resolve(false);
  //       });
  //   });
  // }
  async openQrcode() {
    shell.exec(qrcodePath);
    return;
  }
  /**
   *
   * 验证ticket
   * @param {string} ticket
   * @returns
   * @memberof LoginService
   */
  async validateTicket(ticket: string) {
    const url = 'https://passport.jd.com/uc/qrCodeTicketValidation';
    const headers = {
      'User-Agent': this.ua,
      Referer: 'https://passport.jd.com/uc/login?ltype=logout',
      cookie: this.cookieToHeader(),
    };
    const res = await axios.get(url, {
      headers,
      params: {
        t: ticket,
      },
    });
    if (res.data.returnCode === 0) {
      // this.cookieStore(res.headers);
      return true;
    }
    return false;
  }
}