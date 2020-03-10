// pages/wallet/index.js
const WashroomDatabase = require('../../model/WashroomsDatabase.js')
Page({
  data: {
      picUrls: [],
      latitude:0,
      longitude:0,
      title:"",
      address: "",
    // 故障类型数组
    checkboxValue: [],
    // 选取图片提示
    actionText: "拍照/相册",
    // 提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "",
    // 复选框的value，此处预定义，然后循环渲染到页面
    itemsValue: [
      {
        checked: false,
        value: "卫生好",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "环境好",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "坐便器",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "空气清新",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "不拥挤",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "厕纸充足",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "位置好",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "其他",
        color: "#b9dd08"
      }
    ]
  },
  // 页面加载
  onLoad: function (options) {
    this.setData({
        latitude:options.latitude,
        longitude:options.longitude
    })
  },
  // 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function (e) {
    let _values = e.detail.value;
    if (_values.length == 0) {
      this.setData({
        btnBgc: ""
      })
    } else {
      this.setData({
        checkboxValue: _values,
        btnBgc: "#b9dd08"
      })
    }
  },
  // 输入厕所标题，存入inputValue
  numberChange: function (e) {
    var that = this 
    this.setData({
        title: e.detail.value,
        address: this.data.address,
    })
    if(that.data.address!=''&&that.data.title!='')
    {
      that.setData({
        btnBgc: "#b9dd08"
      })
    }
  },
  // 输入厕所地址，存入inputValue
  descChange: function (e) {
    var that = this
    this.setData({
        title: this.data.title,
        address: e.detail.value,
    })
    if (that.data.address != '' && that.data.title != '') {
      that.setData({
        btnBgc: "#b9dd08"
      })
    }
  },
  // 提交到服务器
  formSubmit: function (e) {
    var that = this
   // if (this.data.title!=''&&this.data.address!='') {
     var data = {
       "latitude":that.data.latitude,
       "longitude":that.data.longitude,
       "title": that.data.title, 
       "address": that.data.address, 
       "picUrls":this.data.picUrls,
       " checkboxValue": this.data.checkboxValue
      }
    WashroomDatabase.onAdd(data,function(message,res){
          console.log(message)
          console.log(res)
          if (message="success"){
            wx.showToast({
              title: '添加成功',
              duration:1500
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            wx.navigateBack({
              delta: 2
            })
          }
          else{
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', res)
          }
        })
    //}
    
  },
  // 选择故障车周围环境图 拍照或选择相册
  bindCamera: function () {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tfps = res.tempFilePaths;
        let _picUrls = this.data.picUrls;
        for (let item of tfps) {
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
        };
        var tempFilePath = res.tempFilePaths[0];
        WashroomDatabase.doUpload(res.tempFilePaths,function(message,res,successUp,fileIDs){
          console.log(message)
          if(message=="success"){
            wx.showToast({
              title: '上传成功' + successUp,
              icon: 'success',
              duration: 2000
            })

            WashroomDatabase.getTempFileURL(fileIDs,function(message,res){
              console.log(res.filList)
            })
          }
          else{
            wx.showToast({
              title: '上传成功' + successUp,
              icon: 'fail',
              duration: 2000
            })

          }

        })
        // new AV.File('pictrue', {
        //   blob: {
        //     uri: tempFilePath,
        //   },
        // }).save().then(
        //   file => console.log(file.url())
        // ).catch(console.error);
      }
    })
  },
  onShareAppMessage(){
    return {
      title: '芒果找厕所 by Andy',
      imageUrl: '../../images/washroomLogo2.png',
      path: '/pages/addWashroomDetail/index'
    }

  },
  // 删除选择的故障车周围环境图
  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
  }
})