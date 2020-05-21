const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "游玩攻略",
    page: 1,
    step: 20,
    list: [],
    hasMoreData: true
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
    this.getList()
  },

  getList(){
    wx.showLoading({
      title: '加载中',
    })
    const self = this
    let {
      page,
      step,
      list
    } = this.data
    app.request({
      url: app.apis.articlePage,
      data: {
        page,
        step
      }
    }).then(res => {
      wx.hideLoading()
      const resData = res.data
      if (resData.total >= 0) {
        let contentDatas = resData.data
       
        if (contentDatas.length < step) {
          self.setData({
            list: list.concat(contentDatas),
            hasMoreData: false
          })
        } else {
          self.setData({
            list: list.concat(contentDatas),
            hasMoreData: true,
            page: page + 1
          })
        }
      } 
      }).catch(err => {
        wx.hideLoading()
      })

  },


  // handleDetail
  handleDetail(e) {
    const {
      id
    } = e.currentTarget.dataset.info
    console.log(e)
    wx.navigateTo({
      url: '/pages/index/detail/index?id='+ id,
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
    this.setData({
      page: 1,
      list: []
    })
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getList()
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})