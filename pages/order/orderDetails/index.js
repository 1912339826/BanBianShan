// pages/orderDetails/orderDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 倒计时显示或隐藏
    timeor: true,
    time: 6 * 60 * 1000,
    title: '订单详情',
    // 订单状态
    state: '',
    // 点击复制后，系统剪切板的内容
    copytxt: '',
    statecode: 1, // 1待付款，2待出行，3出行中，4已取消(5)，5已完成(4)
    //  门店名
    storename: '半山墅家·比伯里庄园',
    // 房间类型
    isname: '比伯里庄园',
    // 时间
    begin_time: '2019-11-12至2019-11-14',
    // 共几晚
    intervalinfo: '1晚',
    // 几间
    numinfo: '1间',
    // 入住人
    checkinperson: '孙妮',
    // 下单人手机号码
    phone: "11111111111",
    // 备注
    remark: '备注',
    // 订房规则：1押金租房(显示：押金)，2免押金租房（显示：商品抵扣押金）
    type: '',
    // 此页面的金额一项
    money: '6800',
    // 民宿的联系电话
    store_phone: '18115478525',
    // 订单编号
    order_num: '190910150933655946',
    // 下单时间
    create_time: '2019-11-19 00:00',
    // 是否支付成功
    tolist:'',
    // 订单ID
    ids:19710,
    secimg:'',
    // 商品列表
    iscommoditylist:[],
    // 商品收货地址
    address:'北京市东城区猪猪街道110号',
    // 收货人
    consignee:'孙孙',
    // 收货人联系方式
    consigneephone: 17890909090,
    // 包裹状态
    commoditystatus:0,
    // 包裹状态显示
    commoditystatustxt:'下单未支付',
    express:'快递公司',
    express_no:'这是单号'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.options.success =="success"){
      this.setData({
        tolist:'success'
      })
    }
    // 获取订单详情
    this.obtainload(this.options.id)
    // 获取商品列表和商品包裹信息
    this.commoditylist(this.options.id)
    this.setData({
      // 订单ID
      ids: this.options.id
    })

  },
  // 时间戳转时间(例:2019-10-10 14:43)
  totime: function(miao) {
    let datatime = '';
    if (miao.toString().length == 10) {
      datatime = new Date(miao * 1000)
    } else if (miao.toString().length == 13) {
      datatime = new Date(miao)
    }
    var y = datatime.getFullYear();
    var m = datatime.getMonth() + 1;
    var d = datatime.getDate();
    var h = datatime.getHours();
    var mi = datatime.getMinutes();
    m = m < 10 ? ("0" + m) : m;
    d = d < 10 ? ("0" + d) : d;
    return `${y}-${m}-${d} ${h}:${mi}`;
  },
  // 点击复制按钮
  copy: function(event) {
    // 设置系统剪切板的内容
    wx.setClipboardData({
      data: event.target.dataset.num,

      success(res) {
        wx.showToast({
          title: '内容已复制',
          icon: 'none'
        })
        //获取系统剪贴板内容
        wx.getClipboardData({
          success(res) {
            this.setData({
              copytxt: res.data
            })
          }
        })
      }
    })
  },

  // 取消订单(也是倒计时结束触发)
  finish: function(id) {
    app.request({
      url: app.apis.cancelOrder,
      data: {
        trade_no: id
      }
    }).then(res => {

      // 取消成功，再次获取订单详情
      if (res.data.success) {
        this.obtainload(this.data.ids)
      }

    })
  },
  // 点击立即支付，前往选择支付方式的页面
  goway:function(){
    wx.navigateTo({
      url: `/pages/order/orderWay/index?order_id=${this.options.id}`
    })
  },
  // 商品详情
  commoditylist:function(id){
    app.request({
      url: app.apis.orderLoad,
      data:{
        room_order_id:id
      }
    }).then(res=>{
      let box = res.data.data
      let region = '' 
      box.address.region.split(" ").map(item=>{
        region = `${region}${item}`
      })
      box.content.map(item=>{
        item.prices = app.utils.formatPrice(item.price)
      })
      this.setData({
        iscommoditylist:box.content,
        address: `${region}${box.address.street}${box.address.address}`,
        consignee: box.user_name,
        consigneephone:box.phone,
        commoditystatus: box.status,
        express: box.express,
        express_no: box.express_no
      })
      // 判断显示订单状态
      if (this.data.commoditystatus==0){
        this.setData({
          commoditystatustxt:'下单未支付'
        })
      } else if (commoditystatustxt==1){
        this.setData({
          commoditystatustxt:'未发货'
        })
      } else if (commoditystatustxt==2){
        this.setData({
          commoditystatustxt:'已发货'
        })
      } else if (commoditystatustxt==3){
        this.setData({
          commoditystatustxt:'确认收货'
        })
      }
    })
  },

  // 根据订单ID，获取订单详情
  obtainload: function(id) {
    const that = this;
    app.request({
      url: app.apis.load,
      data: {
        order_id:id
      }
    }).then(res => {
      let box = res.data.data
     
      if (res.data.success) {
        if (box.status != 1) {
          // 非待付款状态时暂停倒计时
          this.selectComponent("#CountDown").pause()
          this.setData({
            timeor: false
          })
        } else {
          this.setData({
            time: parseInt(360 - (new Date().getTime() / 1000 - box.create_time)) * 1000
          })
          console.log(this.data.time,"rest time")
          // 未付款的订单超过6分钟,执行取消订单事件
          if (parseInt(new Date().getTime() / 1000 - box.create_time) > 360) {
            this.finish(box.trade_no)
          }
        }
        console.log("----------------------------------")
        console.log(box, '--------------------------')
        this.setData({
          state: box.status_show,
          storename: box.info.store_name,
          isname: box.info.rooms[0].name,
          secimg: box.info.rooms[0].cover,
          begin_time:box.info.begin_time,
          intervalinfo: box.info.rooms[0].info.split(" ")[1],
          numinfo: box.info.rooms[0].info.split(" ")[0],
          checkinperson: box.name,
          phone: box.phone,
          remark: box.remark,
          money: app.utils.formatPrice(box.money) ,
          store_phone: box.store_phone,
          order_num: box.order_num,
          create_time: that.totime(box.create_time),
          type: box.type
        })

      }
    })
  },

  backInfo(){
    wx.switchTab({
      url: "/pages/order/index"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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