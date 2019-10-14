var app = getApp();
var titles = []
const QQMapSDK = require('../../model/qqMapSDK.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 数据源
    washrooms: [],
    distances:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var array = [1, 4, -8, -3, 6, 12, 9, 8];
    console.log(app.globalData.washrooms)
    QQMapSDK.sort(app.globalData.washrooms)
    this.setData({
      washrooms: app.globalData.washrooms,
    })
   let that = this
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  
  navigation(e){
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
  itemClick: function (e) {
    that = this
    // 获取点击条目id
    var index = parseInt(e.currentTarget.dataset.index);
    // 获取相应的数据
    console.log(index)
    // var item = that.data.oilStations[index]
    // // 打印数据
    // console.log(item);

  },


})