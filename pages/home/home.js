var app = getApp();

Page({
  data:{

  },
  onLoad:function(){
    if (!wx.getStorageSync('head')){
      app.getSetting().then((res) => {
        app.wxLogin(res).then(() => {
          
        })
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '鲜活阳春',
      desc: '',
      path: '/pages/home/home',
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
  onHide:function(){
    
  }
})