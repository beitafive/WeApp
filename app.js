//app.js
var http = require('./api/http.js')
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success:(res)=>{
        this.globalData.height = res.windowHeight
      }
    })
  },
  getSetting(){
    var that = this;
    return new Promise(function (resolve, reject){
      var that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                resolve(res);
              }
            })
          }else{
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                resolve(res);
              }
            })
          }
        }
      })
    })
  },
  wxLogin(params) {
    var that = this;
    return new Promise(function(resolve, reject){
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: 'https://guli.zhudou.cn/weixin/applet/get3rdsession',
              data: {
                code: res.code
              },
              success: function (r) {
                http.returnReq("weixin/applet/userinfo", { sessionId: r.data.data.thirdSession, encryptedData: params.encryptedData, iv: params.iv }, (request) => {
                  if (request.code == 0) {
                    wx.setStorageSync('head', request.data.jwtToken)
                    resolve(r);
                  }else{
                    wx.removeStorageSync('head')
                    wx.redirectTo({
                      url: '/pages/carpool/index/index'
                    })
                  }
                }, 'post')
              }
            })
          }
        }
      })
    })
  },
  globalData: {
    height:'',
    userInfo: null,  //wx返回的用户信息
    banner_list:[]
  },
  globalFun: {
    http: http.returnReq    //封装好的http请求方法
  }
})