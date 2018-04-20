var app = getApp();
var common = require('../../../api/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    ismine: 1,
    navList: [{ title: '摄影', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/photography-00.png', route: '/pages/photography/photo/photo' }, { title: '发布', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/publish-00.png', route: '/pages/photography/publish/publish' }, { title: '我的', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/mine-01.png', route: '/pages/photography/myphoto/myphoto' }, { title: '主页', img: 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/zhuye-00.png', route: '/pages/home/home' }],
    route: '',
    info: {},
    pageInfo: 0,
    list: [],
    loading: true,
    nothing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.navList[2].img = options.ismine == 0 ? 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/mine-00.png' : 'http://img.zhudou.cn/guli/photography/icon/menu/bottom/mine-01.png'
    this.setData({
      id: options.id || '',
      ismine: options.ismine || 1,
      route: getCurrentPages().pop().route,
      navList: this.data.navList
    })
    wx.setNavigationBarTitle({
      title: options.ismine == 0 ? 'TA的摄影' : '我的摄影'
    })
    console.log(options)
    this.getList(options.ismine)
  },
  //关注或者取消关注
  watchThis() {
    app.globalFun.http('user/follow', { type: this.data.info.isFollow, taUserId: this.data.info.id }, (res) => {
      if (res.code == 0) {
        this.setData({
          pageInfo: 0,
          list: [],
        })
        this.getList();
      }
    })
  },
  //去编辑资料页面
  gomyinfo() {
    if (this.data.ismine == 0) {
      return null;
    }
    wx.navigateTo({
      url: '/pages/photography/myinfo/myinfo',
    })
  },

  //获取列表
  getList(type) {
    this.setData({
      loading: true
    })
    let url = type == 0 ? 'photography/topic/ta/pages' : 'photography/topic/my/pages';
    let obj = new Object();
    obj.page = this.data.pageInfo;
    if (this.data.ismine == 0) {
      obj.userId = this.data.id
    }
    app.globalFun.http(url, obj, (res) => {
      if (res.code == 0) {
        res.data.pages.content.map((item) => {
          item.imgs = [];
          item.userLogo = common.getImgUrl(item.userLogo)
          item.images = JSON.parse(item.images)
          item.createTime = common.getOneDay(item.createTime)
          item.images.map((i, n) => {
            item.images[n] = 'http://img.zhudou.cn/guli/photography' + i;
            item.imgs.push('http://img.zhudou.cn/guli/photography' + i.replace('.', '_120x120.'));
          })
        })
        res.data.user.logo = common.getImgUrl(res.data.user.logo)
        this.setData({
          list: this.data.list.concat(res.data.pages.content),
          nothing: res.data.pages.last,
          info: res.data.user
        })
      }
      this.setData({
        loading: false
      })
    }, 'get')
  },  //去详情
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/photography/main/main?id=' + e.currentTarget.dataset.id
    })
  },
  //预览
  showImg(e) {
    wx.previewImage({
      current: e.target.dataset.item, // 当前显示图片的http链接
      urls: e.target.dataset.arr // 需要预览的图片http链接列表
    })
  },
  //收藏
  collect(e) {
    app.globalFun.http('photography/collect', { type: e.currentTarget.dataset.item.isCollect, topicId: e.currentTarget.dataset.item.id }, (res) => {
      if (res.code == 0) {
        let arr = this.data.list;
        arr[e.currentTarget.dataset.index].isCollect = e.currentTarget.dataset.item.isCollect == 0 ? 1 : 0;
        if (e.currentTarget.dataset.item.isCollect == 0) {
          arr[e.currentTarget.dataset.index].collectNum += 1;
        } else {
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
  like(e) {
    app.globalFun.http('photography/like/topic', { type: e.currentTarget.dataset.item.isLike, topicId: e.currentTarget.dataset.item.id }, (res) => {
      if (res.code == 0) {
        let arr = this.data.list;
        arr[e.currentTarget.dataset.index].isLike = e.currentTarget.dataset.item.isLike == 0 ? 1 : 0;
        if (e.currentTarget.dataset.item.isLike == 0) {
          arr[e.currentTarget.dataset.index].likeNum += 1;
        } else {
          arr[e.currentTarget.dataset.index].likeNum -= 1;
        }
        // console.log(arr)
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
  //导航跳转
  navTap(e) {
    if (e.currentTarget.dataset.route.includes(this.data.route) && this.data.ismine == 1) {
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getList();
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
      this.getList(this.data.ismine);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})