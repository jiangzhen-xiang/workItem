// 转换时间
export const timeTrans = (val) => {
  let times = new Date(val),
    timeMonth = times.getMonth() + 1,
    timeDate = times.getDate(),
    timeHour = times.getHours(),
    timeMinutes = times.getMinutes(),
    timeSeconds = times.getSeconds();
  if (timeMonth < 10) {
    timeMonth = "0" + timeMonth;
  }
  if (timeDate < 10) {
    timeDate = "0" + timeDate;
  }
  if (timeHour < 10) {
    timeHour = "0" + timeHour;
  }
  if (timeMinutes < 10) {
    timeMinutes = "0" + timeMinutes;
  }
  if (timeSeconds < 10) {
    timeSeconds = "0" + timeSeconds;
  }
  return times.getFullYear() + "-" + timeMonth + "-" + timeDate + " " + timeHour + ":" + timeMinutes + ":" + timeSeconds;
}