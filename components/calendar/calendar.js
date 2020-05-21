const app = getApp()
const format = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentYear: { // 当前显示的年
      type: Number,
      value: new Date().getFullYear()
    },
    currentMonth: { // // 当前显示的月
      type: Number,
      value: new Date().getMonth() + 1
    },
    currentDay: {
      type: Number,
      value: new Date().getDate()
    },
    dateType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentDay: new Date().getDate(),
    currentMonthDateLen: 0, // 当月天数
    preMonthDateLen: 0, // 当月中，上月多余天数
    allArr: [], // 当月所有数据
    currentDate: new Date().getDate(),
    openPicker: false,
    needAnimation: false,
    showMask: false,
    monthDate: new Date().getMonth() + 1,
    yearDate: new Date().getFullYear(),
    currentWeeks: [],

    yearData: [],

    

    startList: [],
    targetList: [],
    checkInfo: [],
    model_id: 0,
  },
  ready() {
    if (wx.getStorageSync("hotelTypeId")){
      this.setData({
        model_id: wx.getStorageSync("hotelTypeId")
      })
    } else {
      this.setData({
        model_id: 0
      })
    }
    let checkInfo
    if (wx.getStorageSync("dateInfo")) {
      checkInfo = wx.getStorageSync("dateInfo")
    } else {
      checkInfo = [app.utils.gettime(new Date().getTime(), 1),app.utils.gettime(new Date().getTime() + 24 * 60 * 60 * 1000, 1)]
    }
    this.setData({
      checkInfo
    })
    console.log(this.data.checkInfo,"checkInfo数据")
    console.log(this.currentMonthFirst(),"测试当月第一天")
    let timeArea = this.currentMonthFirst()
    this.getList(timeArea)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    currentMonthFirst() {
      let date = new Date().setDate(1)
      let currentFirst = app.utils.gettime(date, 1)
      let handleArr = currentFirst.split("-")
      // console.log(handleArr[2])
      let currentLast
      if (handleArr[1]<7){
        currentLast = handleArr[0] + '-' + (handleArr[1]/1 + 6) + "-" + handleArr[2]
      } else {
        currentLast = (handleArr[0]/1+1) + '-' + (handleArr[1]/1+6)%12 + "-" + handleArr[2]
      }
      return [currentFirst, app.utils.gettime(currentLast, 1)]
    },

    timeFormat(date) {
      let y = new Date(date).getFullYear(); //年
      let m = new Date(date).getMonth() + 1; //月
      let d = new Date(date).getDate(); //日
      return y + "-" + m + "-" + d;
    },

    getList(timeArea) {
      const self = this
      const {
        model_id
      } = this.data
      app.request({
        url: app.apis.roomMonth,
        data: {
          model_id,
          begin_time: timeArea[0],
          end_time: timeArea[1]
        }
      }).then(res => {
        console.log(res.data)
        if (res.data) {
          self.setData({
            targetList: res.data
          })
          self.handleList()
        }
      }).catch(err => {

      })
    },

    handleList() {
      let {
        targetList,
        checkInfo
      } = this.data
      console.log(targetList, checkInfo)
      let targetArr = []
      for (let keyMonth in targetList) {
        targetArr.push({
          yearMonth: keyMonth.split('-'),
          preArr: this.getPreArr(keyMonth.split('-')),
          currentArr: targetList[keyMonth].map((item, index) => {
            item.currentIndex = index + 1
            item.date = Object.keys(item)[0]
            item.isFill = item[Object.keys(item)[0]]
            item.isLine = false
            item.isStart = false
            item.isEnd = false
            item.isCheck = false
            if (checkInfo.indexOf(item.date) == 0) {
              item.isCheck = true
              item.isLine = true
              item.isStart = true
            } else if (checkInfo.indexOf(item.date) == checkInfo.length - 1) {
              item.isCheck = true
              item.isEnd = true
              item.isLine = true
            } else if (checkInfo.indexOf(item.date) != -1) {
              item.isCheck = true
            }
            return item
          })
        })
      }
      // 处理初始选中日期
      // targetArr.map()

      this.setData({
        startList: targetArr
      })
      console.log(this.data.startList)
    },

    handleCheck(e) {
      if (this.data.checkInfo.length > 1) {
        this.setData({
          checkInfo: []
        })
      }
      let {
        checkInfo
      } = this.data
      let {
        date
      } = e.currentTarget.dataset
      console.log(new Date().getTime(), new Date(date).getTime())
      if (new Date(app.utils.gettime(new Date().getTime(), 1)).getTime() > new Date(date).getTime()) {
        return
      } 
      if (checkInfo.length == 0) {
        checkInfo.push(date)
      } else {
        checkInfo = this.formatDiff(checkInfo[0], date)
      }
      this.setData({
        checkInfo
      })
      if (this.data.checkInfo.length > 1) {
        console.log(this.data.checkInfo)
        wx.setStorageSync("dateInfo", this.data.checkInfo)
      
    
        wx.navigateBack({
          delta: 1
        })
      } else {
        this.handleList()
      }
    },

    formatDiff(date1, date2) {
      let dateArr = []
      if (new Date(date1).getTime() >= new Date(date2).getTime()) {
        dateArr.push(date2)
      } else {
        dateArr.push(...this.getDiffDate(date1, date2), date2)
      }
      return dateArr
    },

    getDiffDate(start, end) {
      const {
        getDate
      } = this
      let startTime = getDate(start);
      let endTime = getDate(end);
      let dateArr = [];
      while ((endTime.getTime() - startTime.getTime()) > 0) {
        let year = startTime.getFullYear();
        let month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
        let day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
        dateArr.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
      }
      return dateArr;
    },

    getDate(datestr) {
      let temp = datestr.split("-");
      if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1;
        temp[1] = '12';
      } else {
        temp[1] = parseInt(temp[1], 10) - 1;
      }
      //new Date()的月份入参实际都是当前值-1

      let date = new Date(temp[0], temp[1], temp[2]);

      return date;

    },

    // 获取当月中，上月多余数据，返回数组
    getPreArr(yearMonth) {
      let preMonthDateLen = this.getFirstDateWeek(yearMonth[0], yearMonth[1]) // 当月1号是周几 == 上月残余天数）
      let preMonthDateArr = [] // 定义空数组
      if (preMonthDateLen > 0) {
        let {
          year,
          month
        } = this.preMonth(yearMonth[0], yearMonth[1]) // 获取上月 年、月
        let date = this.getDateLen(year, month) // 获取上月天数
        for (let i = 0; i < preMonthDateLen; i++) {
          preMonthDateArr.unshift({ // 尾部追加
            month: 'pre', // 只是为了增加标识，区分当、下月
            date: ""
          })
          date--
        }
      }
      this.setData({
        preMonthDateLen
      })
      return preMonthDateArr
    },





   
    // 获取某年某月总共多少天
    getDateLen(year, month) {
      let actualMonth = month - 1;
      let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
      return timeDistance / (1000 * 60 * 60 * 24);
    },
    // 获取某月1号是周几
    getFirstDateWeek(year, month) {
      return new Date(year, month - 1, 1).getDay()
    },
    // 上月 年、月
    preMonth(year, month) {
      if (month == 1) {
        return {
          year: --year,
          month: 12
        }
      } else {
        return {
          year: year,
          month: --month
        }
      }
    },
    // 下月 年、月
    nextMonth(year, month) {
      if (month == 12) {
        return {
          year: ++year,
          month: 1
        }
      } else {
        return {
          year: year,
          month: ++month
        }
      }
    },
    // 获取当月数据，返回数组
    getCurrentArr() {
      let currentMonthDateLen = this.getDateLen(this.data.currentYear, this.data.currentMonth) // 获取当月天数
      let currentMonthDateArr = [] // 定义空数组
      if (currentMonthDateLen > 0) {
        for (let i = 1; i <= currentMonthDateLen; i++) {
          currentMonthDateArr.push({
            month: 'current', // 只是为了增加标识，区分上下月
            date: i
          })
        }
      }
      this.setData({
        currentMonthDateLen
      })
      return currentMonthDateArr
    },

    // 获取当月中，下月多余数据，返回数组
    getNextArr() {
      let nextMonthDateLen = 42 - this.data.preMonthDateLen - this.data.currentMonthDateLen // 下月多余天数
      let nextMonthDateArr = [] // 定义空数组
      if (nextMonthDateLen > 0) {
        for (let i = 1; i <= nextMonthDateLen; i++) {
          nextMonthDateArr.push({
            month: 'next', // 只是为了增加标识，区分当、上月
            date: i
          })
        }
      }
      return nextMonthDateArr
    },
    // 整合当月所有数据
    getAllArr() {
      let preArr = this.getPreArr()
      let currentArr = this.getCurrentArr()
      let nextArr = this.getNextArr()
      let allArr = [...preArr, ...currentArr, ...nextArr]

      this.setData({
        preArr,
        currentArr,
        allArr
      })
      let dataList = [{
        currentHead: `${this.data.currentYear}年${this.data.currentMonth}月`,
        preArr: [...preArr],
        currentArr: [...currentArr]
      }]
      this.setData({
        yearData: this.data.yearData.concat(dataList)
      })
      console.log(this.data.yearData, "整年数据")
      let sendObj = {
        currentYear: this.data.currentYear,
        currentMonth: this.data.currentMonth,
        currentDay: this.data.currentDay,
        allArr: allArr
      }
      // console.log(sendObj)
      this.triggerEvent('sendObj', sendObj)
    },
    // 点击 上月
    gotoPreMonth() {
      let {
        year,
        month
      } = this.preMonth(this.data.currentYear, this.data.currentMonth)
      this.setData({
        currentYear: year,
        currentMonth: month
      })
      this.getAllArr()
    },
    // 点击 下月
    gotoNextMonth() {
      let {
        year,
        month
      } = this.nextMonth(this.data.currentYear, this.data.currentMonth)
      this.setData({
        currentYear: year,
        currentMonth: month
      })
      this.getAllArr()
    },
    preDate(e) {
      this.setData({
        currentDay: e.currentTarget.dataset.id
      })
      this.gotoPreMonth();
    },
    datetap(e) {
      this.setData({
        currentDay: e.currentTarget.dataset.id,
        showMask: false,
      })
      console.log(this.data.currentDay)
      this.getAllArr()
      console.log(this.data.allArr)
    },

    daytap() {
      this.setData({
        showMask: false,
      })
    }
  }
})