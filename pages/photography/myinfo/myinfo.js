var app = getApp();
var common = require("../../../api/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    num:50,
    type:1,
    cover:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  nickInput(e){
    this.data.info.nickName = e.detail.value;
    this.setData({
      info: this.data.info
    })
  },
  //输入框
  textInput(e){
    this.data.info.introductionPhotography = e.detail.value;
    let num = 0;
    num = 50 - e.detail.value.length;
    this.setData({
      info:this.data.info,
      num:num
    })
  },
  //获取我的信息
  getInfo() {
    app.globalFun.http('user/info', {}, (res) => {
      if (res.code == 0) {
        res.data.user.logos = common.getImgUrl(res.data.user.logo)
        if (!res.data.user.introductionPhotography){
          res.data.user.introductionPhotography = '';
        }
        this.setData({
          info: res.data.user
        })
      }
    }, 'get')
  },
  changeHead(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(res)
        wx.uploadFile({
          url: 'https://guli.zhudou.cn/file/upload',
          filePath: tempFilePaths[0],
          name: 'image',
          header: { 'content-Type': 'multipart/form-data', 'Authorization': wx.getStorageSync('head') },
          formData: {
            'type':'0',
            'oldPath': that.data.info.logo.startsWith('http') ?'':that.data.info.logo
          },
          success: function (res) {
            let obj = JSON.parse(res.data)
            that.submitHead(obj)
          }
        })
      }
    })
  },
  //更换头像
  submitHead(res){
    app.globalFun.http('user/update/logo', { logo: res.data.imageUrl},(res)=>{
      if(res.code == 0){
        wx.showToast({
          title: '更换成功',
          icon:'success',
          duration:1500
        })
        this.getInfo();
      }
    },'post')
  },
  //显示输入框
  showCover(e){
    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.type == 1?'昵称':'简介'
    })
    let num = 50 - this.data.info.introductionPhotography.length;
    this.setData({
      type: e.currentTarget.dataset.type,
      cover:true,
      num:num
    })
  },
  //提交 资料
  submitForm(){
    let url = this.data.type == 1 ? 'user/update/nickname' :'user/update/introduction/photography';
    let obj = new Object();
    if(this.data.type == 1){
      obj.nickName = this.data.info.nickName
    }else{
      obj.introductionPhotography = this.data.info.introductionPhotography
    }
    app.globalFun.http(url,obj,(res)=>{
      if(res.code == 0){
        wx.showToast({
          title: '成功',
          icon:'success',
          duration: 1500
        })
        wx.setNavigationBarTitle({
          title:'编辑资料'
        })
        this.getInfo();
        this.setData({
          cover:false
        })
      }else{
        wx.showToast({
          title: '失败',
          duration: 1500
        })
      }
    })
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
    
  }
})