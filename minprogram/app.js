//app.js
//微信小程序账号密码

var refreshFlag = false



App({
  globalData:{
    sessionCode:"",
    openid:"",
    washrooms: [],
    parkingLots:[],
    oilStations:[],
    userLocation: { "latitude": 0, "longitude": 0 },
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      code: "",
      username:"",
      phoneNumber:""
    },
    currentMarker: {id:"",
      title: "无", address: "无", latitude
        :
        0,
longitude
        :
        0}

    },
    onLaunch: function () {
    //this.networkManage(); //调用监听网络状态的方法
    //this.updateManage(); //调用检测小程序版本更新的方法
    // ---------------------------------------------网络状态 
      function networkManage() {
      var that = this;
      //监听网络状态
      wx.onNetworkStatusChange(function (res) {
        if (!res.isConnected) {
          that.msg('网络似乎不太顺畅');
        }
      })
    }//--------end
    //---------------------------------------------检测小程序版本更新
    
      function updateManage() {
      var that = this;
      var updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
        if (!res.hasUpdate) {
        }
      })
      // 监听新版本下载成功
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            } else {
              that.updateManage();
            }
          }
        })
      })
      // 监听新版本下载失败
      updateManager.onUpdateFailed(function () {
        app.showModal({
          content: '新版本更新失败，是否重试？',
          confirmText: '重试',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        });
      })
    }//--------end

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



  