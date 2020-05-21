const WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "民宿详情",
    swiperIndex: 0,
    // bottom tab
    activeIndex: 1,
    isShowText: false,
    actions: [
      {
        name: '呼叫'
      }   
      
    ],
    actionShow: false,
    // control detail type
    isShowType: false,

    loadStore: {},
    listRoom: [],
    loadModel: {},
    options: {},
    // 1是2否
    isVip: 2,
    roomCount: 0,
    isShowDialog: false,
    cardRule: "",
    isTop: false, 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  swiperChange(e){
    this.setData({
      swiperIndex: e.detail.current
    })
    // console.log(e, e.detail.current)
  },
  handleSwiper(e) {
    this.setData({
      swiperIndex: e.currentTarget.dataset.index / 1
    })
  },

  tabChange(e){
    console.log(e,"切换")
    this.setData({
      activeIndex: e.detail.index
    })
  },
  changeText(){
    this.setData({
      isShowText: !this.data.isShowText      
    })
  },
  changeType(){
    this.setData({
      activeIndex: 1
    })
  },

  // 处理跳转和弹出事件
  handleTab(e){
    console.log(e)
    const {
      loadStore
    } = this.data
    const type = e.currentTarget.dataset.current / 1
    let url
    switch (type) {
      case 1:
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: loadStore.lat,//要去的纬度-地址
              longitude: loadStore.lng,//要去的经度-地址
              name: loadStore.name,
              address: loadStore.province_name + loadStore.city_name + loadStore.address
            })
          }
        })
        break
      case 2:
        this.setData({
          actionShow: true
        })
        break
    }
  },

  clickCancel(){
    this.setData({
      actionShow: false
    })
  },

  typeClose(){
    this.setData({
      isShowType: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
    if (this.data.isShowType){
      let id = wx.getStorageSync("hotelTypeId")
      console.log("hotelTypeId", id)
      if (id) {
        this.loadModelData(id)
      } 
    } else {
      wx.removeStorageSync("hotelTypeId")
    }
    this.loadData()
    this.getList()
    this.getCard()
    this.getCardRule()
    this.selectComponent('#filter-date').getDateInfo();
  },
//  获取列表
  loadData(){
    const self = this
    const {
      id
    } = this.data.options
    console.log(id,"门店信息")
    app.request({
      url: app.apis.loadStore,
      data: {
       id
      }
    }).then(res => {
      console.log(res.data,"列表数据")
      if(res.data && res.data.store){
        self.setData({
          loadStore: res.data.store
        })
      }
    }).catch(err => {

    })
  },

  getList(){
    const self = this
    const dateAll = wx.getStorageSync("dateInfo")
    const begin_time = dateAll[0]
    const end_time = dateAll[dateAll.length - 1]
    const {
      id
    } = this.data.options
    app.request({
      url: app.apis.listRoomModel,
      data: {
        store_id: id,
        begin_time,
        end_time
      }
    }).then(res => {
      console.log(res.data, "房型数据")
      if (res.data) {
        self.setData({
          listRoom: res.data
        })
      }
    }).catch(err => {

    })
  },

  // 判断是否是会员
  getCard(){
    const self = this
    app.request({
      url: app.apis.userBlackCardData,
      data: {
        
      }
    }).then(res => {
     console.log(res.data)
     if(res.data){
       self.setData({
         isVip: res.data.is_vip
       })
     }
    }).catch(err => {

    })
  },

  // 获取黑金卡政策
  getCardRule(){
    const self = this
    app.request({
      url: app.apis.index,
      data: {

      }
    }).then(res => {
      console.log(res.data)
      if (res.data) {
        let contentData = res.data.global
        let article = contentData.card_policy;
        WxParse.wxParse('article', 'html', article, this, 5); // 实例化对象
        self.setData({
          cardRule: res.data.global
        })
      }
    }).catch(err => {

    })
  },

// 处理事件
  handlePopup(e) {
    console.log(e,1111)
    const {
      id
    } = e.currentTarget.dataset
    wx.setStorageSync("hotelTypeId", id)
    this.loadModelData(id)
  },
  loadModelData(id){
    const self = this
    const dateAll = wx.getStorageSync("dateInfo")
    const begin_time = dateAll[0]
    const end_time = dateAll[dateAll.length - 1]
    
    app.request({
      url: app.apis.loadModel,
      data: {
        id
      }
    }).then(res => {
      console.log(res.data)
      if (res.data) {
        let resData = res.data
        resData.price = app.utils.formatPrice(resData.price)
        self.setData({
          loadModel: resData,
          isShowType: true
        })
        self.selectComponent('#filter-date-up').getContains();
        self.selectComponent('#filter-date-up').getDateInfo();
        
      }
    }).catch(err => {

    })
    // 判断有没有房
    app.request({
      url: app.apis.checkHasRoom,
      data: {
        model_id: id,
        begin_time,
        end_time
      }
    }).then(res => {
      console.log(res.data.room_count, "剩余房数")
      if (res.data && res.data.room_count) {
        self.setData({
          roomCount: res.data.room_count
        })
      }

    }).catch(err => {

    })
  },

  typeInfo(data){
    wx.removeStorageSync("hotelTypeId")
    this.setData({
      isShowType: false
    })
    console.log(wx.getStorageSync("hotelTypeId"),"hotelTypeId1")
  },

  handleOrder(){
    // loadInfo
    app.request({
      url: app.apis.loadInfo,
    }).then(res => {
      console.log(res)
      if(!res.data.success){
        wx.navigateTo({
          url: '/pages/login/choose',
        })
      } else {
  if(this.data.isVip==1){
     this.handleOrderDetail()
     return
    }
    this.setData({
      isShowDialog: true
    })
      }
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/login/choose',
      })
    })
  
  },
  handleLeft(){
    const {
      isVip
    } = this.data
   
    if (isVip==1){
      this.handleOrderDetail()
    } else {
      app.utils.info("您还不是黑金卡会员")
      this.handleCard()
    }
  },

  handleOrderDetail(){
     // store_id,门店ID
    // id，房型id
    // name，房型名称
    // price，价格
    // cover
    // isname,民宿名称
    // begin,开始时间
    // end，结束时间
    // isnum,几天
    // is_deposit_pay 判断是否可以房费预定
    let arrss = []
    let loadModel = this.data.loadModel
    arrss = wx.getStorageSync("dateInfo")
    // console.log(arrss,"日期数据")
    const {
      isVip,

    } = this.data
    let member
    if (isVip == 1) {
      member = true
    } else {
      member = false
    }
    wx.navigateTo({
      url: `/pages/order/orderSubmit/index?store_id=${loadModel.store_id}&id=${loadModel.id}&name=${loadModel.name}&cover=${loadModel.cover}&isname=${this.data.loadStore.name}&num=${this.selectComponent("#filter-date-up").data.num}&begin=${arrss[0]}&end=${arrss[arrss.length - 1]}&isnum=${arrss.length - 1}&price=${loadModel.price}&member=${member}&is_deposit_pay=${this.data.loadStore.is_deposit_pay}`
    })
    this.setData({
      isShowDialog: false
    })
  },

  handleCard(){
    wx.navigateTo({
      url: '/pages/card/buy'
    })
  },

  // 处理滚动吸顶
  handleScroll(e){
    console.log(e.detail.scrollTop,"顶部距离")
    if (e.detail.scrollTop>150){
      this.setData({
        isTop: true
      })
    } else {
      this.setData({
        isTop: false
      })
    }
  },

  // 联系我们
  linkUs: function () {
    wx.showModal({
      title: '联系我们',
      content: '您可以微信搜索“半边山下”公众号留言提问',
      showCancel: false,
      confirmText: "好的",
      confirmColor: "#c19a55"
    })
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})