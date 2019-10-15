//const cloud = require('../utils/wx-server-sdk/index.js')
// 引入SDK核心类
var QQMapWX = require('../utils/qqMapSDK/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'LXJBZ-TMUKX-T4W4P-ZXQRI-HTCXZ-YNBPR'
});

//const cloud = require('wx-server-sdk')
// wx.cloud.init({
//   env: "mangowashroom - b83ab1"
// })




var newMarkers = []
var washroomMarkers=[]
var parkingLotMarkers=[]
var wholeMarkers=[]
var dis = [];
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
      console.log(res);
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
      console.log(res);
    }
  });
}
function parseWashroomData(results,userLocation,fn){
  var start = userLocation
  var dest = []
  //console.log(e);
  for (let washroom of results.data) {
    dest.push({ latitude: washroom.location.lat, longitude: washroom.location.lng })
  }
  calculateDistance(start, dest, function () {
    var i = 0
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
        distance: dis[i]
      }
      washroomMarkers.push(newMarker)
      wholeMarkers.push(newMarker)
      i++
    }
    console.log(washroomMarkers)

    fn()
    
    
  })
  
}
function parseParkingLotData(results) {

  for (let result of results.data) {
    let newMarker = {
      id: result.id,
      latitude: result.location.lat,
      longitude: result.location.lng,
      width: 40,
      height: 40,
      iconPath: "../../images/parkingLot.jpg",
      title: result.title,
      address: result.address

    }
    parkingLotMarkers.push(newMarker)
    wholeMarkers.push(newMarker)
  }
}

// 调用接口
module.exports.qqMapSDKSearch = function (searchWord,loc,fn) {
  qqmapsdk.search({
    page_size:20,
    auto_extend:1,
    keyword: searchWord,
    location: String(loc.latitude) + ',' + String(loc.longitude),
    success: function (res) {
      if(searchWord=="厕所")
        {parseWashroomData(res,loc,fn)}
      if(searchWord=="停车场")
        {parseParkingLotData(res) }
      console.log(res)
      
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
  module.exports.wholeMarkers=wholeMarkers
  module.exports.newMarkers = newMarkers