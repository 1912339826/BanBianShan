// pages/order/orderWay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'提交订单',
    time: 6 * 60 * 1000,
    radio:'1',
    activeIcon:'https://img.yzcdn.cn/vant/user-active.png',
    inactiveIcon:'https://img.yzcdn.cn/vant/user-inactive.png',
    money:5500,
    options: "",
    name:'豪华家庭复式套房',
    trade_no:''
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

  // 订单到时间了，关闭
  finish:function(id){
    if (this.options.iscard==true){
      wx.navigateBack({
        delta: 1
      })
    }else{
      app.request({
        url: app.apis.cancelOrder,
        data: {
          order_id: id
        }
      }).then(res => {
        wx.switchTab({
          url: "/pages/order/index"
        })
      })
    }
    
  },
  // 选择支付方式
  radioclick(event){
    this.setData({
      radio: event.target.id
    })
  },
  // 通过订单id获取订单详情中的创建订单的时间，时间到了发送取消请求取消订单
  timedetail:function(id){
    app.request({
      url: app.apis.load,
      data: {
        order_id: id
      }
    }).then(res => {
      console.log(res.data.data)
      if (res.data.success){
        // this.setData({
        //   time: parseInt(360 - (new Date().getTime() / 1000 - res.data.data.create_time))*1000,
        //   name: res.data.data.info.rooms[0].name
        // })
        // if (parseInt(new Date().getTime() / 1000 - res.data.data.create_time) > 360) {
        //   this.finish(options.order_id)
        // }
        
      }
      
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.options.iscard==true){
      this.setData({
        money: this.options.money,
        name: this.options.name
      })
    }else{
    const {
      order_id,
      trade_no,
      money
    } = this.data.options
    this.timedetail(order_id)
    this.setData({
      money: money
    })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
 
  // 支付按钮
  alipay: function () {
    const self = this;
    wx.login({
      //获取code换取openID
      success: function (res) {
        //code = res.code //返回code
        console.log("获取code");
        console.log(res.code);
        self.payclick(res.code)
      }
    })
  },

  //点击支付按钮进行支付
  payclick(open_id) {
    const self = this
    const {
      trade_no
    } = this.data.options
    console.log(open_id, trade_no)
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
      name,
      id,
      trade_no
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
              url: '/pages/pay/paySuccess/index?name=' + name + "&id=" + id + "&trade_no=" + trade_no
            })
          },
          fail(res) {
            console.log(res, "fail");
            wx.navigateTo({
              url: '/pages/pay/payResult/index',
            })
          }
        })
  
    // wx.requestPayment({
    //   timeStamp: param.timeStamp,
    //   nonceStr: param.nonceStr,
    //   package: param.package,
    //   signType: param.signType,
    //   paySign: param.paySign,
    //   success: function (res) {
    //     console.log("success");
    //     console.log(res,"success");
    //     wx.navigateTo({
    //       url: '/pages/pay/paySuccess/index?name=' + name + "&id=" + id + "&trade_no=" + trade_no 
    //     })
    //   },
    //   fail: function (res) {
    //     console.log("fail")
    //     console.log(res,"fail");
    //     wx.navigateTo({
    //       url: '/pages/pay/payResult/index',
    //     })
    //   },
    //   complete: function (res) {
    //     console.log("complete");
    //     console.log(res,"complete")
    //   }
    // })
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