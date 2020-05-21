// components/commodity/commodity.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tid:{
      type:Number,
      value:30
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr:[],
    price: 0
  },

  ready(){
    app.request({
      url: app.apis.goodsPage,
      data: { tid: this.data.tid}
    }).then(res=>{
      console.log(res.data,"商品数据")
      let handleArr = []
      res.data.data.map(item=>{
        item.price = app.utils.formatPrice(item.price)
        handleArr.push(item)
      })
      this.setData({
        arr: handleArr
      })
      console.log(this.data.arr,"31")
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(con){
      console.log(con.target.dataset.item)
      this.triggerEvent("commodityclicknum", { item: con.target.dataset.item})
    },
    // 点击商品（img）
    gothisdetails(e){
      // 获取对应的商品ID，此处建议实现跳转对应商品详情页面
      console.log(e.target.dataset.isid)
    }
  }
})
