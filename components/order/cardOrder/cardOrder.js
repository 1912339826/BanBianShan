// components/cardOrder/cardOrder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 1待付款，2待出行，3出行中，4已取消，5已完成
    store_name: { type: String, value:'半山墅家·比伯里庄园'},
    status_show: { type: String, value: '等待付款' },
    status: { type: Number, value: 1 },
    isname: { type: String, value: '比伯里庄园' },
    begin_time: { type: String, value: '2019-11-12至2019-11-14' },
    roosinfodays: { type: String, value: "1晚" },
    roosinfonums: { type: String, value: '1间' },
    money: { type: Number, value: 12400 },
    srcimg: { type: String, value: "/public/banner/01.png" },
    isid: { type: String, value: '0' },
    trade_no: { type: String, value: '0' }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPay(){
      console.log(this.data.isid)
      wx,wx.navigateTo({
        url: `/pages/order/orderDetails/index?id=${this.data.isid}&trade_no=${this.data.trade_no}`
      })
    }
  }
})
