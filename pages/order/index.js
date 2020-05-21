const app = getApp();
const format = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "订单列表",
    active: 0,
    swipethreshold: 5,
    // 列表数据的条数
    total: '',
    listarr: [],
    isfalse: false,
    // 分页参数
    page: 1,
    step: 20,
    hasMoreData: true
  },

  onChange(event) {
    console.log(event.detail.index)
    console.log(this.data.active)
    // 1待付款，2待出行，3出行中，4已取消(5)，5已完成(4)
    let number = 0;
    if (event.detail.index == 4) {
      number = 5;
      this.setData({
        active:5
      })
    } else if (event.detail.index == 5) {
      number = 4;
      this.setData({
        active: 4
      })
    } else {
      number = event.detail.index
      this.setData({
        active: event.detail.index
      })
    }
    this.getlist(number)
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
    // 获取订单列表
    this.getlist(0)
  },

  getlist: function (number) {
    this.setData({
      listarr:[]
    })
    wx.showLoading({
      title: '加载中',
    })
    const self = this
    let {
      page,
      step,
      listarr
    } = this.data
    app.request({
      url: app.apis.page,
      data: {
        status: number,
        page,
        step
      }
    }).then(res => {

      wx.hideLoading()
      let resData = res.data

      resData.data.map(item => {
        item.moneys = app.utils.formatPrice(item.money)
      })
      if (resData.total >= 0) {
        let contentDatas = resData.data

        if (contentDatas.length < step) {
          self.setData({
            listarr: listarr.concat(contentDatas),
            hasMoreData: false
          })
        } else {
          self.setData({
            listarr: listarr.concat(contentDatas),
            hasMoreData: true,
            page: page + 1
          })
        }
      }

      this.setData({
        total: res.data.total
      })
      console.log(this.data.listarr)
      for (var i = 0; i < this.data.listarr.length; i++) {
        console.log(this.data.listarr[i].status)
        //   // 在代付款状态的订单，判断是否超时，超时取消订单
        if (this.data.listarr[i].status == 1) {
          // 超时取消订单
          if (parseInt(new Date().getTime() / 1000 - this.data.listarr[i].create_time) > 360) {
            this.finish(this.data.listarr[i].trade_no)
          }
        }
      }
    })
  },
  // 超时取消订单
  finish: function (id) {
    app.request({
      url: app.apis.cancelOrder,
      data: {
        trade_no: id + ""
      }
    }).then(res => {
      this.onLoad()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getlist(this.data.active)
    this.setData({
      listarr: []
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
      listarr: []
    })
    this.getlist()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getlist()
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})