export function dataFormatter (obj) {
  let pList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  let temp
  for (let year = 202001; year <= 202006; year++) {
    let max = 0
    let sum = 0
    temp = obj[year]
    for (let i = 0, l = temp.length; i < l; i++) {
      max = Math.max(max, temp[i])
      sum += temp[i]
      obj[year][i] = {
        name: pList[i],
        value: temp[i]
      }
    }
    obj[year + 'max'] = Math.floor(max / 100) * 100
    obj[year + 'sum'] = sum
  }
  return obj
}
export function formatDateTime(time, format){  
  var t = new Date(time);  
  var tf = function(i){return (i < 10 ? '0' : '') + i};  
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){  
      switch(a){  
          case 'yyyy':  
              return tf(t.getFullYear());  
              break;  
          case 'MM':  
              return tf(t.getMonth() + 1);  
              break;  
          case 'mm':  
              return tf(t.getMinutes());  
              break;  
          case 'dd':  
              return tf(t.getDate());  
              break;  
          case 'HH':  
              return tf(t.getHours());  
              break;  
          case 'ss':  
              return tf(t.getSeconds());  
              break;  
      }  
  })  
}

// 节流
export function throttle(fn,wait){
  let that=this;
  return function(){
    if(that.timer==null){
      that.timer=setTimeout(fn,wait);
    }
  }
}

// 防抖
export function debounce(fn,wait){
  let that=this;
  return function(){
    if(that.timer!=null){
      clearTimeout(that.timer);
    }
    that.timer=setTimeout(fn,wait)
  }
}