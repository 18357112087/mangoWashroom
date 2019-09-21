
const AV = require('../utils/av-weapp-min.js');
var app = getApp();
AV.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz',
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
  // appID: 'wxc6be225939b7321d',
  // appKey: '12e92fc56b2d4d4010b069e47b74869b'
})
var backMessage = ""
// 声明类型
// 新建对象
var Washroom = AV.Object.extend('Washroom')
var washroom = new Washroom();
// 设置数据内容


module.exports.uploadWashroom = function (title,address, lat,lon) {
  washroom.set('title', title);
  washroom.set('address', address);
  washroom.set('coordinate', new AV.GeoPoint(lat, lon));
  washroom.save().then(function (res) {
    console.log('objectId is ' + res.id);
    console.log(res)
    backMessage = "提交成功"
  }, function (error) {
    console.error(error);
  });
}
module.exports.backMessage = backMessage