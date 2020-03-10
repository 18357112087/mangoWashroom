//const cloud = require('../utils/wx-server-sdk/index.js')
// 引入SDK核心类
var QQMapWX = require('../utils/qqMapSDK/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'LXJBZ-TMUKX-T4W4P-ZXQRI-HTCXZ-YNBPR'
});

//const cloud = require('wx-server-sdk')
var oilStationMarkers = []
var newMarkers = []
var washroomMarkers=[]
var parkingLotMarkers=[]
var wholeMarkers=[]
var dis = [];
var dis1 = []
//在Page({})中使用下列代码
//事件触发，调用接口

module.exports.getDataFromDataBase=function(){
  // 1. 获取数据库引用
  const db = wx.cloud.database()
  // 2. 构造查询语句
  // collection 方法获取一个集合的引用
  // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
  // get 方法会触发网络请求，往数据库取数据
  db.collection('Washrooms').where({
    address:"三桥下"
  }).get({
    success: function (res) {
      // 输出 [{ "title": "The Catcher in the Rye", ... }]
      console.log(res)
    }
  })
}
function calculateDistance(start, dest, fn){
  var _this = this;
  //调用距离计算接口
  qqmapsdk.calculateDistance({
    mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
    //from参数不填默认当前地址
    //获取表单提交的经纬度并设置from和to参数（示例为string格式）
    from: start || '', //若起点有数据则采用起点坐标，若为空默认当前地址
    to: dest, //终点坐标
    success: function (res) {//成功后的回调
      //console.log(res);
      var res = res.result;
      for (var i = 0; i < res.elements.length; i++) {
        dis.push(res.elements[i].distance); //将返回数据存入dis数组，
      }
      //dis[0] = res.elements[0].distance
      fn()
      // _this.setData({ //设置并更新distance数据
      //   distance: dis
      // });
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {
     // console.log(res);
    }
  });
}
var j = 0
function parseWashroomData(results,userLocation,fn){
  var start = userLocation
  var dest = []
  console.log(results);
  for (let washroom of results.data) {
    dest.push({ latitude: washroom.location.lat, longitude: washroom.location.lng })
  }
  calculateDistance(start, dest, function () {
    for (let result of results.data) {
      let newMarker = {
        id: result.id,
        latitude: result.location.lat,
        longitude: result.location.lng,
        width: 40,
        height: 40,
        iconPath: "../../images/washroomLogo2.png",
        title: result.title,
        address: result.address,
        distance: dis[j]
      }
      washroomMarkers.push(newMarker)
      wholeMarkers.push(newMarker)
      j++
    }
   // console.log(washroomMarkers)
    fn()
  })
  
}
function parseParkingLotData(results,userLocation,fn) {
  var start = userLocation
  var dest = []
  //console.log(e);
  for (let washroom of results.data) {
    dest.push({ latitude: washroom.location.lat, longitude: washroom.location.lng })
  }
  calculateDistance(start, dest, function () {
  for (let result of results.data) {
    let newMarker = {
      id: result.id,
      latitude: result.location.lat,
      longitude: result.location.lng,
      width: 40,
      height: 40,
      iconPath: "../../images/parkingLot.jpg",
      title: result.title,
      address: result.address,
      distance:dis[j]
    }
    parkingLotMarkers.push(newMarker)
    wholeMarkers.push(newMarker)
      j++
  }

    fn()


  })

}

//将加油站数据做成markers 
function parseOilStationData(results, userLocation, fn) {
  //获取油价数据
  wx.request({
    url: 'https://www.icauto.com.cn/oil/',
    success: function (res) {
     // console.log(res.data)
      var jsonStr = JSON.stringify(res.data);
      var n_92 = jsonStr.search("浙江92号汽油最新油价")
    //  console.log(n_92)
      var n_95 = jsonStr.search("浙江95号汽油最新油价")
      var n_97 = jsonStr.search("浙江97号汽油最新油价")
      var n_0 = jsonStr.search("浙江0号柴油最新油价")
      //开发油价抓取参数
      // var petrol_92_Price = jsonStr.slice(n_92 + 22, n_92 + 26)
      // var petrol_95_Price = jsonStr.slice(n_95 + 22, n_95 + 26)
      // var petrol_98_Price = jsonStr.slice(n_98 + 22, n_98 + 26)
      // var diesel_0_Price = jsonStr.slice(n_0 + 21, n_0 + 25)
      //真机油价抓取参数
      var petrol_92_Price = jsonStr.slice(n_92 + 14, n_92 + 17)
      var petrol_95_Price = jsonStr.slice(n_95 + 14, n_95 + 18)
      var petrol_97_Price = jsonStr.slice(n_97 + 14, n_97 + 18)
      var diesel_0_Price = jsonStr.slice(n_0 + 13, n_0 + 17)
      // console.log(petrol_92_Price)
      // console.log(petrol_95_Price)
      // console.log(petrol_97_Price)
      // console.log(diesel_0_Price)
      var start = userLocation
      var dest = []
      //console.log(e);
      for (let washroom of results.data) {
        dest.push({ latitude: washroom.location.lat, longitude: washroom.location.lng })
      }
      
      calculateDistance(start, dest, function () {

      //做成markers
      for (let result of results.data) {
        let newMarker = {
          id: result.id,
          latitude: result.location.lat,
          longitude: result.location.lng,
          width: 40,
          height: 40,
          iconPath: "../../images/petrolStation.jpg",
          title: result.title,
          address: result.address,
          petrol_92_Price: petrol_92_Price,
          petrol_95_Price: petrol_95_Price,
          petrol_97_Price: petrol_97_Price,
          diesel_0_Price: diesel_0_Price,
          acitivity: "",
          distance: dis[j]
        }
        oilStationMarkers.push(newMarker)
        wholeMarkers.push(newMarker)
        j++
       
      }
      // console.log(wholeMarkers)
      // console.log(oilStationMarkers)
        fn()
      })
      //回调函数
     
    }, 
    fail: function (res) {
      console.log(res)
    }
  })
}

// 调用接口
module.exports.qqMapSDKSearch = function (searchWord,loc,fn) {
  qqmapsdk.search({
    page_size:20,
    auto_extend:1,
    keyword: searchWord,
    location: String(loc.latitude) + ',' + String(loc.longitude),
    success: function (res) {
      if(searchWord=="厕所"){parseWashroomData(res,loc,fn)}
      if(searchWord=="停车场"){parseParkingLotData(res,loc,fn)}
      if(searchWord == '加油站') { parseOilStationData(res, loc, fn)}
      // console.log(res)
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
     // console.log(res);
    }
  });

  }
  module.exports.sort = function(arr){
      for (var j = 0; j < arr.length - 1; j++) {
        //两两比较，如果前一个比后一个大，则交换位置。
        for (var i = 0; i < arr.length - 1 - j; i++) {
          if (arr[i].distance > arr[i + 1].distance) {
            var temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
          }
        }
      }
  }
  module.exports.dis=dis
  module.exports.calculateDistance=calculateDistance
  module.exports.washroomMarkers=washroomMarkers
  module.exports.parkingLotMarkers=parkingLotMarkers
  module.exports.oilStationMarkers=oilStationMarkers
  module.exports.wholeMarkers=wholeMarkers
  module.exports.newMarkers = newMarkers