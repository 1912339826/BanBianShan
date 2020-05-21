const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "结果详情",
    options: ""
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
  handleback:function(){
    wx.switchTab({
      url: '/pages/order/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.alipay()
  },
  alipay: function () {
    const self = this;
    wx.login({
      //获取code换取openID
      success: function (res) {
        console.log("获取code");
        console.log(res.code);
        self.payclick()
      }
    })
  },
  payclick() {
    const self = this
    const {
      trade_no
    } = this.data.options
    app.request({
      url: app.apis.wxMiniPay,
      data: {
        trade_no
      }
    }).then(res => {
      console.log(res.data)
      self.pay(res.data)
    })
  },
  //支付
  pay: function (payData) {
    const {
      id,
      trade_no,
      name
    } = this.data.options
    let that = this;
    console.log("发起支付")
    console.log(payData)
    wx.requestPayment({
      timeStamp: payData.timeStamp.toString(),
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success(res) {
        console.log(res);
        console.log(res, "success");
        wx.navigateTo({
          url: '/pages/pay/paySuccess/index?name=' +name + "&id=" + id
        })
      },
      fail(res) {
        console.log(res, "fail");
        // this.onLoad()
        this.handleback()
        // wx.navigateTo({
        //   url: `/pages/pay/payResult/index?trade_no=${trade_no}`,
        // })
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