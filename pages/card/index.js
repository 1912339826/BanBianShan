// pages/card/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "卡片记录",
    active: 0,
    swipethreshold: 2,
    buyLog:false,
    useLog:false,
    tabShow:0
  },

  handleChange(e) {
    console.log(e.detail)
    if (e.detail.index == 0){
       this.setData({
         tabShow:0
       })
    } 

    if (e.detail.index == 1){
      this.setData({
        tabShow: 1
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
      wx.request({
        url: app.apiHost + '/minsu/api/BlackCard/buyCardRecordList',
        header: {
          'cookie': wx.getStorageSync("sessionid"),
          'Authorization': "Bearer " + wx.getStorageSync("user-auth")
        },
        success(res){
            console.log(res.data);
            that.setData({
               buyLog:res.data.data
            })
        }
      }) 
    wx.request({
      url: app.apiHost + '/minsu/api/BlackCard/cardUseRecordList',
      header: {
        'cookie': wx.getStorageSync("sessionid"),
        'Authorization': "Bearer " + wx.getStorageSync("user-auth")
      },
      success(res) {
        console.log(res.data);
        that.setData({
          useLog: res.data.data
        })
      }
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