// pages/charge/index.js
Page({
  data:{
    inputValue: 0
  },
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '充值'
    })
  },
  pay: function () {
    //需要上传给云函数的数据
    let uploadData = {
      //此次需要支付的金额，单位是分。例如¥1.80=180
      "total_fee": "180",
      //用户端的ip地址
      "spbill_create_ip": "123.123.123.123"
    }
    //调用云函数
    wx.cloud.callFunction({
      //云函数的名字，这里我定义为payment
      name: "payment",
      //需要上传的数据
      data: uploadData
    }).then(res => {
      console.log(res)
      //这个res就是云函数返回的5个参数
      //通过wx.requestPayment发起支付
      wx.requestPayment({
        timeStamp: res.result.data.timeStamp,
        nonceStr: res.result.data.nonceStr,
        package: res.result.data.package,
        signType: res.result.data.signType,
        paySign: res.result.data.paySign,
        success: res => {
          //支付成功
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
        },
        fail: err => {
          //支付失败
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    })
  },

// 存储输入的充值金额
  bindInput: function(res){
    this.setData({
      inputValue: res.detail.value
    })  
  },
// 充值
  charge: function(){
    // 必须输入大于0的数字
    if(parseInt(this.data.inputValue) <= 0 || isNaN(this.data.inputValue)){
      wx.showModal({
        title: "警告",
        content: "咱是不是还得给你钱？！！",
        showCancel: false,
        confirmText: "不不不不"
      })
    }else{
      wx.redirectTo({
        url: '../wallet/index',
        success: function(res){
          // wx.showToast({
          //   title: "充值成功",
          //   icon: "success",
          //   duration: 2000
          // })
          wx.login({
            success: function (res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: 'https://test.com/onLogin',
                  data: {
                    code: res.code
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        

        
        }
      })
    }
  },
// 页面销毁，更新本地金额，（累加）
  onUnload:function(){
    wx.getStorage({
      key: 'overage',
      success: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue) + parseInt(res.data.overage)
          }
        })
      },
      // 如果没有本地金额，则设置本地金额
      fail: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue)
          },
        })
      }
    }) 
  }
})