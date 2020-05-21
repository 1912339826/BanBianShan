//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    current: 0,
      swiperOptions: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 5000,
        duration: 500,
    },
    swiperIndex: 1,



    // 日期
    dateCheck: {
      startMon: "",
      startDay: "",
      endMon: "",
      endDay: "",
      startWeekDay: "",
      endWeekDay: ""
    },
    dateInfo: [],
        // 民宿列表
    listStore: [],

    tagName: "",
    // 首页数据
    homeData: {
    
    },
    cityData: {},
    
    lat: 0,
    lng: 0,
    currentCity: "",
  },

  onLoad: function () {
    wx.removeStorageSync('dateInfo')
    this.getCity()
  },

  onReady: function () {
    
  },



  onShow: function () {
    wx.removeStorageSync("hotelTypeId")
    if(this.data.lat==0){
      return
    }
    this.handleSearchCheck()
  },

  getCity: function () {
    const self = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res, "定位")
        self.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        self.handleSearchCheck()
      }
    })
  },

  

  handleSearchCheck(){
    const {
      lat,
      lng
    } = this.data
    if (wx.getStorageSync("cityData")) {
      console.log(wx.getStorageSync("cityData"))
      this.setData({
        cityData: wx.getStorageSync("cityData")
      })
    }
    // 获取时间 begin_time  end_time
    let target
    let dateInfo
    if (wx.getStorageSync("dateInfo")) {
      dateInfo = wx.getStorageSync("dateInfo")
      target = app.utils.getWeekDay(dateInfo[0], dateInfo[dateInfo.length-1])
    } else {
      dateInfo=["today","tomorrow"]   
      target = app.utils.getWeekDay("today")
      wx.setStorageSync("dateInfo", [app.utils.gettime(new Date().getTime(), 1), app.utils.gettime(new Date().getTime() + 24 * 60 * 60 * 1000, 1)])
    }
    this.setData({
      dateInfo,
      dateCheck: target
    })
    
    // wx.setStorageSync("dateInfo", dateInfo)


    let hotelText = {
      lat,
      lng,
      begin_time: dateInfo[0],
      end_time: dateInfo[dateInfo.length-1],
      search: "",
      page: 1,
      filter: "house",
      sort: "recommend",
      tags: []
    }

    if (wx.getStorageSync("searchInfo")){
      wx.removeStorageSync('searchInfo')
    }

    // 获取 tags
    let tagInfo = []
    let tagName = []
    let tagIds = []
    if (wx.getStorageSync('tagInfo')) {
      tagInfo = wx.getStorageSync('tagInfo')
      tagInfo.map((item,i)=>{
        if (i % 2 == 0) {
          tagIds.push(item)
        } else {
          tagName.push(item)
        }
      })
      hotelText.tags = tagIds
    }
    this.setData({
      tagName: tagName.join(",")
    })
// 处理完成
    wx.setStorageSync('searchWay', hotelText)
    this.loadData(hotelText)
  },

  // 获取首页数据
  loadData(hotelText){
    const self = this
    const {
      lat,
      lng,
    } = hotelText
    app.request({
      url: app.apis.home,
      data: {
        lat,
        lng,
      }
    }).then(res => {
      console.log(res.data)

      if(res.data){
        let resData = res.data
        if (resData.minsu_recommends){
          let handleArr = []
           resData.minsu_recommends.map(item => {
            item.low_price = app.utils.formatPrice(item.low_price)
             handleArr.push(item)
          })
          resData.minsu_recommends = handleArr
        }
        
        self.setData({
          homeData: resData
        })
      }
    }).catch(err => {

    })
  },


  watch: {
    current: function (newValue) {
      console.log(newValue); // name改变时，调用该方法输出新值。
    }
  },

  handleTab(e){
   console.log(e.currentTarget.dataset.index)
    const type = e.currentTarget.dataset.index/1
   let url
  switch (type){
    case 1: 
      url = '/pages/search/city/index'
      break
    case 2:
      url = "/pages/calendar/index"
      break
    case 3:
      url = "/pages/search/searchMain/index"
      break
    case 4:
      url = "/pages/search/tag/index"
      break
    case 5:
      url = "/pages/search/index"
      break
    case 6:
      url = "/pages/index/strategy/index"
      break
  }
  console.log(url)
    wx.navigateTo({
      url
    })
  },
 

  // handleRecommends
  handleRecommends(e){
    const {
      link
    } = e.currentTarget.dataset.item
    console.log(e,"轮播链接")

  },

  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current+1
    })
    // console.log(e, e.detail.current)
  },

  // handleDetail
  handleDetail(e){
    const {
      store_id
    } = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/details/index?id=' + store_id,
    })
  },

  handleCityTab(e){
    const info = e.currentTarget.dataset.info
    wx.setStorageSync('cityData', info)
    console.log(info)
    wx.navigateTo({
      url: "/pages/search/index",
    })
  },

  handleTitleTab(e){
    const info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/index/detail/index?id=' + info.id,
    })
  },

  // 推荐位跳转
  handleLinkTab(e){
    const info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/webLink/index?link=' + info.link,
    })
  },




  
  
  // search跳转


})
