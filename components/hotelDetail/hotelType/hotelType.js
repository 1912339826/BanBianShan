const app = getApp()
Component({
  properties: {
    loadModel: {
      type: Object,
      value: {}
    },
    roomCount: {
      type: Number,
      value: 0
    }
  },
  data: {
    isFind: false,

    currentIndex: 0,
    num: 1,
   
    isShowText: false,
    matchContains: [],

   
  },
  ready(){
   
  },

  methods: {
    getContains(){
      const {
        detail
      } = this.data.loadModel
      let matchContains = []
      console.log(matchContains, detail.match_contains, "匹配图标")
    
      if (detail && detail.match_contains.length > 0) {
        matchContains = app.utils.getIcon(detail.match_contains)
      }
     
      this.setData({
        matchContains
      })
    },
    getDateInfo(){
      this.selectComponent('#filter-date').getDateInfo();
      this.setData({
        num: 1
      })
    },
    swiperChange(e){
      this.setData({
        currentIndex: e.detail.current
      })
    },

    changeText() {
      this.setData({
        isShowText: !this.data.isShowText
      })
    },

    handleAdd(e){
      console.log(e)
      let {
        roomCount,
        num,
        loadModel
      } = this.data
      if (roomCount==0){
        return
      }
      const {
        type
      } = e.currentTarget.dataset
      if(type=="2"){
        if (num == roomCount){
          app.utils.info(`亲~~,房型只剩下${num}间,您可以看看其它房型`)
          return
        } else {
          num++
        }
      } else {
        if (num == 1) {
          app.utils.info('不能再少啦')
          return
        } else {
          num--
        }
      }
      this.setData({
        num
      })
    },

    handleClose(){
      wx.removeStorageSync("hotelTypeId")
      this.triggerEvent('typeInfo',true)
    },

    

  }
})