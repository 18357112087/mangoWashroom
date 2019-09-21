//index.js
 const AVLeanCloud = require('../../utils/av-weapp-min-leancloud.js');
const AddWashroomHelper = require('../../model/AddWashRoomHelper.js')
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
 

  
// 定位函数，移动位置到地图中心
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },

  // 提交到服务器
  formSubmit: function (e) {

    AddWashroomHelper.uploadWashroom(this.data.title,this.data.address,this.data.latitude,this.data.longitude)
    console.log("back")
    wx.showToast({
      title: AddWashroomHelper.backMessage,
      icon: 'success',
      duration: 5000,
      confirmText: "感谢您的帮助",
      cancelText: "劳资不填",
      success: (res) => {
        if (res.confirm) {
          // 继续填
        } else {
          console.log("back")
          wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面
          })
        }
      }
    })}
})
