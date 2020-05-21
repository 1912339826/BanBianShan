const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listItem: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    low_price: 0
  },
  ready(){
    this.setData({
      low_price: app.utils.formatPrice(this.data.listItem.low_price)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(){
      const {
        store_id
      } = this.data.listItem
      wx.navigateTo({
        url: '/pages/details/index?id=' + store_id,
      })
    }
  }
})
