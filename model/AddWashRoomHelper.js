
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
module.exports.uploadWashroomToTecentCloud = function(){
  // 1. 获取数据库引用
  const db = wx.cloud.database()
  // 2. 构造查询语句
  // collection 方法获取一个集合的引用
  // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
  // get 方法会触发网络请求，往数据库取数据
  db.collection('Washrooms').where({
    address:"三桥"
  }).get({
    success: function (res) {
      // 输出 [{ "title": "The Catcher in the Rye", ... }]
      console.log(res)
    }
  })





 
}

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