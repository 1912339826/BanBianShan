const app = getApp()
Component({
  properties: {
    listItem: {
      type: Object,
      value: {}
    }
  },
  data: {
    isFind: false,
    price: 0
  },

  ready() {
    this.setData({
      price: app.utils.formatPrice(this.data.listItem.price)
    })
  },

  methods: {
    handleTab(){
      if (this.data.listItem.reserve==1){
        return
      }
      wx.setStorageSync("hotelTypeId",this.data.listItem.id)
      const url = "/pages/calendar/index"
      wx.navigateTo({
        url
      })
    }
  }
})