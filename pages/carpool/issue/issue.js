
var app = getApp()
Page({
  data:{
    id:'',
    isEdit:false,
    checkArr:['短期拼车','长期拼车'],
    checkIndex:0,
    typeArr:['车找人','人找车','车找货','货找车'],
    index:0,
    start:'',   //出发地
    end:'',     //目的地
    path:'',     //途径
    date:'',      //出发日期
    time:'',      //出发时间
    phone:'',     //手机号
    num:'',       //数量
    unit1:'空位',
    unit2:'空位',
    more:'',      //更多描述
    isTipShow:false,
    height:'600px'
  },
  onLoad:function(options){
    var that = this;
    var now = new Date();
    var sDate = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    var nTime = now.getHours() +':'+ now.getMinutes();
    this.setData({
      date:sDate,
      time:nTime,
      id:options.id || ''
    })
    if (options.id) {
      this.setData({
        isEdit:true
      })
      app.globalFun.http('carpool', { id: options.id }, (res) => {
        if (res.code == 0) {
          that.changeType({detail:{value:res.data.carpool.type}})
          that.setData({
            start: res.data.carpool.startPlace,
            end: res.data.carpool.endPlace,
            path:res.data.carpool.passPlace,
            date: res.data.carpool.startTime.toString().slice(0, 10),
            time: res.data.carpool.startTime.toString().slice(11, 16),
            phone: res.data.carpool.phone,
            num: res.data.carpool.quantity,
            more: res.data.carpool.description
         })
        }
      }, 'get')
    }
  },
  onReady: function () {
    var that = this;
    this.setData({
      height: app.globalData.height + 'px'
    })
  },
  showCover() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({
      isTipShow:true
    })
  },
  hiddenCover() {
    this.setData({
      isTipShow: false
    })
  },
  // 长短期 切换
  checkItem(e){
    if(this.data.checkIndex == e.target.dataset.index) return;
    this.setData({
      checkIndex: e.target.dataset.index
    })
  },
  //切换类型
  changeType(e){
    let obj = new Object();
    if(e.detail.value == 0){
      obj.unit1 = '空位';
      obj.unit2 = '空位';
    } else if (e.detail.value == 1){
      obj.unit1 = '人数';
      obj.unit2 = '人';
    } else if (e.detail.value == 2) {
      obj.unit1 = '车数';
      obj.unit2 = '辆';
    } else if (e.detail.value == 3) {
      obj.unit1 = '货物';
      obj.unit2 = '吨';
    }
    this.setData({
      index: e.detail.value,
      unit1:obj.unit1,
      unit2:obj.unit2
    })
  },
  //input 出发地
  startInput(e){
    this.setData({
      start:e.detail.value
    })
  },
  //input 目的地
  endInput(e){
    this.setData({
      end:e.detail.value
    })
  },
  //input 途径地
  pathInput(e){
    this.setData({
      path:e.detail.value
    })
  },
  bindDateChange(e){
    this.setData({
      date:e.detail.value
    })
  },
  bindTimeChange(e){
    this.setData({
      time: e.detail.value
    })
  },
  //input 手机号
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //input 数量
  numInput(e) {
    this.setData({
      num: e.detail.value
    })
  },
  //input 数量
  moreInput(e) {
    this.setData({
      more: e.detail.value
    })
  },
  submit(){
    var that = this;
    if(that.data.start==''||that.data.end==''||that.data.num==''){
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(that.data.phone))){
      wx.showToast({
        title: '手机号格式错误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    app.globalFun.http('carpool/edit', {id:that.data.id || '', effectiveTerm: that.data.checkIndex, type: that.data.index, phone: that.data.phone, startPlace: that.data.start, endPlace: that.data.end, passPlace: that.data.path, startTime: that.data.date + ' ' + that.data.time + ':00', quantity: that.data.num,description:that.data.more}, (res) => {
      if (res.code == 0) {
        wx.showToast({
          title: that.data.isEdit?'保存成功！':'信息发布成功！',
          icon: 'success',
          duration: 1000
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/carpool/index/index'
          })
        },1000)
      } else {
        console.log(res)
      }
    },'post')
  }
})