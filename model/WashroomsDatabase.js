module.exports.onAdd=function (data,fn) {
  var that = this
  const db = wx.cloud.database()
  db.collection('washrooms').add({
    data: {
      //title: that.data.title
      latitude:data.latitude,
      longitude:data.longitude
    },
    success: res => {
      // 在返回结果中会包含新创建的记录的 _id
      // this.setData({
      //   washroomId: res._id,
      //   //count: 1
      // })
      fn("success",res)
      
    },
    fail: err => {
      fn("fail", err)
     
    }
  })
},

module.exports.onQuery=function (fn) {
  const db = wx.cloud.database()
  // 查询当前用户所有的 counters
  db.collection('counters').where({
    _openid: this.data.openid
  }).get({
    success: res => {
      fn("success",res)
      // this.setData({
      //   queryResult: JSON.stringify(res.data, null, 2)
      // })
      console.log('[数据库] [查询记录] 成功: ', res)
    },
    fail: err => {
      fn("fail",err)
      // wx.showToast({
      //   icon: 'none',
      //   title: '查询记录失败'
      // })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
},

module.exports.onCounterInc=function () {
  const db = wx.cloud.database()
  const newCount = this.data.count + 1
  db.collection('counters').doc(this.data.counterId).update({
    data: {
      count: newCount
    },
    success: res => {
      this.setData({
        count: newCount
      })
    },
    fail: err => {
      icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
    }
  })
},

module.exports.onCounterDec=function () {
  const db = wx.cloud.database()
  const newCount = this.data.count - 1
  db.collection('counters').doc(this.data.counterId).update({
    data: {
      count: newCount
    },
    success: res => {
      this.setData({
        count: newCount
      })
    },
    fail: err => {
      icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
    }
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

module.exports.nextStep=function () {
  // 在第一步，需检查是否有 openid，如无需获取
  if (this.data.step === 1 && !this.data.openid) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        this.setData({
          step: 2,
          openid: res.result.openid
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })
  } else {
    const callback = this.data.step !== 6 ? function () { } : function () {
      console.group('数据库文档')
      console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
      console.groupEnd()
    }

    this.setData({
      step: this.data.step + 1
    }, callback)
  }
},

module.exports.prevStep=function () {
  this.setData({
    step: this.data.step - 1
  })
}