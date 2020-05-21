Component({
  properties: {
    // 0查看房型,1立即支付（待付款）
    changeType: {
      type: Number,
      value: 0
    },
    sum:{
      type: Number,
      value:0
    },
    mychnageType:{
      type: Number,
      value: 0
    }
  },
  data: {
    
  },
  methods: {
    btnClick(){
      if (this.data.changeType==0){
        this.triggerEvent('changeType', this.data.changeType) 
      } else if (this.data.changeType == 1){
        this.triggerEvent('HYTchangeType', this.data.changeType) 
      }
    }
  },
  // 组件挂载后执行
  ready:function(){
    // console.log(this)
  }
})