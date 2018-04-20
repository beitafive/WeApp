var app = getApp();
var common = require('../../../api/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    info:{},
    select:1,
    loading:true,
    nothing:false,
    pageIndex:0,
    collectList:[],
    commentList:[],
    likeList:[],
    inputFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getInfo();
    this.getComment();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  goPhoto(){ 
    wx.reLaunch({
      url: '/pages/photography/myphoto/myphoto?id='+this.data.info.userId+'&ismine='+this.data.info.isMine,
    })
  },
  //获取摄影信息
  getInfo(){
    app.globalFun.http('photography/topic',{id:this.data.id},(res)=>{
      if(res.code == 0){
        res.data.photographyTopic.images = JSON.parse(res.data.photographyTopic.images)
        res.data.photographyTopic.imgs = [];
        res.data.photographyTopic.userLogo = common.getImgUrl(res.data.photographyTopic.userLogo);
        res.data.photographyTopic.images.map((i, n) => {
          res.data.photographyTopic.images[n] = 'http://img.zhudou.cn/guli/photography' + i;
          res.data.photographyTopic.imgs.push('http://img.zhudou.cn/guli/photography' + i.replace('.','_120x120.'))
        })
        res.data.photographyTopic.createTime = common.getOneDay(res.data.photographyTopic.createTime)
        this.setData({
          info: res.data.photographyTopic
        })
      }
    },'get')
  },
  //获取收藏列表
  getCollect(){
    this.setData({
      loading: true
    })
    app.globalFun.http('photography/collect/pages', { topicId: this.data.id, page: this.data.pageIndex }, (res) => {
      if (res.code == 0) {
        res.data.pages.content.map((i, n) => {
          res.data.pages.content[n].userLogo = common.getImgUrl(i.userLogo)
        })
        this.setData({
          collectList: this.data.collectList.concat(res.data.pages.content),
          nothing: res.data.pages.last
        })
      }
      this.setData({
        loading: false
      })
    }, 'get')
  },
  //获取评论列表
  getComment(){
    this.setData({
      loading: true
    })
    app.globalFun.http('photography/comment/topic/pages', { topicId: this.data.id, page:this.data.pageIndex}, (res) => {
      if (res.code == 0) {
        res.data.pages.content.map((i,n)=>{
          res.data.pages.content[n].createTime = common.getOneDay(i.createTime)
          res.data.pages.content[n].userLogo = common.getImgUrl(i.userLogo)
        })
        this.setData({
          commentList:this.data.commentList.concat(res.data.pages.content),
          nothing:res.data.pages.last
        })
      }
      this.setData({
        loading: false
      })
    }, 'get')
  },
  //获取赞列表
  getLike(){
    this.setData({
      loading:true
    })
    app.globalFun.http('photography/like/topic/pages', { topicId: this.data.id, page: this.data.pageIndex }, (res) => {
      if (res.code == 0) {
        res.data.pages.content.map((i, n) => {
          res.data.pages.content[n].userLogo = common.getImgUrl(i.userLogo)
        })
        this.setData({
          likeList: this.data.likeList.concat(res.data.pages.content),
          nothing: res.data.pages.last
        })
      }
      this.setData({
        loading: false
      })
    }, 'get')
  },
  //切换列表
  changeList(e){
    if (this.data.select == e.currentTarget.dataset.index){
      return null;
    }
    this.setData({
      select: e.currentTarget.dataset.index,
      pageIndex:0,
      collectList:[],
      commentList:[],
      likeList:[]
    })
    if(this.data.select == 0){
      this.getCollect()
    } else if (this.data.select == 1){
      this.getComment();
    }else{
      this.getLike();
    }
  },
  //显示输入框
  showInput(){
    this.setData({
      inputFocus:true
    })
  },
  //隐藏输入框
  hideInput(){
    this.setData({
      inputFocus: false
    })
  },
  //发送评论
  confirmComment(e){
    app.globalFun.http('photography/comment/topic', { topicId: this.data.id, content:e.detail.value }, (res) => {
      if (res.code == 0) {
        this.setData({
          pageIndex:0,
          commentList:[]
        })
        this.getComment();
        this.getInfo();
      }
    })
  },
  //收藏
  collect(e) {
    app.globalFun.http('photography/collect', { type: this.data.info.isCollect, topicId: this.data.id }, (res) => {
      if (res.code == 0) {
        this.getInfo()
      } else {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //点赞
  like(e) {
    app.globalFun.http('photography/like/topic', { type: this.data.info.isLike, topicId: this.data.id }, (res) => {
      if (res.code == 0) {
        this.getInfo()
      } else {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //预览
  showImg(e) {
    wx.previewImage({
      current: e.target.dataset.item, // 当前显示图片的http链接
      urls: e.target.dataset.arr // 需要预览的图片http链接列表
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
    if(this.data.nothing){return null}
    this.setData({
      pageIndex: this.data.pageIndex+1
    })
    if (this.data.select == 0) {
      this.getCollect()
    } else if (this.data.select == 1) {
      this.getComment();
    } else {
      this.getLike();
    }
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