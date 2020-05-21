// components/shoppingCart/shoppingCart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shoppingnum: {
      type: Number,
      value: 0
    },
    shoppingarr: {
      type: Array,
      value: []
    },
    sum:{
      type:Number,
      value:0
    },
    need:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    getContainer: '',
    istrue: true,
    isheight: 'height:20%'
  },

  ready() {
    const query = wx.createSelectorQuery().selectAll('#aaaa')
    console.log(query)
    this.setData({
      getContainer: query
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
    shoppingclick() {
      this.triggerEvent('HYTshoppingclick')
    },
    changeType() {
      this.triggerEvent('HYTchangeType')
    }

  }
})
