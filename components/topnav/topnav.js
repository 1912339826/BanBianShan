Component({
  properties: {
    header: {
      type: String,
      value: ""
    },
    isArrow: {
      type: Boolean,
      value: true
    },
    tolist: {
      type: String,
      value: ""
    }
  },
  data: {

  },
  methods: {
    goback() {
       this.triggerEvent('backInfo')
      if (this.data.tolist == '') {   
        wx.navigateBack({
          delta: 1
        })
      }

    }
  }
})