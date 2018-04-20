//create by five

var domain = 'https://guli.zhudou.cn/';
//url: api路径  例如：user/get/list
//data： 参数 对象
//cb： 回调函数
//type: 请求方式
function returnReq(url, data, cb, type = "post"){
  wx.request({
    url:domain + url,
    data:data,
    method:type,
    header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':  wx.getStorageSync('head') },
    success:(res)=>{
      if(res.data.code == '403'){
        wx.removeStorageSync('head')
        wx.redirectTo({
          url:'/pages/home/home'
        })
      }
      return typeof cb == 'function' && cb(res.data)
    },
    fail:(res)=>{
      return null;
    }
  })
}

module.exports = {
  returnReq:returnReq
}