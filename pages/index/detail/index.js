const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "半边山下",
    options: "",
    contentData: ""
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
  onShow: function () {
    this.getList()
  },

  getList() {
    const self = this
    let {
      options,
      contentData
    } = this.data
    app.request({
      url: app.apis.articleLoad,
      data: {
        id: options.id
      }
    }).then(res => {
      console.log(res)
      let contentData = res.data
      let article = contentData.content;
      contentData.publish_time = app.utils.getDateDiff(contentData.publish_time)
      WxParse.wxParse('article', 'html', article, this, 5); // 实例化对象
      self.setData({
        contentData
      })
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