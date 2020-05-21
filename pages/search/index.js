const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "民宿列表",
    activeIndex: 1,
    searchOption: [{
        text: '距离优先',
      value: 'near'
      },
      {
        text: '高价优先',
        value: 'price_high'
      },
      {
        text: '低价优先',
        value: 'price_low'
      },
      {
        text: '新品优先',
        value: 'recommend'
      },
    ],
    search: "",
    sort: 'recommend',
    filter: "all",
    page: 1,
    isTagCheck: true,
    isTag: false,
    hasMoreData: false,
    listStore: [],
    cityData: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      page: 1,
      listStore: [],
    })
    wx.removeStorageSync("hotelTypeId")
    console.log()
    if (wx.getStorageSync("searchInfo")){
      this.setData({
        search: wx.getStorageSync("searchInfo").name
      })
    }
    this.selectComponent('#filter-date').getDateInfo();
    this.handleData()
  },
  handleData() {
    const {
      search,
      sort,
      filter,
      page
    } = this.data
    const dateInfo = wx.getStorageSync("dateInfo")
    const tagInfo = wx.getStorageSync('tagInfo')
    let hotelText = {
      lat: 118,
      lng: 32,
      begin_time: dateInfo[0],
      end_time: dateInfo[dateInfo.length - 1],
      page,
      step: 20,
      tags: [],
      city_code: "",
      search,
      filter,
      sort
    }
    // 获取 begin_time end_time
    let cityData
    if (wx.getStorageSync("cityData")) {
      cityData = wx.getStorageSync("cityData")
      this.setData({
        cityData
      })
      if (cityData.city_code!=0){
        hotelText.city_code = cityData.city_code
      } else {
        delete hotelText.city_code
      }
    }
    
    let tagIds = []
    if (tagInfo && tagInfo.length>0) {
      tagInfo.map((item, i) => {
        if (i % 2 == 0) {
          tagIds.push(item)
        }
      })
      hotelText.tags = tagIds
      this.setData({
        isTagCheck: true
      })
    } else {
      this.setData({
        isTagCheck: false
      })
    }

    this.getList(hotelText)

  },
  // 获取民宿列表
  getList(hotelText) {
    wx.showLoading({
      title: '加载中',
    })
    const self = this
    let {
      page,
      listStore
    } = this.data
    app.request({
      url: app.apis.listStore,
      data: hotelText
    }).then(res => {
      wx.hideLoading()
      console.log(res.data)
      const resData = res.data
      if (resData.length > 0) {
        if (resData.length < 20) {
          self.setData({
            listStore: listStore.concat(resData),
            hasMoreData: false
          })
        } else {
          self.setData({
            listStore: listStore.concat(resData),
            hasMoreData: true,
            page: page + 1
          })
        }
      } else {
        if(page==1){

        }
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },
  tabChange(e) {
    console.log(e, "切换")
    if(e.detail.index==1){
      this.setData({
        filter: 'all'
      })
    } else {
      this.setData({
        filter: 'house'
      })
    }
    this.setData({
      page: 1,
      listStore: [],
      activeIndex: e.detail.index
    })
   
    this.handleData()
  },

  handleSort(e) {
    const sort = e.detail
    this.setData({
      page: 1,
      listStore: [],
      sort
    })
    this.handleData()
  },


  handleTab(e) {
    console.log(e.currentTarget.dataset.current)
    const type = e.currentTarget.dataset.current / 1
    let url
    switch (type) {
      case 1:
        url = '/pages/search/city/index'
        break
      case 2:
        url = "/pages/search/searchMain/index"
        break
      case 3:
        break
    }
    if (type == 3) {
      this.setData({
        isTag: !this.data.isTag
      })
      return
    }

    wx.navigateTo({
      url
    })
  },

  getTagInfo(e){
    this.setData({
      page: 1,
      listStore: []
    })
    this.setData({
      isTag: false
    })
    this.handleData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      listStore: []
    })
    this.handleData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.handleData()
    } 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})