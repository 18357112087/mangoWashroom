// pages/wallet/index.js
const AV = require('../../utils/av-weapp-min.js'); 
AV.init({
  appId: 'W2FdWmVqCtFwcQqwrcVO4f7b-gzGzoHsz',
  appKey: 'XANfrIaQ2VfrkXlvf4dXAMOf'
  // appID: 'wxc6be225939b7321d',
  // appKey: '12e92fc56b2d4d4010b069e47b74869b'
})
const AVLeanCloud = require('../../utils/av-weapp-min.js');
var app = getApp();
Page({
  data:{
    washroomId:"",
    commentText:"",
    starDesc: '非常满意，无可挑剔',
    stars: [{
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '不满意，比较差'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '一般，还要改善'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '比较满意，仍要改善'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '非常满意，无可挑剔'
    }],
    title:"未赋值",
    address:"未赋值",
    // 故障车周围环境图路径数组
    picUrls: [],
    current_item: 0,
    // 故障车编号和备注
    inputValue: {
      num: 0,
      desc: ""
    },
    // 故障类型数组
    checkboxValue: [],
    // 选取图片提示
    actionText: "拍照/相册",
    // 提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "",
    tagBgc:"",
    tagList:[],
    rate:4,
    // 评论tag的value，此处预定义，然后循环渲染到页面
    assessLists: [{comment: '环境好', isSelected: false }, { comment: '干净', isSelected: false }, { comment: '蹲坑', isSelected: false }, { comment: '厕纸充足', isSelected: false }, { comment: '位置很好', isSelected: false }, { comment: '不拥挤', isSelected: false }, { comment: '空气清新', isSelected: false }, { comment: '坐便器', isSelected: false }],
  },
  pressedTheButton:function(e){
    console.log(e.target.dataset)
  },
  changColor: function (e){
    var index = e.target.dataset.index;
    var idxA = `assessLists[${index}].isSelected`;//关键代码操作，将数组对象某个属性拼接成字符串
    var tag = this.data.assessLists[index].comment
    let tfps = this.data.assessLists;
    let _tagList = this.data.tagList;
    for (let item of tfps){
      if(item.isSelected==true){
      _tagList.push(item.comment);}
      this.setData({
        tagList: _tagList
      });
    };
    this.setData({
      key: e.target.dataset.index,  
      [idxA]: true,
 
    })
  },
 
  // 选择评价星星
  starClick: function (e) {
    console.log(e.target)
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 2
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 1
      })
    }
    console.log(index)
    this.setData({
      starDesc: this.data.stars[index].message,
      rate:index
    })
  },
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '添加评论'
    })
    console.log(app.currentMarker)
    //从全局数据中获取当前用户选择的厕所
    this.setData({
      washroomId:app.currentMarker.id,
      title: app.currentMarker.title,
      address:app.currentMarker.address
    })
  },
// 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function(e){
    let _values = e.detail.value;
    if(_values.length == 0){
      this.setData({
        btnBgc: ""
      })
    }else{
      this.setData({
        checkboxValue: _values,
        btnBgc: "#b9dd08"
      })
    }   
  },
// 输入单车编号，存入inputValue
  numberChange: function(e){
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
// 输入备注，存入inputValue
  descChange: function(e){
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },
  bindUserCommentInput: function (e) {
    console.log(e)
    this.setData({
      commentText: e.detail.value
    })

  },
// 提交到服务器
  formSubmit: function(e){
    // 声明类型
    var Comment = AV.Object.extend('Comment');
    // 新建对象
    var comment = new Comment();
    // 设置数据内容
    // washroom.set('title', app.currentMarker.title);
    // washroom.set('address', app.currentMarker.address);
    
    // washroom.set('coordinate', new AV.GeoPoint(app.currentMarker.latitude, app.currentMarker.longitude));
    console.log(app.user)
    console.log(this.data.user)
    comment.set('user',this.data.user)
    comment.set('washroomId', this.data.washroomId)
    // 故障车周围环境图路径数组
    comment.set('picUrls', this.data.picUrls); 
    // 设置优先级
    comment.set('tag',this.data.tagList)
    comment.set('rate', this.data.rate)
    console.log(this.data.commentText)
    comment.set('commentText', this.data.commentText)
    comment.set('user',app.user)
    
    comment.save().then(function (res) {
      console.log('objectId is ' + res.id);
    }, function (error) {
      console.error(error);
    });

    // var Washroom = new AVLeanCloud.Object.extend('Washroom')
    // var washroom = Washroom();
    // // 设置名称
    // washroom.set('name', '工作');
    // // 设置优先级
    
    // todoFolder.save().then(function (res) {
    //   console.log('objectId is ' + res.id);
    // }, function (error) {
    //   console.error(error);
    // });


    // if(this.data.picUrls.length > 0 && this.data.checkboxValue.length> 0){
    //   wx.request({
    //     url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/msg',
    //     data: {
    //       // picUrls: this.data.picUrls,
    //       // inputValue: this.data.inputValue,
    //       // checkboxValue: this.data.checkboxValue
    //     },
    //     method: 'get', // POST
    //     // header: {}, // 设置请求的 header
    //     success: function(res){
    //       wx.showToast({
    //         title: res.data.data.msg,
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     }
    //   })
    // }else{
    //   wx.showModal({
    //     title: "请填写反馈信息",
    //     content: '看什么看，赶快填反馈信息，削你啊',
    //     confirmText: "我我我填",
    //     cancelText: "劳资不填",
    //     success: (res) => {
    //       if(res.confirm){
    //         // 继续填
    //       }else{
    //         console.log("back")
    //         wx.navigateBack({
    //           delta: 1 // 回退前 delta(默认为1) 页面
    //         })
    //       }
    //     }
    //   })
    // }
    
  },
  
// 选择周围环境图 拍照或选择相册
  bindCamera: function(){
    wx.chooseImage({
      count: 4, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        let tfps = res.tempFilePaths;
        let _picUrls = this.data.picUrls;
        for(let item of tfps){
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
  delPic: function(e){
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index,1);
    this.setData({
      picUrls: _picUrls
    })
  }
})