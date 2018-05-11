Date.prototype.toLocaleString = function () {
  return (this.getMonth() + 1) + "月" + this.getDate() + "日 "
};
// 转换时间
const formatTime = date => {
  const nowDate = Number(new Date())/1000
  if (nowDate > date){
    return null
  }else{
    const newTime = new Date(date * 1000);
    return newTime.toLocaleString()
  }
}
const timestamp = date => {
  let time = date
  if(!time){
    return null
  }
  let day = parseInt(time / 86400)
  let hour = parseInt((time - day * 86400) / 3600)
  let min = parseInt((time - day * 86400 - hour * 3600) / 60)
  if (hour < 10 && hour > 0){
    hour = '0' + hour
  }
  if (min < 10 && min > 0) {
    min = '0' + min
  }
  if(day != 0){
    return day + '天' + hour + "小时" + min + "分"
  } else if (day == 0 && hour != 0){
    return hour + "小时" + min + "分"
  } else if (day == 0 && hour == 0 && min != 0) {
    return min + "分"
  }
}

// 替换文本中换行<br />
const replaceBr = date => {
  if (!date) return false
  let newText = date
  let m = date.length/4
  for(let i = 0; i < m; i++){
    newText = newText.replace("<br />", "\n")
  }
  return newText
}


module.exports = {
  formatTime: formatTime,
  replaceBr: replaceBr,
  timestamp: timestamp
}
