// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()
// 云函数入口函数
// 请求的小程序APPID
const APPID = 'wx09646b38dd088ec5'
//请求的小程序APPSECRET
const APPSECRET = '999df8305301f330916f2010f7144ac1'
exports.main = async (event, context) => {
  let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET
  return await rp(url)
    .then(function (res) {
      console.log(res)
      return res
    })
    .catch(function (err) {
      return '失败'
    });

}