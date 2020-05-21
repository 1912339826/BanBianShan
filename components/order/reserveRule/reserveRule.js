// components/order/reserveRule/reserveRule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否为会员
    member:{
      type: Boolean,
      value: false
    },
    is_deposit_pay: {
      type: Number,
      value: 2
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 单选默认第一项
    radio: '1',
    colorone:'color: #C19A55;font-size: 28rpx;',
    colortwo:'color: #666666;font-size: 28rpx;',
    optionsboxone:'border: 1rpx solid #C19A55;',
    optionsboxtwo:'border: 1rpx solid #999999;'
  },

  ready(){
    console.log(this.data.member,"是否是会员")
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log(event.detail)
      this.setData({
        radio: event.detail
      })
      if(this.data.radio=="1"){
        this.setData({
          colorone:"color: #C19A55;",
          colortwo: "color: #666666",
          optionsboxone:'border: 1rpx solid #C19A55;',
          optionsboxtwo:'border: 1rpx solid #999999;'
        })
      }else{
        this.setData({
          colortwo: "color: #C19A55;",
          colorone: "color: #666666",
          optionsboxone: 'border: 1rpx solid #999999;',
          optionsboxtwo: 'border: 1rpx solid #C19A55;'
        })
      }
      // 设置系统剪切板的内容
      // wx.setClipboardData
      this.triggerEvent("isclick", event.detail)
    }
  }
})