// pages/site/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "收货地址",
    namevalue: '',
    phonevalue: '',
    regionvalue: '',
    streetvalue: '',
    detailedvalue: '',
    show: false,
    areaList: app.area
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },
  // 输入框内容输出
  nameinput: function (e) {
    this.setData({
      namevalue: e.detail
    })
  },
  phoneinput: function (e) {
    this.setData({
      phonevalue: e.detail
    })
  },
  streetinput: function (e) {
    this.setData({
      streetvalue: e.detail
    })
  },
  detailedinput: function (e) {
    this.setData({
      detailedvalue: e.detail
    })
  },

  regionclick: function () {
    this.setData({
      show: true
    })
  },
  // 点击选择的确认
  confirm: function (e) {
    let arr = ''
    for (var i = 0; i < e.detail.values.length; i++) {
      arr = `${arr}${e.detail.values[i].name} `
    }
    this.setData({
      regionvalue: arr,
      show: false
    })
  },
  yesclick: function () {
    let arrs = {};
    arrs = {
      name: `${this.data.namevalue}`,
      phone: `${this.data.phonevalue}`,
      address: {
        address: `${this.data.detailedvalue}`,
        region: `${this.data.regionvalue}`,
        street: `${this.data.streetvalue}`
      }
    }

    let pages = getCurrentPages();
    // prevPage获取上一个页面的js里面的pages的所有信息，-2是上一个页面，-3是上上个页面以此类推
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      address: arrs
    })

    if (arrs.name != '' && arrs.phone != '' && arrs.address.address != '' && arrs.address.region != '' && arrs.address.street != '') {
      wx.navigateBack({

        delta: 1 // 返回上一级页面。

      })
    } else {
      wx.showToast({
        title: '不能留空!',
        icon: 'none'
      })
    }

  },
  cancel: function () {
    this.setData({
      show: false
    })
  },
  // 点击遮罩层
  clickoverlay: function () {
    this.setData({
      show: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (isNaN(wx.getStorageSync("current-user").data.phone)) {
      this.setData({
        phonevalue: wx.getStorageSync("current-user").data.phone
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let { namevalue, phonevalue, regionvalue, streetvalue, detailedvalue } = this.options
    this.setData({
      namevalue, phonevalue, regionvalue, streetvalue, detailedvalue
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})