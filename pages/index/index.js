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
    //marker distance to the userLocation
    distance:0,
    hiddenName:true,
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
    // wx.checkSession({
    //   success() {
    //     // session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail() {
        // session_key 已经失效，需要重新执行登录流程
        //wx.login() // 重新登录

    wx.login({
      success: (res) => {
        console.log(res)
        wx.hideLoading();
        wx.getUserInfo({
          withCredentials: false,
          success: (res) => {
            console.log(res)
            console.log("haha"
            )
            AVLeanCloud.User.loginWithWeapp().then(user => {
              console.log(user)
              app.globalData.userInfo.username = user.attributes.username
              console.log(app.globalData.userInfo.username)

              this.leanCloudUserData.user.avatarUrl = res.userInfo.avatarUrl,
                this.leanCloudUserData.user.nickname = res.userInfo.nickName

              this.leanCloudUserData.user = user.toJSON();
              //save in leanCloud
              user.set(res.userInfo).save().then(user => {
                // 成功，此时可在控制台中看到更新后的用户信息
                //this.globalData.user = user.toJSON();
              }).catch(console.error);

            }).catch(console.error);

            
            
            app.globalData.userInfo.avatarUrl =res.userInfo.avatarUrl
            app.globalData.userInfo.nickName = res.userInfo.nickName
            
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
              success: function (res) {
                console.log("存储成功")
              }
            })
          }, fail: function (res) {
            console.log('获取用户信息失败')
            console.log(res)
          }
        })
      }
    })
    

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
  ////添加厕所，导航到添加厕所界面
  addWashroom() {
    wx.navigateTo({
      url: '../addWashroom/addWashroom'
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
     
        this.setData({
          //markers: this.data._markers
        })
    }
  },
  //按关闭关闭窗口
  closeTheBottomWindow:function(e){
    this.setData({
      hiddenName:true
    })
    

  },
// 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function(e){
    console.log(e)
    var that = this
    var start = this.data.userLocation
    
    
    //console.log(e);
    let _markers = this.data.markers;
    let markerId = e.markerId;
    for (let _marker of _markers)
    {
      if (_marker.id === markerId )
      {
        this.data.currMaker = _marker;
        var dest = [{latitude:this.data.currMaker.latitude,longitude: this.data.currMaker.longitude}]
        console.log(start)
        console.log(dest)
        QQMapSDK.calculateDistance(start,dest,function(){
          console.log(QQMapSDK.dis[0])
          that.setData({
            distance:QQMapSDK.dis[0]
          })
        })
        break;
      }
    }
    this.setData({
      hiddenName: false,
      
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
