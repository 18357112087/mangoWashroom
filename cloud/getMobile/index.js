// 云函数入口文件

const cloud = require('wx-server-sdk')

const request = require('request')

const jwt = require('jsonwebtoken')

cloud.init()

const db = cloud.database()

const crypto = require('crypto')

// 云函数入口函数

exports.main = async (event, context) => {

  /**code是通过wx.login获取的。
  
  **iv,encryptedData通过微信开放能力getphoneNumber获取的
  
  **/

  const { iv, encryptedData, userid, code } = event

  const wxContext = cloud.getWXContext()

  const openid = wxContext.OPENID

  const appid = wxContext.APPID

  const unionid = wxContext.UNIONID

  let phoneNumber

  phoneNumber = await mobileDecode({ iv, encryptedData, code, appid })

  console.log('phone' + phoneNumber);

  return phoneNumber;

}






async function requestSync(url) {

  return new Promise((resolve, reject) => {

    try {

      request(url, (err, resp, body) => {

        if (err) {

          return reject(err)

        }

        return resolve(body)

      })

    } catch (e) {

      return reject(e)

    }

  })

}

async function mobileDecode(data) {

  const { iv, encryptedData, code, appid } = data
  //appid:wxContext.APPID,
  appid: 'wx56d37ee31d8deb1a',

  const secret='ac677ef8537fe755daf93244fa72d544'
  
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`

  const req = await requestSync(url)

  const session = JSON.parse(req)

  const sessionKey = session.session_key

  // console.log(sessionKey)

  const crypted = Buffer.from(encryptedData, 'base64')

  const key = Buffer.from(sessionKey, 'base64')

  const i = Buffer.from(iv, 'base64')

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, i)

  let decoded = decipher.update(crypted, 'base64', 'utf8')

  decoded += decipher.final('utf8')

  const mobile = JSON.parse(decoded).phoneNumber

  console.log(mobile);

  return mobile

}
