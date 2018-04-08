// create by five
// 常用的公共方法

//判断单位 颜色
function getunit(type){
  var obj = new Object();
  if(type === 0){
    obj.unit = "空位"
    obj.type = "车找人"
    obj.color = '#45b5ff'
  } else if(type === 1){
    obj.unit = "人"
    obj.type = "人找车"
    obj.color = '#f90'
  } else if (type === 2) {
    obj.unit = "辆"
    obj.type = "车找货"
    obj.color = '#AE83F8'
  } else if (type === 3) {
    obj.unit = "吨"
    obj.type = "货找车"
    obj.color = '#FF6F73'
  }
  return obj
}
//判断是否 时间是否过期
function timeLose(itemTime){
  itemTime = itemTime.replace(/-/g, '/')
  var nowTime = new Date();
  if(Date.parse(nowTime) >= Date.parse(itemTime)){
    return true		//过期
  }else{
    return false	//未过期
  }
}
//判断 日期 
function getWeek(itemTime){
  itemTime = itemTime.replace(/-/g,'/')
  console.log(itemTime)
  var obj = new Object();
  var mydate = new Date(itemTime);
  var timeStr = (mydate.getHours() >= 10 ? mydate.getHours() : '0' + mydate.getHours()) + '：' + (mydate.getMinutes() >= 10 ? mydate.getMinutes() : '0' + mydate.getMinutes());
  var myddy = mydate.getDay();//获取存储当前日期
  var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  if(mydate.getDate() == new Date().getDate()){
    obj.date = '今天'
  }else{
    obj.date = itemTime.toString().slice(0,10)
  }
  obj.time = '(' + weekday[myddy] + ') ' + timeStr + ' ';
  return obj;
  /*
 	obj:{
 		date: '今天' || 2018-09-09,
 		time: '（周日） 10:00'
 	}
   * */
}
//判断 日期 是不是低于60分钟
function getOneHour(itemTime){
  itemTime = itemTime.replace(/-/g, '/')
  var nowTime = Date.parse(new Date())/1000;
  var createTime = Date.parse(new Date(itemTime))/1000;
  var step = nowTime - createTime;
  if(step>=3600){
    return itemTime
  }else{
    return Math.ceil(step/60) + '分钟前发布'
  }
}

module.exports = {
  getunit: getunit,
  timeLose: timeLose,
  getWeek: getWeek,
  getOneHour: getOneHour
}