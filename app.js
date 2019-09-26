//app.js
//微信小程序账号密码

var refreshFlag = false
//leancloud app账号密码
const AV = require('./utils/av-weapp-min-leancloud.js');
AV.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz',
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
  // appID: 'wxc6be225939b7321d',
  // appKey: '12e92fc56b2d4d4010b069e47b74869b'
})

App({
  globalData:{
    washrooms: [],
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      code: "",
      username:""
    },
    currentMarker: {id:"",
      title: "无", address: "无", latitude
        :
        0,
longitude
        :
        0}

    }
   

  
})