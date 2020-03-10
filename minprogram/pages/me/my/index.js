// pages/my/index.js
const app = getApp()
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      code: ""
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false //登录按钮状态，false表示未登录
  },
  // 页面加载
  onLoad: function () {
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    // 获取本地数据-用户信息
    wx.getStorage({
      key: 'userInfo',
      // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName,
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      }
    });
  },
  getPhoneNumber: function (e) {
    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })
    wx.cloud.callFunction({
      name: 'getToken',  // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: app.globalData.sessionCode    // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        console.log(res.data.phoneNumber)
        app.globalData.userInfo.phoneNumber = res.data.phoneNumber
        // 成功拿到手机号，跳转首页
        wx.switchTab({
          url: '../../index/index' // 这里是要跳转的路径
        })
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    })
  },
  getOpenid: function(){ 
     wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        resolve(res)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        reject(error)
      }
  })},
  saveUserInfo(res){
    app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
    app.globalData.userInfo.nickName = res.userInfo.nickName
    // 存储用户信息到本地
    wx.setStorage({
      key: 'userInfo',
      data: {
        userInfo: {
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        },
        bType: "warn",
        actionText: "退出登录"
      },
      success: function (res) {
        console.log("存储成功")
      }
    })
  },

  // 登录或退出登录按钮点击事件
  bindAction: function () {
    this.data.lock = !this.data.lock
    // 如果没有登录，登录按钮操作
    if (this.data.lock) {
      wx.showLoading({
        title: "正在登录"
      });
      // 如果已经登录，退出登录按钮操作     
    } else {
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用芒果出行",
        success: (res) => {
          if (res.confirm) {
            console.log("确定")
            // 退出登录则移除本地用户信息
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录"
            })
          } else {
            console.log("cancel")
            this.setData({
              lock: true
            })
          }
        }
      })
    }
  },
  // 跳转至钱包
  movetoWallet: function () {
    wx.navigateTo({
      url: '../wallet/index'
    })
  }
})