// pages/order/ordersuccessresult/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'结果详情',
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.request({
      url: app.apis.paySuccess,
      data: {
        trade_no: "64b13f22d23fbbccea89ac556fe7549e"
      }
    }).then(res => {
      console.log(res)
    })
  },
  look:function(){
    wx.navigateTo({
      url: `/pages/order/orderDetails/index?id=${19591}&success=success`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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