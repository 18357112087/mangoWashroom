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
    openid:"",
    washrooms: [],
    parkingLots:[],
    oilStations:[],
    userLocation: { "latitude": 0, "longitude": 0 },
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

var app = getApp()

if (!wx.cloud) {
  console.error("请使用2.2.3或以上的基础库以便于使用云能力")
} else {
  wx.cloud.init({
    env: "mangowashroom-b83ab1",
    traceUser: true
  })
  // 调用云函数，获取用户的openid
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      // wx.navigateTo({
      //   url: '../userConsole/userConsole',
      // })
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    }
  })
}