//index.js
 const AVLeanCloud = require('../../utils/av-weapp-min-leancloud.js');
const MarkerHelper = require('../../model/MarkersHelper.js')
const QQMapSDK = require('../../model/qqMapSDK.js')
//MarkerHelper.downloadMarker()
var app = getApp();
var isEmptyObject = function (e) {
  var temp;
  for (temp in e)
    return !1;
  return !0
}
Page({
  leanCloudUserData: {
    user: {
      nickname: "",
      avatarUrl: "",
    }
  },
  
  globalData: {
    user: {
    }
  },
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      code: ""
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false, //登录按钮状态，false表示未登录
    canvasOpacity:0,
    currMaker: { title: "无", address: "无"},
    title:"",
    address:"",
    scale: 17,
    latitude: 30.216804,
    longitude: 120.233276,
    userLocation: { "latitude": 0,"longitude":0},
    washroommMarkers: [],
    parkingLotMarkers:[],
    markers:[],
    polyline: [{
      points: [{
        longitude: 30.216804,
        latitude: 120.233276
      }, {
          longitude: 30.216804,
          latitude: 120.233276,
      }],
      color: "#FF0000DD",
      width: 1,
      dottedLine: true
    }],
    scale: 17
  },
// 页面加载
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
          that.checkSettingStatu();
        },
        fail: function () {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
            success: function (resbtn) {
              if (resbtn.confirm) {
                wx.openSetting({
                  success: function success(resopen) {
                    //  获取用户数据
                    that.checkSettingStatu();
                  }
                });
              }
            }
          })
        }
      })
    }
    // wx.getStorage({
    //   key: 'userInfo',
    //   // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
    //   success: (res) => {
    //     wx.hideLoading();
    //     this.setData({
    //       userInfo: {
    //         avatarUrl: res.data.userInfo.avatarUrl,
    //         nickName: res.data.userInfo.nickName,
    //       },
    //       bType: res.data.bType,
    //       actionText: res.data.actionText,
    //       lock: true
    //     })
    //   }
    // });
    // // wx.checkSession({
    // //   success() {
    // //     // session_key 未过期，并且在本生命周期一直有效
    // //   },
    // //   fail() {
    //     // session_key 已经失效，需要重新执行登录流程
    //     //wx.login() // 重新登录

    // wx.login({
    //   success: (res) => {
    //     console.log(res)
    //     wx.hideLoading();
    //     wx.getUserInfo({
    //       withCredentials: false,
    //       success: (res) => {
    //         console.log(res)
    //         console.log("haha"
    //         )
    //         AVLeanCloud.User.loginWithWeapp().then(user => {
    //           this.leanCloudUserData.user.avatarUrl = res.userInfo.avatarUrl,
    //             this.leanCloudUserData.user.nickname = res.userInfo.nickName

    //           this.leanCloudUserData.user = user.toJSON();
    //         }).catch(console.error);

    //         //save in leanCloud
    //         user.set(res.userInfo).save().then(user => {
    //           // 成功，此时可在控制台中看到更新后的用户信息
    //           //this.globalData.user = user.toJSON();
    //         }).catch(console.error);
    //         this.setData({
    //           userInfo: {
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName
    //           },
    //           bType: "warn",
    //           actionText: "退出登录"
    //         });
    //         // 存储用户信息到本地
    //         wx.setStorage({
    //           key: 'userInfo',
    //           data: {
    //             userInfo: {
    //               avatarUrl: res.userInfo.avatarUrl,
    //               nickName: res.userInfo.nickName
    //             },
    //             bType: "warn",
    //             actionText: "退出登录"
    //           },
    //           success: function (res) {
    //             console.log("存储成功")
    //           }
    //         })
    //       }, fail: function (res) {
    //         console.log('获取用户信息失败')
    //         console.log(res)
    //       }
    //     })
    //   }
    
    

    // 1.获取定时器，用于判断是否已经在计费
    this.timer = options.timer;
    var that = this
    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          userLocation:{
            "latitude":res.latitude,
            "longitude": res.longitude}
          // markers: MarkerHelper.newMarkers,
          // markers: QQMapSDK.newMarkers
        })
        QQMapSDK.qqMapSDKSearch('厕所', that.data.userLocation, function () {
          that.setData({
            //markers: MarkerHelper.newMarkers,
            markers: QQMapSDK.wholeMarkers,
            washroommMarkers: QQMapSDK.washroomMarkers
          })

        })
        QQMapSDK.qqMapSDKSearch('停车场', that.data.userLocation, function () {
          that.setData({
            //markers: MarkerHelper.newMarkers,
            markers: QQMapSDK.wholeMarkers,
            parkingLotMarkers: QQMapSDK.parkingLotMarkers
          })

        })

       

      }
    }),
    

    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: 20,
              top: res.windowHeight/2+95,
              width: 50,
              height: 50
            },
            clickable: true
          },
          // {
          //   id: 2,
          //   iconPath: '/images/use.png',
          //   position: {
          //     left: res.windowWidth/2 - 45,
          //     top: res.windowHeight - 100,
          //     width: 90,
          //     height: 90
          //   },
          //   clickable: true
          // },
          // {
          //   id: 3,
          //   iconPath: '/images/warn.png',
          //   position: {
          //     left: res.windowWidth - 70,
          //     top: res.windowHeight - 80,
          //     width: 50,
          //     height: 50
          //   },
          //   clickable: true
          // },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth/2 - 11,
              top: res.windowHeight/2 - 45,
              width: 22,
              height: 45
            },
            clickable: true
          },
          // {
          //   id: 5,
          //   iconPath: '/images/avatar.png',
          //   position: {
          //     left: res.windowWidth - 68,
          //     top: res.windowHeight - 155,
          //     width: 45,
          //     height: 45
          //   },
          //   clickable: true
          //   }
            // , {
            //   id: 6,
            //   iconPath: '/images/location.png',
            //   position: {
            //     left: res.windowWidth/2-30,
            //    top: res.windowHeight - 100,
            //    width: 200,
            //    height: 80
            //   },
            //   clickable: true
            // }
          
          ]
        })
      }
    })
  },
  hideParkingLot() {
    console.log("press hide park")
    this.setData({
      markers: []
    })
    this.setData({
      markers:this.data.washroommMarkers
    })
  },
  hideWashroom() {
    console.log("press hide washroom")
    this.setData({
      markers: []
    })
   
    this.setData({
      markers: this.data.parkingLotMarkers
    })
  },
  navigation() {
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: this.data.currMaker.latitude,//要去的纬度-地址
      longitude: this.data.currMaker.longitude,//要去的经度-地址
      title: this.data.currMaker.title,
      address: this.data.currMaker.address,
      scale: 19
    })

  },
  expandSearchArea() {
    QQMapSDK.qqMapSDKSearch('厕所', this.data.userLocation,function () {
        console.log('扩大搜索范围')
        console.log(QQMapSDK.newMarkers)
        that.setData({
          //markers: MarkerHelper.newMarkers,
          markers: QQMapSDK.newMarkers
        })

      })
    

  },
  addComment(){
     wx.navigateTo({
          url: '../warn/index'
        });

  },
// 页面显示
  onShow: function(){
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("ofoMap");
    this.movetoPosition()
  },
// 地图控件点击事件
  bindcontroltap: function(e){
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch(e.controlId){
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费
       case 2: 
      // if(this.timer === "" || this.timer === undefined){
      //     // 没有在计费就扫码
      //     wx.scanCode({
      //       success: (res) => {
      //         // 正在获取密码通知
      //         wx.showLoading({
      //           title: '正在获取密码',
      //           mask: true
      //         })
      //         // 请求服务器获取密码和车号
      //         wx.request({
      //           url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
      //           data: {},
      //           method: 'GET', 
      //           success: function(res){
      //             // 请求密码成功隐藏等待框
      //             wx.hideLoading();
      //             // 携带密码和车号跳转到密码页
      //             wx.redirectTo({
      //               url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
      //               success: function(res){
      //                 wx.showToast({
      //                   title: '获取密码成功',
      //                   duration: 1000
      //                 })
      //               }
      //             })           
      //           }
      //         })
      //       }
      //     })
      //   // 当前已经在计费就回退到计费页
      //   }else{
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }  
        break;
      // 点击保障控件，跳转到报障页
      case 3:
      //  wx.navigateTo({
      //     url: '../warn/index'
      //   });
        break;
      // 点击头像控件，跳转到个人中心
      case 5: wx.navigateTo({
          url: '../my/index'
        });
        break; 
      default: break;
    }
  },
// 地图视野改变事件
  bindregionchange: function(e){
   // console.log(e)
    var that = this
    // 拖动地图，获取附件单车位置
    if(e.type == "begin"){
     
    // 停止拖动，显示单车位置
    }else if(e.type == "end"){
      // QQMapSDK.qqMapSDKSearch('厕所', this.data.userLocation,function () {
      //   console.log('完成拖动开始搜索厕所')
      //   console.log(QQMapSDK.newMarkers)
      //   that.setData({
      //     //markers: MarkerHelper.newMarkers,
      //     markers: QQMapSDK.newMarkers
      //   })

      // })
        this.setData({
          //markers: this.data._markers
        })
    }
  },
// 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function(e){
    //console.log(e);
    let _markers = this.data.markers;
    let markerId = e.markerId;
    for (let _marker of _markers)
    {
      if (_marker.id === markerId )
      {
        this.data.currMaker = _marker;
        break;
      }
    }
    this.setData({
      canvasOpacity:0.9,
      title: this.data.currMaker.title,
      address: this.data.currMaker.address,
    })
    console.log(this.data.currMaker)
    console.log(this.data.canvasOpacity)
    
    //储存到全局变量
    app.currentMarker=this.data.currMaker
    
  },
  
// 定位函数，移动位置到地图中心
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  }
})
