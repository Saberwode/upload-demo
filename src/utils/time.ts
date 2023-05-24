/* eslint-disable */
//毫秒转为时分秒
function timeChange(time: number) {
  const hours = parseInt(
    String((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = parseInt(String((time % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = (time % (1000 * 60)) / 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
}
//  格式化日期：yyyy-MM-dd 和 yyyy-MM-dd hh:mm:ss
function formatDate(date, formate) {
  // console.log(date);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  if (formate == 'yyyy-MM-dd') {
    return (
      year +
      '-' +
      String(month).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0')
    );
  } else if (formate == 'yyyy-MM-dd hh:mm:ss') {
    return (
      year +
      '-' +
      String(month).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0') +
      ' ' +
      String(hour).padStart(2, '0') +
      ':' +
      String(minute).padStart(2, '0') +
      ':' +
      String(second).padStart(2, '0')
    );
  } else if (formate === 'yyyy-MM-dd hh:mm') {
    return (
      year +
      '-' +
      String(month).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0') +
      ' ' +
      String(hour).padStart(2, '0') +
      ':' +
      String(minute).padStart(2, '0')
    );
  }
}
// 转换为日期参数当月开始时间
function formatMonthStartTime(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStartDate = formatDate(new Date(year, month, 1), 'yyyy-MM-dd');
  const newDate = formatDate(
    new Date(`${monthStartDate} 00:00:00`),
    'yyyy-MM-dd hh:mm:ss'
  );
  return newDate;
}
// 转换为日期参数当月结束时间
function formatMonthEndTime(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDate = formatDate(new Date(year, month, 0), 'yyyy-MM-dd');
  const newDate = formatDate(
    new Date(`${lastDate} 23:59:59`),
    'yyyy-MM-dd hh:mm:ss'
  );
  return newDate;
}
function getLastNextMonthTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  let nowString;
  const dateArr: string[] = [];
  const nextMonth = now.getTime() + 60 * 60 * 1000 * 24 * 30;
  nowString = formatDate(new Date(nextMonth), 'yyyy-MM-dd');
  const nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
  let last;
  if (month - 1 <= 0) {
    //如果是1月，年数往前推一年<br>
    last = year - 1 + '-' + 12 + '-' + String(day).padStart(2, '0');
  } else {
    const lastMonthDay = new Date(year, Number(month) - 1, 0).getDate();
    if (lastMonthDay < day) {
      //1个月前所在月的总天数小于现在的天日期
      if (day < nowMonthDay) {
        //当前天日期小于当前月总天数
        last =
          year +
          '-' +
          String(month - 1).padStart(2, '0') +
          '-' +
          String(lastMonthDay - (nowMonthDay - day)).padStart(2, '0');
      } else {
        last =
          year +
          '-' +
          String(month - 1).padStart(2, '0') +
          '-' +
          String(lastMonthDay).padStart(2, '0');
      }
    } else {
      last =
        year +
        '-' +
        String(month - 1).padStart(2, '0') +
        '-' +
        String(day).padStart(2, '0');
    }
  }

  dateArr.push(last);
  dateArr.push(nowString);
  return dateArr;
}

// 获取 YYYY-MM-dd HH:mm:00 的日期时间格式
// 整个后端均采用 YYYY-MM-dd HH:mm 存储时间，但前端用 YYYY-MM-dd HH:mm:00 更方便。所以需要作转换
function getDayTime(datetime) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  let month = '';
  if (date.getMonth() + 1 < 10) {
    month = '0' + (date.getMonth() + 1);
  } else {
    month = (date.getMonth() + 1).toString();
  }

  let day = '';
  if (date.getDate() < 10) {
    day = '0' + date.getDate();
  } else {
    day = date.getDate().toString();
  }

  let hour = '';
  if (date.getHours() < 10) {
    hour = '0' + date.getHours();
  } else {
    hour = date.getHours().toString();
  }

  let minute = '';
  if (date.getMinutes() < 10) {
    minute = '0' + date.getMinutes();
  } else {
    minute = date.getMinutes().toString();
  }
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
}
//获取 YYYY-MM-dd HH:mm 的日期时间格式
function getDayTimeWithoutSec(value) {
  let temp = value;
  if (typeof value === 'object') {
    temp = getDayTime(value);
  }

  return temp.slice(0, -3);
}
function lastDay(y, m) {
  return (new Date(y, m, 0).getDate())
}
//月度|季度|年度转换为时间区间
function formatDateRange(type) {
  let dateRange:any = null;
  if (1 == type) { // 月度
    dateRange = formatDateRange4Month();
  }
  if (2 == type) { // 季度
    dateRange = formatDateRange4Quarter();
  }
  if (3 == type) { // 年度
    dateRange = formatDateRange4Year();
  }
  return dateRange;
}
// 年度日期区间转换
function formatDateRange4Year() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth()+1;
  const d = today.getDate();
  let [by, bm, bd, ey, em, ed] = [y, 1, 1, y, m, d-1];
  if (1 == m && 1 == d) { // 如果当前是1月1日，日期区间取上一年1月1日~12月31日
    ey = by = y - 1;
    em = 12;
    ed = lastDay(ey, em);
  }else if (1 == d) { // 如果当前日是1日，日期区间取当前年1月1日~当前日期前一天
    em = m - 1;
    ed = lastDay(ey, em);
  }
  const beginDate = formatDate(new Date(`${by}-${bm}-${bd}`), 'yyyy-MM-dd');
  const endDate = formatDate(new Date(`${ey}-${em}-${ed}`), 'yyyy-MM-dd');
  return {
    beginDate: `${beginDate}`,
    endDate: `${endDate}`
  }
}
// 季度日期转换
function formatDateRange4Quarter() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  let [by, bm, bd, ey, em, ed] = [y, 0, 1, y, m, d - 1];
  if (1 == m && 1 == d) { // 如果当前是1月1日，日期区间取上一年10月1日~12月31日
    ey = by = y - 1;
    bm = 10;
    em = bm + 2;
    ed = lastDay(ey, em);
  } else if (1 == d) { // 如果当前日是1日，日期区间取上个季度日期区间
    bm = getQuarterStartMonth(m - 1);
    em = m - 1;
    ed = lastDay(ey, em);
  } else {
    bm = getQuarterStartMonth(m);
  }
  const beginDate = formatDate(new Date(`${by}-${bm}-${bd}`), 'yyyy-MM-dd');
  const endDate = formatDate(new Date(`${ey}-${em}-${ed}`), 'yyyy-MM-dd');
  return {
    beginDate: `${beginDate}`,
    endDate: `${endDate}`
  }
}
// 获取本季度开始月份
function getQuarterStartMonth(m) {
  let quarterStartMonth = 1;
  if(m<4){
    quarterStartMonth = 1;
  }
  if(3<m && m<7){
    quarterStartMonth = 4;
  }
  if(6<m && m<10){
    quarterStartMonth = 7;
  }
  if(m>9){
    quarterStartMonth = 10;
  }
  return quarterStartMonth;
}
// 月度日期区间转换
function formatDateRange4Month() {
  const today = new Date(); // 当前日期
  const y = today.getFullYear(); // 当前年
  const m = today.getMonth()+1; // 当前月
  const d = today.getDate(); // 当前日
  let [by, bm, bd, ey, em, ed] = [y, m, 1, y, m, d - 1];
  if (1 == m && 1 == d) { // 如果当前是1月1日，日期区间取去年12月1日~12月31日
    ey = by = y - 1;
    em = bm = 12;
    ed = lastDay(ey, em);
  }else if (1 == d) { // 如果当前日是1日，日期区间取上个月1日~上个月最后一日
    em = bm = m - 1;
    ed = lastDay(ey, em);
  }
  const beginDate = formatDate(new Date(`${by}-${bm}-${bd}`), 'yyyy-MM-dd');
  const endDate = formatDate(new Date(`${ey}-${em}-${ed}`), 'yyyy-MM-dd');
  return {
    beginDate: `${beginDate}`,
    endDate: `${endDate}`
  }
}
//时间戳转时分秒
function timeStampToDate(data) {
  var date = new Date(data)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}
// 获取相差的小时数
function getDiffHour(startTime, endTime) {
  const startTimestamp = new Date(startTime).getTime();
  const endTimestamp = new Date(endTime).getTime();
  const diffHour = (endTimestamp - startTimestamp)/3600000;
  return Math.floor(diffHour * 100) / 100;
}

// 本月/本季/本年日期区间转换
function formatCurrentDateRange(type) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth()+1;
  const d = today.getDate();
  let [by, bm, bd, ey, em, ed] = [y, m, 1, y, m, d]; // 默认本月
  if (1 == type) { // 本月
    ed = lastDay(ey, em);
  }
  if (2 == type) { // 本季
    [by, bd, ey] = [y, 1, y];
    bm = getQuarterStartMonth(m);
    em = bm + 2;
    ed = lastDay(ey, em);
  }
  if (3 == type) { // 本年
    [by, bm, bd, ey, em] = [y, 1, 1, y, 12];
    ed = lastDay(ey, em);
  }
  const beginDate = formatDate(new Date(`${by}-${bm}-${bd}`), 'yyyy-MM-dd');
  const endDate = formatDate(new Date(`${ey}-${em}-${ed}`), 'yyyy-MM-dd');
  return {
    beginDate: `${beginDate}`,
    endDate: `${endDate}`
  }
}

// 秒转换成时分秒
function formatTime(second: number) {
  const hour = Math.floor(second / 3600);
  const min = Math.floor(second / 60) % 60;
  const sec = second % 60;
  return { hour, min, sec };
}

export {
  timeChange,
  formatDate,
  formatMonthStartTime,
  formatMonthEndTime,
  formatDateRange,
  getLastNextMonthTime,
  getDayTime,
  getDayTimeWithoutSec,
  timeStampToDate,
  getDiffHour,
  formatCurrentDateRange,
  formatTime
};
