
const AV = require('../utils/av-weapp-min.js'); 
AV.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz',
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
  // appID: 'wxc6be225939b7321d',
  // appKey: '12e92fc56b2d4d4010b069e47b74869b'
})
var backMessage = ""
// 声明类型
var Comment = AV.Object.extend('Comment');
// 新建对象
var comment = new Comment();
// 设置数据内容
// washroom.set('title', app.currentMarker.title);
// washroom.set('address', app.currentMarker.address);

// washroom.set('coordinate', new AV.GeoPoint(app.currentMarker.latitude, app.currentMarker.longitude));
module.exports.uploadComment = function(washroomId,picUrls,tagList,rate,commentText,username){
comment.set('washroomId', washroomId)
// 故障车周围环境图路径数组
comment.set('picUrls', picUrls);
// 设置优先级
comment.set('tag',tagList)
comment.set('rate', rate)
comment.set('commentText', commentText)
comment.set('username', username)

comment.save().then(function (res) {
  console.log('objectId is ' + res.id);
  console.log(res)
  backMessage = "提交成功"
}, function (error) {
  console.error(error);
});}
module.exports.backMessage = backMessage