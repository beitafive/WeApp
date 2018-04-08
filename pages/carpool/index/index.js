//index.js
//获取应用实例
var common = require("../../../api/common.js")
var app = getApp()
//引入util模块
Page({
  data: {
    allShow:false,
    bannerList:[],    //banner数据
    searchType: [{ value: '', label: '全部', color: '#51C882', className: 'icon-quanbu' }, { value: 0, label: '车找人', color: '#45b5ff', className: 'icon-geren6' }, { value: 1, label: '人找车', color: '#f90', className: 'icon-chexiandingdan' }, { value: 2, label: '车找货', color: '#AE83F8', className: 'icon-huoche01' }, { value: 3, label: '货找车', color: '#FF6F73', className: 'icon-huowu' }],
    type:'',
    nowPlace:'',       //现在选择的地点
    startPlace:'',     //出发地
    endPlace:'',       //目的地
    placeList: [],     //热门城市列表
    timeType: 'createTime',   //时间类型  (startTime=出发时间[默认] createTime=发布时间)
    tableData:[],      //列表数据
    pageIndex:0,       //当前页数
    loading:false,     //加载中
    nothing:false,
    isTipShow:false,
    scrollTop:0,
    showTop:false,
    height:'600px',
    route:''
  },
  onLoad: function () {
    var that = this;
    if (wx.getStorageSync('head')) {
      that.getBanner();
      that.getIndexList();
      that.setData({
        allShow: true,
        route: getCurrentPages().pop().route
      })
    } else {
      app.getSetting().then((res) => {
        app.wxLogin(res).then(() => {
          that.getBanner();
          that.getIndexList();
          that.setData({
            allShow: true
          })
        })
      })
    }
  },
  onReady: function () {
    var that = this;
    this.setData({
      height: app.globalData.height + 'px'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '阳春拼车',
      desc: '快来和我一起拼车吧！',
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
  //交换
  exchange(){
    this.setData({
      startPlace:this.data.endPlace,
      endPlace:this.data.startPlace
    })
  },
  navTap(e){
    if (this.data.route.includes(e.currentTarget.dataset.route)){
      return;
    }
    wx.navigateTo({
      url: '/pages/carpool/' + e.currentTarget.dataset.route + '/' + e.currentTarget.dataset.route
    })
  },
  viewScroll(e){
    if(e.detail.scrollTop>=200){
      this.setData({
        showTop:true
      })
    }else{
      this.setData({
        showTop: false
      })
    }
  },
  goTop(){
    this.setData({
      scrollTop:0
    })
  },
  showCover(){
    this.setData({
      isTipShow: true
    })
  },
  hiddenCover(){
    this.setData({
      isTipShow:false
    })
  },
  //数据绑定处理 - 出发地
  getGo(e){
    this.setData({
      startPlace:e.detail.value
    })
  },
  //数据绑定处理 - 目的地
  getEnd(e){
    this.setData({
      endPlace: e.detail.value
    })
  },
  //改变 类型 
  tapType(e){
    this.setData({
      pageIndex:0,
      tableData:[],
      startPlace:'',
      endPlace:'',
      nothing:false,
      type: e.currentTarget.dataset.value,
      nowPlace:''
    })
    this.getIndexList();
  },
  //改变 地点
  changePlace(e){
    this.setData({
      pageIndex:0,
      tableData:[],
      startPlace: '',
      endPlace: '',
      nothing: false,
      nowPlace: e.target.dataset.name
    })
    this.getIndexList();
  },
  //搜索
  search(){
    this.setData({
      pageIndex: 0,
      tableData: [],
      nothing: false
    })
    this.getIndexList();
  },
  //改变  时间 类型
  changeTime(){
    var types = this.data.timeType == 'startTime' ?'createTime':'startTime';
    this.setData({
      tableData:[],
      pageIndex:0,
      timeType:types
    })
    this.getIndexList();
  },
  //上拉加载
  loadMore(){
    if(this.data.pageIndex == (this.data.maxIndex-1)){
      this.setData({
        nothing: true
      })
      return null;
    }
    this.setData({
      loading:true,
      pageIndex: this.data.pageIndex+1
    })
    this.getIndexList();
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  callUser(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  swiperTo:(event)=>{
    // wx.navigateTo({
    //   url:'../logs/logs?id='+event.target.dataset.item.name
    // })
  },
  
  //获取banner
  getBanner(){
    var that = this;
    app.globalFun.http('advert/list', { direction:'asc'}, (res) => {
      if(res.code == 0){
        for (var i = 0; i < res.data.advertList.length; i++) {
          res.data.advertList[i].imageUrl = 'http://img.zhudou.cn/guli/carpool' + res.data.advertList[i].imageUrl
        }
        that.setData({
          bannerList: res.data.advertList
        })
      }else{
        console.log(res)
      }
    }, 'get')
  },
  //获取首页 拼车列表
  getIndexList(){
    var that = this;
    app.globalFun.http('carpool/pages', { type: that.data.type, page: that.data.pageIndex, startPlace: that.data.startPlace, endPlace: that.data.endPlace, hotPlace: that.data.nowPlace, property: that.data.timeType}, (res) => {
      if(res.code == 0){
        res.data.pages.content.map((item)=>{
          var obj = common.getunit(item.type);
          var dateObj = common.getWeek(item.startTime);
          item.quantity = item.quantity + obj.unit;
          item.typeName = obj.type;
          item.isGo = common.timeLose(item.startTime);
          item.startDate = dateObj.date;
          item.startHour = dateObj.time;
          item.createTime = common.getOneHour(item.createTime);
          item.color = obj.color;
        })
        that.setData({
          placeList: res.data.hotPlaceList,
          tableData: that.data.tableData.concat(res.data.pages.content),
          loading: false,
          maxIndex: res.data.pages.totalPages
        })
        
        if(res.data.pages.content.length == 0){
          that.setData({
            nothing:true
          })
        }
      }
    }, 'get')
  }
})
