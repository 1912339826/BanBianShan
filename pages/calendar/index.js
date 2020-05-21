const app = getApp();
const format = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "日期选择",
    // 日历参数
    dateAllInfo: {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate()
    },
    options: ""
  },

  getCalendarData(e) { // 监听日历数据
    console.log(66666666666, e.detail)
    // this.setData({
    //   checkTime: format.getDateList(e.detail)
    // })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  getList() {
    app.request({
      url: app.apis.roomMonth,
      data: {
        name: this.data.inputVal
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {

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