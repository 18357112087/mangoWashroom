// 引入SDK核心类
var QQMapWX = require('../utils/qqMapSDK/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'LXJBZ-TMUKX-T4W4P-ZXQRI-HTCXZ-YNBPR'
});

var newMarkers = []
var washroomMarkers=[]
var parkingLotMarkers=[]
var wholeMarkers=[]
function parseWashroomData(results){
 
  for (let result of results.data) {
   let newMarker = {
     id: result.id,
     latitude: result.location.lat,
     longitude: result.location.lng,
     width: 40,
     height: 40,
     iconPath: "../../images/washroomLogo2.png",
     title: result.title ,
     address:result.address

  }
    washroomMarkers.push(newMarker)
    wholeMarkers.push(newMarker)
  }
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
        {parseWashroomData(res)}
      if(searchWord=="停车场")
        {parseParkingLotData(res) }
      console.log(res)
      fn()
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
     // console.log(res);
    }
  });

  }
  module.exports.washroomMarkers=washroomMarkers
  module.exports.parkingLotMarkers=parkingLotMarkers
  module.exports.wholeMarkers=wholeMarkers
  module.exports.newMarkers = newMarkers