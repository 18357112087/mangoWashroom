// pages/wallet/index.js
const WashroomDatabase = require('../../../model/WashroomsDatabase.js')
Page({
  data: {
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
   
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
    console.log(options)
    this.setData({
        latitude:options.latitude,
        longitude:options.longitude
    })
    // 
    wx.setNavigationBarTitle({
      title: '评论'
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
        address: this.data.address
    })
  },
  // 输入厕所地址，存入inputValue
  descChange: function (e) {
    this.setData({
        title: this.data.title,
        address: e.detail.value
      
    })
  },
  // 提交到服务器
  formSubmit: function (e) {
    var that = this
    // if (this.data.picUrls.length > 0 && this.data.checkboxValue.length > 0) {
      // wx.request({
      //   url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/msg',
      //   data: {
      //     // picUrls: this.data.picUrls,
      //     // inputValue: this.data.inputValue,
      //     // checkboxValue: this.data.checkboxValue
      //   },
      //   method: 'get', // POST
      //   // header: {}, // 设置请求的 header
      //   success: function (res) {
      //     wx.showToast({
      //       title: res.data.data.msg,
      //       icon: 'success',
      //       duration: 2000
      //     })
      //   }
      // })
    var data = {"latitude":that.data.latitude,"longitude":that.data.longitude,
"title":that.data.title,"address":that.data.address}
    WashroomDatabase.onAdd(data,function(message,res){
          console.log(message)
          console.log(res)
          if (message="success"){
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          }
          else{
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', res)
          }
        })
    // } else {
    //   wx.showModal({
    //     title: "请填写反馈信息",
    //     content: '看什么看，赶快填反馈信息，削你啊',
    //     confirmText: "我我我填",
    //     cancelText: "劳资不填",
    //     success: (res) => {
    //       if (res.confirm) {
    //         // 继续填
    //       } else {
    //         console.log("back")
    //         wx.navigateBack({
    //           delta: 1 // 回退前 delta(默认为1) 页面
    //         })
    //       }
    //     }
    //   })
    // }

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
        new AV.File('pictrue', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
        ).catch(console.error);
      }
    })
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