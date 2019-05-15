// 引入SDK核心类
var QQMapWX = require('../utils/qqMapSDK/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'LXJBZ-TMUKX-T4W4P-ZXQRI-HTCXZ-YNBPR'
});

var newMarkers = []
function parseWashroomData(results){
 
  for (let result of results.data) {
    
    console.log(result)
   let newMarker = {
     id: result.id,
     latitude: result.location.lat,
     longitude: result.location.lng,
     width: 20,
     height: 20,
     iconPath: "../../images/washroomLogo.png",
     title: result.title ,
     address:result.address

  }
    newMarkers.push(newMarker)
  }
}

// 调用接口
module.exports.qqMapSDKSearch = function (searchWord,loc,fn) {
  qqmapsdk.search({
    keyword: searchWord,
    location: String(loc.latitude) + ',' + String(loc.longitude),
    success: function (res) {
      parseWashroomData(res)
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
  module.exports.newMarkers = newMarkers