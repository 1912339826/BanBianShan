const app = getApp()
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    dateType: {
      type: Number,
      value: 0
    },
    clearId: {
      type: Number,
      value: 0
    }
  },
  data: {
    // 日期
    currentArr: [],
    dateInfo: [1,2]
  },

  ready(){

   this.getDateInfo()
  },

  methods: {
    getDateInfo(){
      let target
      let dateInfo
      if (wx.getStorageSync("dateInfo")) {
        dateInfo = wx.getStorageSync("dateInfo")
        target = app.utils.getWeekDay(dateInfo[0], dateInfo[dateInfo.length - 1])
      } else {
        target = app.utils.getWeekDay("today")
      }
      this.setData({
        currentArr: this.handleTarget(target),
        dateInfo
      })
    },

    handleTarget(target){
      let currentArr = []
      Object.values(target).map( (item,index)=>{
        if(index<4){
          if(item/1<10){
            item= "0"+item
          }
          currentArr.push(item)
        }
      })
      return currentArr
    },
    dateClick(){

      const {
        dateType,
        clearId
      } = this.data
      if (clearId==1){
        wx.removeStorageSync("hotelTypeId")
      }
      const url = "/pages/calendar/index?type=" + dateType
      wx.navigateTo({
       url
     })
    }
  }
})