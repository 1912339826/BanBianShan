// components/order/unsubscribepolicy/unsubscribepolicy.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    card_policy:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready(){
    // 获取退订政策
    let str = ''
    app.request({
      url: app.apis.index
    }).then(res=>{
      str = res.data.global.card_policy
      this.setData({
        card_policy: str.split("<p>")[1].split("<br>")[0]
      })
    })
    
  }
})
