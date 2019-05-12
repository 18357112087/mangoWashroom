//app.js
//微信小程序账号密码

var refreshFlag = false
const AV = require('./utils/av-weapp-min.js'); 
 
AV.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz', 
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
})

//leancloud app账号密码
const AVLeanCloud = require('./utils/av-weapp-min-leancloud.js');
AVLeanCloud.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz',
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
  // appID: 'wxc6be225939b7321d',
  // appKey: '12e92fc56b2d4d4010b069e47b74869b'
})

App({
  
})