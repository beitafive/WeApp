var app = getApp();
var common = require("../../../api/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: [{ name: '推荐', index: 0 }, { name: '最新', index: 1 },{name: '关注', index: 2 }],
    typeIndex:1,
    list:[],
    pageIndex:0,
    route:'',
    navList: [{ title: '摄影', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/photography-01.png', route: '/pages/photography/photo/photo' }, { title: '发布', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/publish-00.png', route: '/pages/photography/publish/publish' }, { title: '我的', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/mine-00.png', route: '/pages/photography/myphoto/myphoto' }, { title: '主页', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/zhuye-00.png', route: '/pages/home/home' }],
    nothing:false,
    navPos:false,
    startX:0,
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.setData({
      route: getCurrentPages().pop().route
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  goPhoto(e){
    wx.navigateTo({
      url: '/pages/photography/myphoto/myphoto?id=' + e.currentTarget.dataset.id + '&ismine=' + e.currentTarget.dataset.ismine
    })
  },
  navTap(e) {
    if (e.currentTarget.dataset.route.includes(this.data.route)) {
      return;
    }
    if (e.currentTarget.dataset.route.includes('publish')) {
      wx.navigateTo({
        url: e.currentTarget.dataset.route
      })
    } else {
      wx.redirectTo({
        url: e.currentTarget.dataset.route
      })
    }
  },
  changeType(e){
    this.setData({
      typeIndex: e.currentTarget.dataset.index,
      pageIndex:0,
      list:[]
    })
    this.getList();
  },
  //获取列表
  getList(){
    var that = this;
    this.setData({
      loading:true
    })
    app.globalFun.http('photography/topic/pages', { type: this.data.typeIndex, page: this.data.pageIndex},(res)=>{
      if(res.code==0){
        res.data.pages.content.map((item)=>{
          item.imgs = [];
          item.userLogo = common.getImgUrl(item.userLogo)
          item.images = JSON.parse(item.images)
          item.createTime = common.getOneDay(item.createTime)
          item.images.map((i,n)=>{
            item.images[n] = 'http://img.zhudou.cn/guli/photography'+i;
            item.imgs.push('http://img.zhudou.cn/guli/photography' + i.replace('.', '_120x120.'));
          })
        })
        that.setData({
          list: that.data.list.concat(res.data.pages.content)
        })
        this.setData({
          loading: false
        })
        if (res.data.pages.last) {
          that.setData({
            nothing: true
          })
        }
      }
    },'get')
  },
  //去详情
  goDetail(e){
    wx.navigateTo({
      url: '/pages/photography/main/main?id=' + e.currentTarget.dataset.id
    })
  },
  //预览
  showImg(e){
    wx.previewImage({
      current: e.target.dataset.item, // 当前显示图片的http链接
      urls: e.target.dataset.arr // 需要预览的图片http链接列表
    })
  },
  //收藏
  collect(e){
    app.globalFun.http('photography/collect', { type: e.currentTarget.dataset.item.isCollect, topicId: e.currentTarget.dataset.item.id }, (res) => {
      if (res.code == 0) {
        let arr = this.data.list;
        arr[e.currentTarget.dataset.index].isCollect = e.currentTarget.dataset.item.isCollect == 0 ? 1 : 0;
        if (e.currentTarget.dataset.item.isCollect == 0){
          arr[e.currentTarget.dataset.index].collectNum += 1; 
        }else{
          arr[e.currentTarget.dataset.index].collectNum -= 1; 
        }
        
        this.setData({
          list: this.data.list
        })
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
  like(e){
    app.globalFun.http('photography/like/topic', { type: e.currentTarget.dataset.item.isLike, topicId: e.currentTarget.dataset.item.id }, (res) => {
      if (res.code == 0) {
        let arr = this.data.list;
        arr[e.currentTarget.dataset.index].isLike = e.currentTarget.dataset.item.isLike == 0 ? 1 : 0;
        if (e.currentTarget.dataset.item.isLike == 0) {
          arr[e.currentTarget.dataset.index].likeNum += 1;
        } else {
          arr[e.currentTarget.dataset.index].likeNum -= 1;
        }
        console.log(arr)
        this.setData({
          list: this.data.list
        })
      }else{
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //触摸开始
  startM(e){
    this.setData({
      startX: e.changedTouches[0].clientX
    })
  },
  //触摸结束
  endM(e){
    if ((this.data.startX - e.changedTouches[0].clientX) < -120){
      if(this.data.typeIndex == 0 ){return null}
      this.setData({
        typeIndex: this.data.typeIndex - 1,
        pageIndex: 0,
        list: []
      })
      this.getList();
    }
    if ((this.data.startX - e.changedTouches[0].clientX) > 120) {
      if (this.data.typeIndex == 2) { return null }
      this.setData({
        typeIndex: this.data.typeIndex + 1,
        pageIndex: 0,
        list: []
      })
      this.getList();
    }
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
  onPageScroll: function (e) {
    if(!this.data.navPos){
      this.setData({
        navPos: true
      })
    }
    
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
    setTimeout(()=>{
      this.setData({
        navPos: false
      })
    },200)
    if(!this.data.nothing){
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.getList();
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})