var app = getApp();
var common = require('../../../api/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    navList: [{ title: '摄影', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/photography-00.png', route: '/pages/photography/photo/photo' }, { title: '发布', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/publish-00.png', route: '/pages/photography/publish/publish' }, { title: '我的', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/mine-00.png', route: '/pages/photography/myphoto/myphoto' }, { title: '主页', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/zhuye-00.png', route: '/pages/home/home' }],
    list:[],
    pageIndex:0,
    nothing:false,
    loading:true,
    ismine:1,
    type:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type == 1 ? '粉丝' : '关注'
    })
    this.setData({
      ismine:options.ismine,
      type:options.type,
      id:options.id
    })
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  //导航跳转
  navTap(e) {
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
  //获取列表
  getList(){
    this.setData({
      loading:true
    })
    let url = '';
    let obj = new Object();
    obj.page = this.data.pageIndex;
    if(this.data.ismine == 1){
      url = this.data.type == 1 ? 'user/follow/myfollowed/pages' : 'user/follow/myfollow/pages';
    }else{
      obj.taUserId = this.data.id;
      url = this.data.type == 1 ? 'user/follow/tafollowed/pages' : 'user/follow/tafollow/pages';
    }
    app.globalFun.http(url,obj,(res)=>{
      if(res.code == 0){
        res.data.pages.content.map((item)=>{
          item.userLogo = common.getImgUrl(item.userLogo);
          if(this.data.ismine==1){
            if(this.data.type==1){
              item.eachOther = item.eachOther == 0 ? 3 : 1
            }else{
              item.eachOther = item.eachOther == 0 ? 2 : 1
            }
          }
          if(item.isMine==1){
            item.eachOther = 10;
          }
        })
        this.setData({
          list:this.data.list.concat(res.data.pages.content)
        })
        this.setData({
          nothing:res.data.pages.last
        })
      }
      this.setData({
        loading: false
      })
    },'get')
  },
  //关注或者取消关注
  eachThis(e){
    let obj = new Object();
    obj.taUserId = e.currentTarget.dataset.item.userId;
    if (e.currentTarget.dataset.item.eachOther == 0 || e.currentTarget.dataset.item.eachOther == 3){
      obj.type = 0
    }else{
      obj.type = 1
    }
    app.globalFun.http('user/follow',obj,(res)=>{
      if(res.code == 0){
        if (e.currentTarget.dataset.item.eachOther == 0) {
          this.data.list[e.currentTarget.dataset.index].eachOther = 2;
        }
        if (e.currentTarget.dataset.item.eachOther == 1) {
          this.data.list[e.currentTarget.dataset.index].eachOther = 3
        }
        if (e.currentTarget.dataset.item.eachOther == 2) {
          this.data.list[e.currentTarget.dataset.index].eachOther = 0
        }
        if (e.currentTarget.dataset.item.eachOther == 3) {
          this.data.list[e.currentTarget.dataset.index].eachOther = 1
        }
        this.setData({
          list:this.data.list
        })
      }
    })
  },
  //去摄影页面
  goPhoto(e){
    let ismine = e.currentTarget.dataset.item.isMine || 0
    wx.redirectTo({
      url: '/pages/photography/myphoto/myphoto?id=' + e.currentTarget.dataset.item.userId + '&ismine=' + ismine
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
    if (!this.data.nothing) {
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