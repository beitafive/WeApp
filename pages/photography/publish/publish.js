var app = getApp();
Page({


  data: {
    title:'',
    upload_picture_list: [],
    imgList:[],
    labelInfo:'',
    labelList:[],
    labelIds:[],
    cover:false
  },
  onLoad:function(options){
    this.getlabel();
  },
  //数据绑定
  textInput(e){
    this.setData({
      title:e.detail.value
    })
  },
  //获取标签
  getlabel(){
    app.globalFun.http('photography/label/list',{},(res)=>{
      if(res.code == 0){
        res.data.photographyLabelSubList.map((item)=>{
          item.select = 0
        })
        this.setData({
          labelList: res.data.photographyLabelSubList
        })
      }
    },'get')
  },
  uploadpic: function (e) {

    var that = this
    var upload_picture_list = that.data.upload_picture_list;
    var uCount = 9 - that.data.upload_picture_list.length;
    wx.chooseImage({
      count: uCount, // 默认9，这里显示一次选择相册的图片数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFiles = res.tempFiles
        //循环把图片加入上传列表
        for (var i in tempFiles) {

          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])

        }
        that.setData({
          upload_picture_list: upload_picture_list,

        })
        //循环把图片上传到服务器 并显示进度
        for (var j in upload_picture_list) {

          if (upload_picture_list[j]['upload_percent'] == 0) {

            that.upload_file_server(that, upload_picture_list, j)

          }

        }

      }
    })
  },


  upload_file_server(that, upload_picture_list, j) {

    var upload_task = wx.uploadFile({
      url: 'https://guli.zhudou.cn/file/upload', //需要用HTTPS，同时在微信公众平台后台添加服务器地址
      filePath: upload_picture_list[j]['path'],//上传的文件本地地址
      name: 'image',
      header: { 'content-Type': 'multipart/form-data', 'Authorization': wx.getStorageSync('head') },
      formData: { 'type':1 },//附近数据，这里为路径
      success: function (res) {

        var data = JSON.parse(res.data) //字符串转化为JSON

          if (data.code == 0) {

            var filename = "http://img.zhudou.cn/guli/photography" + data.data.imageUrl
            upload_picture_list[j]['path_server'] = filename
            that.data.imgList.push(data.data.imageUrl)
          }
        that.setData({
          upload_picture_list: upload_picture_list,
          imgList: that.data.imgList

        })
      }
    })
    upload_task.onProgressUpdate((res) => {
      upload_picture_list[j]['upload_percent'] = res.progress
      that.setData({
        upload_picture_list: upload_picture_list

      })

    })
  },
  //图片删除
  delImg(e){
    this.data.upload_picture_list.splice(e.currentTarget.dataset.index,1)
    this.data.imgList.splice(e.currentTarget.dataset.index,1)
    this.setData({
      upload_picture_list: this.data.upload_picture_list,
      imgList:this.data.imgList
    })
  },
  //显示
  showCover(){
    this.setData({
      cover:true
    })
    wx.setNavigationBarTitle({
      title: '标签',
    })
  },
  //标签切换
  labelcheck(e){
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    if(item.select == 0){
      this.data.labelList[index].select = 1
    }else{
      this.data.labelList[index].select = 0
    }
    this.setData({
      labelList:this.data.labelList
    })
  },
  //完成标签
  finishlabel(){
    let ids = [];
    let labels = [];
    this.data.labelList.map((item)=>{
      if(item.select == 1){
        ids.push(item.id)
        labels.push(item.name)
      }
    })
    this.setData({
      labelInfo:labels.join('、'),
      labelIds:ids.join(),
      cover:false
    })
    wx.setNavigationBarTitle({
      title: '发布',
    })
  },
  //返回
  goBack(){
    wx.navigateBack({
      delta:1
    })
  },
  //完成发布
  finishPhoto(){
    if(this.data.title == ''){
      wx.showToast({
        title: '请填写标题',
        icon:'none',
        duration:1500
      })
      return null; 
    }
    app.globalFun.http('photography/topic/publish', { title: this.data.title, labelIds: this.data.labelIds, imageUrls: this.data.imgList.join()},(res)=>{
      if(res.code == 0){
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 1500
        })
        wx.navigateTo({
          url: '/pages/photography/photo/photo',
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  }
})