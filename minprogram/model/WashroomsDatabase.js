//添加厕所
const db = wx.cloud.database()
module.exports.onAdd=function (data,fn) {
  console.log(data)
      db.collection('washrooms').add({
        data: {
          title: data.title,
          address: data.address,
          location: new db.Geo.Point(parseFloat(data.longitude), parseFloat(data.latitude)),
          picUrls: data.picUrls
        },
        success: res => {
          fn("success", res)
        },
        fail: err => {
          fn("fail", err)
        }
      })},
//添加厕所评论
module.exports.onAddComments = function (data, fn) {
      db.collection('comments').add({
        data: {
          washroomId:data.washroomId,
          rate:data.rate,
          commentText:data.commentText,
          checkboxValue: data.checkboxValue,
          picUrls: data.picUrls,
          username: data.username,
          textInput:data.textInput
        },
        success: res => {
          fn("success", res)
        },
        fail: err => {
          fn("fail", err)
        }
      })
    },
    
//根据地理位置搜索
module.exports.onQueryGeo=function (location,fn) {
  return new Promise((resolve,reject)=>{
  const db = wx.cloud.database()
  console.log(location)
  // 查询当前用户所有的 washrooms
  db.collection('washrooms').where({
    location: db.command.geoNear({
      geometry: db.Geo.Point(location.longitude,location.latitude),
      minDistance: 0,
      maxDistance: 20000,
    })
  }).get({
    success: res => {
      resolve(res)
      console.log('根据[数据库] [查询记录] 成功: ', res)
    },
    fail: err => {
      reject(error)
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })

  })
},

module.exports.onRemove=function () {
  if (this.data.counterId) {
    const db = wx.cloud.database()
    db.collection('counters').doc(this.data.counterId).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          counterId: '',
          count: null,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  } else {
    wx.showToast({
      title: '无记录可删，请见创建一个记录',
    })
  }
},

// 上传图片
module.exports.doUpload = function (filePaths,fn) {
  var fileIDs = []
  var count = 0
  for(var i = 0;i<filePaths.length;i++){
    var successUp = 0
    var failUp = 0
       const cloudPath = 'washroom-image' +i+filePaths[i].match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath:filePaths[i],
        success: res => {
          console.log('[上传文件] 成功：', res)
          console.log(res.fileID)
          fileIDs.push(res.fileID)
          successUp++
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          fn("fail", e)
          failUp++
        },
        complete: () => {
          count++
          console.log("count:"+count)
          if (count == filePaths.length) {
            //上传完毕，作一下提示
            console.log('上传成功' + successUp + ',' + '失败' + failUp);
            fn("success", res,successUp,fileIDs)
          } else {
            //递归调用，上传下一张
            console.log('正在上传第' + i + '张');
          }
          wx.hideLoading()
        }
      })
  }

}
module.exports.getTempFileURL=function(fileIDs,fn){
wx.cloud.getTempFileURL({
  fileList: fileIDs,
  success: res => {
    // get temp file URL
    fn("success",res)
    console.log(res.fileList)
  },
  fail: err => {
    // handle error
    fn("fail", res)
  }
})
}
