import { App, Controller, Get, Provide, Inject } from '@midwayjs/decorator';
import { Context, Application  } from 'egg';
const mime = require('mime')
import fse = require('fs-extra');
import path = require('path');
var fs = require('fs'), 
    AdmZip = require('adm-zip'); 

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;
  @App()
  app: Application;
  @Get('/')
  async home() {
    const ctx = this.ctx
    // console.log(ctx.url,ctx.query)
    let data
    try {
      data = fse.readFileSync(path.join(ctx.app.baseDir, '../view/markdown/index.html')).toString();
      // 等待操作结果返回，然后打印结果
    } catch (e) {
      console.log('读取文件发生错误');
    }
    ctx.body = data
    // return 'Hello Midwayjs!';
  }
  @Get('/*')
  async static() {
    const ctx = this.ctx
    // console.log(ctx.url, ctx)
    let data, type
    try {
      let pa = path.join(ctx.app.baseDir, '../view/markdown' + ctx.request.url)
      type = mime.getType(pa)
      data = fse.readFileSync(pa);
      // 等待操作结果返回，然后打印结果
    } catch (e) {
      console.log('读取文件发生错误');
    }
    ctx.set('content-type', type)
    ctx.body = data
  }
}
// function getData(){
//   axios({
//     baseURL: 'http://qi.testfreelog.com/v2/',
//     method: 'get',
//     url: `auths/presentables/${theme.entityNid}/fileStream`,
//     params:{ parentNid: nodeInfo.nodeThemeId, subResourceIdOrName: sub.id }
//   })
// }
function saveZipFiles(savePath, files) {
  // 获取解压后的文件
  try {
    for (const filename of Object.keys(files)) {
      if (!files[filename]) return
      const dest = savePath + '\\' + filename;
      // 如果该文件为目录需先创建文件夹  && !isDirSync(dest)
      if (files[filename] && files[filename].dir && !fs.existsSync(dest)) {
        fs.mkdirSync(dest, {
          recursive: true
        });
      } else {
        // 把每个文件buffer写到硬盘中 
        files[filename]._data && console.log(files[filename]._data.compressedContent, savePath, dest)
        files[filename]._data && fs.writeFileSync(dest,files[filename]._data.compressedContent);
      }
    }
  } catch (error) {
    console.error('save zip files encountered error!', error.message);
    return error;
  }
}