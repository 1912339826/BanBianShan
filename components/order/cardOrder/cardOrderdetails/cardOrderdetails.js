// components/cardOrder/cardOrder/cardOrderdetails.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  门店名
    storename:{
      type: String,
      value:'半山墅家·比伯里庄园'
    },
     // 房间类型
     isname:{
       type: String,
       value: '比伯里庄园'
     },
     // 时间
    begin_time:{
      type: String,
      value: '2019-11-12至2019-11-14'
    },
    // 共几晚
    intervalinfo:{
      type: String,
      value: '1晚'
    },
    // 几间
    numinfo:{
      type: String,
      value: '1间'
    },
    secimg:{
      type: String,
      value: 'https://static.dingdandao.com/260c2c147b5d331fcc151fd272481ac7'
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    //  门店名
    storename: '半山墅家·比伯里庄园',
    // 房间类型
    isname: '比伯里庄园',
    // 时间
    begin_time: '2019-11-12至2019-11-14',
    // 共几晚
    intervalinfo: '1晚',
    // 几间
    numinfo: '1间'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
