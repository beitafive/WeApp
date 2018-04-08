var app = getApp();
Page({
  data:{
    rel_num:0,
  },
  onLoad:function(){
    this.getNum();
  },
  getNum(){
    var that = this;
    app.globalFun.http('user/my',{},(res)=>{
      if(res.code == 0){
        that.setData({
          rel_num:res.data.carpoolCount
        })
      }
    },'get')
  }
})