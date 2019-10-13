// pages/my/index.js
 const AVLeanCloud = require('../../../utils/av-weapp-min-leancloud.js');
const user = AVLeanCloud.User.current();
// AVLeanCloud.User.loginWithWeapp().then(user => {
//   this.data.user = user.toJSON();
// }).catch(console.error);
Page({
  leanCloudUserData:{ 
  user: {
    nickname: "",
    avatarUrl: "",
  }},
  data:{
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      code:""
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false //登录按钮状态，false表示未登录
  },
// 页面加载
  onLoad:function(){
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
// 登录或退出登录按钮点击事件
  bindAction: function(){
    this.data.lock = !this.data.lock
    // 如果没有登录，登录按钮操作
    if(this.data.lock){
      wx.showLoading({
        title: "正在登录"
      });
      wx.login({
        success: (res) => {
          console.log(user)
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              console.log(res)
              AVLeanCloud.User.loginWithWeapp().then(user => {
                this.leanCloudUserData.user.avatarUrl = res.userInfo.avatarUrl,
                  this.leanCloudUserData.user.nickname = res.userInfo.nickName
                this.leanCloudUserData.user = user.toJSON();
              }).catch(console.error);
              //save in leanCloud
              user.set(res.userInfo).save().then(user => {
                // 成功，此时可在控制台中看到更新后的用户信息
                //this.globalData.user = user.toJSON();
              }).catch(console.error);
              
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                bType: "warn",
                actionText: "退出登录"
              });
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
               
               


                success: function(res){
                  console.log("存储成功")
                }
              })
            }     
          })
        }
      })
    // 如果已经登录，退出登录按钮操作     
    }else{
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用芒果出行",
        success: (res) => {
          if(res.confirm){
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
          }else {
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
  movetoWallet: function(){
    wx.navigateTo({
      url: '../wallet/index'
    })
  }
})