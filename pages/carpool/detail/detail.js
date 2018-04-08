var app = getApp();
var common = require("../../../api/common.js")
Page({
  data:{
    types:'',
    start:'',
    end:'',
    num:0,
    createDate:'',
    startTime:'',
    path:'',
    count:0,
    phone:'',
    id:'',
    isMe:0,
    timelose:false
  },
  onShareAppMessage: function () {
    return {
      title: '阳春拼车',
      desc:'快来和我一起拼车吧！',
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
  onLoad:function(options){
    this.setData({
      id:options.id
    })
    this.getInfo(options)
  },
  goedit(){
    var that = this;
    wx.navigateTo({
        url: '/pages/carpool/issue/issue?id='+this.data.id,
      })
  },
  callUser() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  // goRouter(){
  //   var that = this;
  //   if(this.data.isMe == 0){
  //     wx.showToast({
  //       title:'这不是您发布的，无法编辑！',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //   }else{
  //     wx.navigateTo({
  //       url: '/pages/carpool/issue/issue?id='+that.data.id,
  //     })
  //   }
  // },
  getInfo(options){
    var that = this;
    app.globalFun.http('carpool', { id: options.id},(res)=>{
      if(res.code == 0){
        var obj = common.getunit(res.data.carpool.type)
        var date = common.getWeek(res.data.carpool.startTime)
        var isGo = common.timeLose(res.data.carpool.startTime)
        that.setData({
          color:obj.color,
          types: obj.type,
          start:res.data.carpool.startPlace,
          end:res.data.carpool.endPlace,
          createDate:res.data.carpool.createTime.toString().slice(0,10),
          num: res.data.carpool.browseNumber,
          startTime: date.date + date.time,
          path:res.data.carpool.passPlace,
          unit:obj.unit,
          count: res.data.carpool.quantity,
          phone: res.data.carpool.phone,
          desc: res.data.carpool.description,
          isMe:res.data.isMine,
          timelose:isGo
        })
      }
    },'get')
  }
})