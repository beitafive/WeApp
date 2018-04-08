var app = getApp();

Page({
  data:{
    list:[],
    maxIndex:'',
    pageIndex:0,
    loading:false,
    nothing:false,
    height: '600px',
    route:''
  },
  onShareAppMessage: function () {
    return {
      title: '快来和我一起拼车吧！',
      path: '/pages/carpool/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功！',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad:function(){
    this.getList();
    this.setData({
      route: getCurrentPages().pop().route
    })
  },
  onReady: function () {
    var that = this;
    this.setData({
      height: app.globalData.height + 'px'
    })
  },
  navTap(e) {
    if (this.data.route.includes(e.currentTarget.dataset.route)) {
      return;
    }
    wx.navigateTo({
      url: '/pages/carpool/' + e.currentTarget.dataset.route + '/' + e.currentTarget.dataset.route
    })
  },
  //上拉加载
  loadMore() {
    if (this.data.pageIndex == (this.data.maxIndex - 1)) {
      this.setData({
        nothing: true
      })
      return null;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getList();
  },
  //获取列表
  getList(){
    var that = this;
    this.setData({
      loading: true
    })
    app.globalFun.http('carpool/my/pages',{page:that.data.pageIndex},(res)=>{
      if(res.code == 0){
        res.data.pages.content.map((item,index)=>{
          item.date = item.startTime.toString().slice(0, 10)
        })
        if(res.data.pages.last){
          that.setData({
            nothing:true
          })
        }
        that.setData({
          list:that.data.list.concat(res.data.pages.content),
          maxIndex: res.data.pages.totalPages,
          loading:false
        })
      }else{

      }
    },'get')
  },
  deleteItem(e){
    var that = this;
    var ids = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该信息？',
      success: function (res) {
        if (res.confirm) {
          app.globalFun.http('carpool/delete',{id:ids},(res)=>{
            if(res.code == 0){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              })
              that.setData({
                pageIndex:0,
                list:[]
              })
              that.getList();
            }
          },'get')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})