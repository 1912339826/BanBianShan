const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateList(dateList) {
  return dateList.currentYear + "-" + dateList.currentMonth + "-" + dateList.currentDay + " 00:00:00"
}

function gettime(t, type) {
  const _time = new Date(t);
  const year = _time.getFullYear(); //2017
  let month = _time.getMonth() + 1; //7
  let date = _time.getDate(); //10
  const hour = _time.getHours(); //10
  const minute = _time.getMinutes(); //56
  const second = _time.getSeconds(); //15
  if (type == 1) {
    if (month < 10) {
       month = "0" + month
    } 
    if (date < 10){
       date = "0" + date
    }
    return year + "-" + month + "-" + date
  } else if (type == 2) {
    if (minute > 10) {
      return hour + ":" + minute
    } else {
      return hour + ": 0" + minute
    }
  } else {
    return hour + ":" + minute //这里自己按自己需要的格式拼接
  }
}

// 拼接图片
function changeSrc(picsrc) {
  let urlList = []
  if (picsrc) {
    const prev = app.apiHost
    // console.log(picsrc.split(",").length)
    // if (picsrc.split(",").length==1){
    //   urlList.push(prev + picsrc)
    // }
    picsrc.map(item => {
      urlList.push(prev + item)
    })
    console.log(urlList)
  }
  return urlList
}

// 获取本周日期
function getWeeks(getId) {
  let now = new Date();
  let nowTime = now.getTime();
  let day = now.getDay();
  let oneDayLong = 24 * 60 * 60 * 1000;
  //计算这一周
  let arrdate = []
  let arrMonth = []
  let arrYear = []
  for (let i = 1; i < 8; i++) {
    let SundayTime = nowTime + (i - 1 - day) * oneDayLong;
    SundayTime = new Date(SundayTime);
    let y = SundayTime.getFullYear(); //年
    let m = SundayTime.getMonth() + 1; //月
    let d = SundayTime.getDate(); //日
    let h = SundayTime.getHours(); //时
    let mm = SundayTime.getMinutes(); //分
    let s = SundayTime.getSeconds(); //秒
    arrdate.push(d)
    arrMonth.push(m)
    arrYear.push(y)
  }
  // let todayDate = new Date().getDate()
  // let todayMonth = new Date().getMonth()+1
  // let todayYear = new Date().getFullYear()
  // arrdate.unshift(todayDate)
  // arrMonth.unshift(todayMonth)
  // arrYear.unshift(todayYear)
  // arrdate.unshift(todayDate)
  // arrMonth.unshift(todayMonth)
  // arrYear.unshift(todayYear)
  if (getId == 1) {
    return arrMonth
  } else if (getId == 2) {
    return arrYear
  } else {
    return arrdate
  }
}
// 获取周几
function getWeekDay(date,lastDate) {
  let dataList = {
    startMon: "",
    startDay: "",
    endMon: "",
    endDay: "",
    startWeekDay: "",
    endWeekDay: ""
  }
  let a = new Array("日", "一", "二", "三", "四", "五", "六");
  if(date=="today"){
    dataList.startMon = new Date().getMonth() + 1
    dataList.startDay = new Date().getDate()
    dataList.endMon = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).getMonth() + 1
    dataList.endDay = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).getDate()
    dataList.startWeekDay = a[new Date().getDay()]
    dataList.endWeekDay = a[new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).getDay()]
  } else {
    dataList.startMon = new Date(date).getMonth() + 1
    dataList.startDay = new Date(date).getDate()
    dataList.endMon = new Date(lastDate).getMonth() + 1
    dataList.endDay = new Date(lastDate).getDate()
    dataList.startWeekDay = a[new Date(date).getDay()]
    dataList.endWeekDay = a[new Date(lastDate).getDay()]
  }
  console.log(dataList)
  return dataList
}
// 提示信息
function info(content){
    wx.showToast({
      icon: 'none',
      title: `${content}`,
    })
}

function getIcon(arr){
  const infoData = {
    air_conditioner: "空调",
    tv: "电视",
    balcony: "阳台",
    window: "窗户",
    bathroom: "独立卫浴",
    bathtub: "浴缸",
    hair_drier: "吹风机",
    coat_hanger: "衣架", 
    hot_water: "热水供应",
    washing_machine: "洗衣机",
    kitchen_utensils: "基本厨具",
    refrigerator: "冰箱",
    wifi: "wifi 网络",
    electric_kettle: "电热水壶",
    heating: "暖气",
    ai_toilet: "智能马桶",          
    wash_supplies: "洗漱用品",
    tableware: "餐具",
    induction_cooker: "电磁炉",
    kitchen_seasoning: "厨房调料",
    microwave_oven: "微波炉",
    projection: "投影设备",
    access_control: "门禁系统",
    ai_door_lock: "智能门锁",
    garden: "私家花园",
    swimming_pool: "私家泳池",
    viewing_terrace: "观景露台",
    free_parking: "免费停车",
    luggage_deposit: "行李寄存",
    sofa: "沙发",
    desk: "书桌",
    slipper: "拖鞋",                                
    keeper: "目的地管家",
    quilt: "被子",
    umbrella: "雨伞租/借",                
  }
  let targetArr = []
  arr.map(item=>{
    let index = Object.keys(infoData).indexOf(item)
    if (index!=-1){
      targetArr.push({
        pic: '/public/icon@3x/icon_room_particulars_' + Object.keys(infoData)[index] + '@3x.png',
        name: Object.values(infoData)[index]
      })
    }
  })
  return targetArr
}

function getDateDiff(timestamp) {
  // 补全为13位
  const arrTimestamp = (timestamp + '').split('');
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }
  timestamp = arrTimestamp.join('') * 1;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return '不久前';
  }

  // 计算差异时间的量级
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;

  // 数值补0方法
  const zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function () {
      const date = new Date(timestamp);
      return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return '刚刚';
}

function formatPrice(money){
  return money/100
}
module.exports = {
  formatTime,
  gettime,
  getDateList,
  changeSrc,
  getWeeks,
  info,
  getWeekDay,
  getIcon,
  getDateDiff,
  formatPrice
}