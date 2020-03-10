//index.js
const BaiduMapSDK = require('../../utils/bmap-wx.js')
const QQMapSDK = require('../../model/qqMapSDK.js')
const Controls = require('../../views/controls/Controls.js')
const WashroomsDB = require('../../model/WashroomsDatabase.js')
var app = getApp();
var isEmptyObject = function (e) {
  var temp;
  for (temp in e)
    return !1;
  return !0
}
Page({
  data: {
    washrooms:[],
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
    currMaker: { title: "无", address: "无", washroomId:''},
    title:"",
    address:"",
    scale: 17,
    latitude: 0,
    longitude: 0,
    userLocation: { "latitude": 0,"longitude":0},
    washroommMarkers: [],
    parkingLotMarkers:[],
    oilStationMarkers:[],
    markers:[],
    scale: 17,
    washroomList:[]
  },
  loadList(){
    QQMapSDK.sort(app.globalData.washrooms)
    var tmp = []
    for(var i = 0;i<3;i++)
    {
      tmp.push(app.globalData.washrooms[i])
    }
    this.setData({
      washroomList: tmp
    })
  },
// 页面加载
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
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
        })
        app.globalData.userLocation = this.data.userLocation
        WashroomsDB.onQueryGeo(this.data.userLocation,function(message,res){
          console.log(message)
          var tmp = that.data.markers
          console.log("res",res.data)
          console.log("markers", that.data.markers)
          res.data.forEach(result => {
            let newMarker = {
              id: result._id,
              latitude: result.location.latitude,
              longitude: result.location.longitude,
              width: 40,
              height: 40,
              iconPath: "../../images/washroomLogo2.png",
              title: result.title,
              address: result.address,
             // distance: dis[j]
            }
            tmp.push(newMarker)
          });
          console.log("tmp",tmp)
          this.setData({
            markers:tmp
          })
          console.log(tmp)
          console.log(res)

        })
          
        
        QQMapSDK.qqMapSDKSearch('厕所', that.data.userLocation, function () {
          that.setData({
            //markers: MarkerHelper.newMarkers,
            markers: QQMapSDK.wholeMarkers,
            washroommMarkers: QQMapSDK.washroomMarkers
          })
          app.globalData.washrooms = QQMapSDK.washroomMarkers
          that.loadList()
          QQMapSDK.qqMapSDKSearch('加油站', that.data.userLocation, function () {
            that.setData({
              //markers: MarkerHelper.newMarkers,
              markers: QQMapSDK.wholeMarkers,
              oilStationMarkers: QQMapSDK.oilStationMarkers
            })
            app.globalData.oilStations = QQMapSDK.oilStationMarkers,
             QQMapSDK.qqMapSDKSearch('停车场', that.data.userLocation, function () {
          that.setData({
            markers: QQMapSDK.wholeMarkers,
            parkingLotMarkers: QQMapSDK.parkingLotMarkers
          })
               app.globalData.parkingLots = QQMapSDK.parkingLotMarkers
        })
          })
          // wx.showActionSheet({
          //   itemList: ['A', 'B', 'C'],
          //   success: function (res) {
          //     if (!res.cancel) {
          //       console.log(res.tapIndex)
          //     }
          //   }
          // })  
        })
      }
    }),
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        Controls.setControls(res, function (controls){
          console.log(Controls.controls)
          that.setData({controls: controls})
        })}})
  },
  hideParkingLot() {
    console.log("press hide park")
    this.setData({
      markers: []
    })
    this.setData({
      scale: 17,
      markers:this.data.washroommMarkers
    })
  },
  hideWashroom() {
    console.log("press hide washroom")
    this.setData({
      markers: []
    })
    this.setData({
      markers: this.data.parkingLotMarkers,
       scale: 17
    })
  },
  hideWashroomAndParkingLot(){
    console.log("press hide washroom and parkinglot")
    this.setData({
      markers: [],
    })
    this.setData({
      markers: this.data.oilStationMarkers,
      scale: 13
      
    })

  },
  ////添加厕所，导航到添加厕所界面
  addWashroom() {
    wx.navigateTo({
      url: '../addWashroom/addWashroom'
    })
  },

  navigationList(e) {
    var item
    var id = parseInt(e.currentTarget.id);
    // 获取相应的数据
    for (let washroom of app.globalData.washrooms) {
      if (washroom.id == id) {
        item = washroom
      }
    }
    // 打印数据
    console.log(item);
    wx.openLocation({//​使用微信内置地图查看位置。
      latitude: item.latitude,//要去的纬度-地址
      longitude: item.longitude,//要去的经度-地址
      title: item.title,
      address: item.address,
      scale: 19
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
    var that = this
    that.mapCtx.getCenterLocation({
      success: function (res) {
        var data = { "latitude": res.latitude, "longitude": res.longitude }
        console.log('pin location',res)
    QQMapSDK.qqMapSDKSearch('厕所',data,function () {
        console.log('扩大搜索范围')
      console.log(QQMapSDK.washroomMarkers)
        that.setData({
          //markers: MarkerHelper.newMarkers,
          markers: QQMapSDK.washroomMarkers
        })
      app.globalData.washrooms = QQMapSDK.washroomMarkers
      })
      }
    })
  },
  addComment(){
    console.log(this.data.currMaker)
     wx.navigateTo({
       url: '../addComments/index?title=' + this.data.currMaker.title + '&address=' + this.data.currMaker.address + '&washroomId=' + this.data.currMaker.id
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
    let that = this
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
       wx.navigateTo({
          url: '../customerService/customerService'
        });
        break;
      // 点击头像控件，跳转到个人中心
      case 5: wx.navigateTo({
        url: '../my/index'
      });
        break; 
      case 6: 
        that.setData({
          scale: that.data.scale+1
        })
        break; 
      case 7: that.setData({
        scale: that.data.scale-1
      })
        break; 
      default: break;
    }
  },
// 地图视野改变事件
  bindregionchange: function(e){
   // console.log(e)
    var that = this
    console.log('视野改变')
    console.log('e',e)
    // 拖动地图，获取附件单车位置
    if(e.type == "begin"){
     
    // 停止拖动，显示单车位置
    }else if(e.type == "end"){
      that.expandSearchArea()
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
// 地图标记点击事件
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
        break;
      }
    }
    this.setData({
      hiddenName: false,
      distance: this.data.currMaker.distance,
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
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '芒果找厕所 by Andy',
      imageUrl: '../../images/washroomLogo2.png',
      path: '/pages/index/index'
    }

  }

  
})
