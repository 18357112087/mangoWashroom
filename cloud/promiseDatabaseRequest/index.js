// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.callFunction({
    name: 'access_token',
    data: {}
  })
  console.log(result.result)
  var access_token = result.result.access_token
  console.log(access_token)
  var options = {
    method: 'POST',
    uri: event.url + access_token,
    access_token: access_token,
    body: {
      query: event.query,
      env: "petmall-hti17"
    },
    json: true // Automatically stringifies the body to JSON
  };
  return await rp(options)
    .then(function (res) {
      console.log(res)
      return res
    })
    .catch(function (err) {
      return '失败'
    });
}