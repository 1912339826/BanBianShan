// pages/orderSubmit/index.js
const app = getApp()
// 购物车商品
let arr = []
// 房费+押金
let nocart = 0;
// 购物车商品ID
let iscartidarr = [];
// 房价（不包含押金）
let housingprice = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trade_no:'',
    order_id:'',
    istrue: true,
    // 房型ID
    id: 961,
    // 商户ID
    store_id: 30,
    title: '提交订单',
    // 本页表单
    form: {
      name: '',
      phone: '',
      remark: ''
    },
    // 折扣方案
    columns: ['不使用', '普通用户'],
    optfor: '普通用户',
    // 折扣方案选择器的状态
    show: false,
    //  折扣方案默认选择
    defaultiIndex: '1',
    // 显示立即支付按钮
    changeType: 1,
    begin_time: '2019-12-28',
    end_time: '2019-12-29',
    // 几间房
    num: 1,
    wan: 1,
    // 门店名称
    store_name: '',
    // 房型名称
    name: '',
    // 房型单价
    roomcost: app.utils.formatPrice(8800),
    // 押金
    cashpledge: app.utils.formatPrice(12800),
    // 房型图片
    isimg: '',
    // 总价格
    sum: 0,
    // 是否为会员
    member: false,
    // 订房规则
    isclicknum: '1',
    // 商品数量
    shoppingnum: 0,
    //购物车商品集合
    shoppingarr: [],
    shoppingmoney:0,
    // 地址
    address: {
      name: '',
      phone: '',
      address: {
        // 详细地址
        address: "",
        // 地区
        region: '',
        // 街道
        street: ""
      }
    },
    // 购物车内容展示
    iscartcontent: false,
    // 选购黑金卡
    ismembercard: false,
    // 黑金卡列表
    ismembercardlist: [],
    radio: -1,
    options: ""
  },
  // 点击商品加号
  commodityclicknum: function (e) {
    let isobj = {}
    let money = 0
    let count = 0
    isobj = {
      id: e.detail.item.id,
      num: 1,
      img: e.detail.item.picture[0].url,
      description: e.detail.item.description,
      price: e.detail.item.price,
      prices: e.detail.item.price
    }
    //必需let，不存在变量提升
    let index = iscartidarr.indexOf(isobj.id)
    if (index > -1) {
      arr[index].num = isobj.num + arr[index].num
      arr[index].prices = isobj.prices + arr[index].prices
    } else {
      arr.push(isobj)
      iscartidarr.push(isobj.id)
    }


    this.setData({
      shoppingarr: arr
    })

    for (var i = 0; i < arr.length; i++) {
      money += Math.round(arr[i].prices*100)
      count += arr[i].num
    }
    this.setData({
      // 购物总价格
      sum: (money / 100).toFixed(2),
      shoppingmoney: (money / 100).toFixed(2),
      // 购物总数量
      shoppingnum: count
    })



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
      // member: options.member
    })
    wx.login({
      success(res){
        console.log(res)
      }
    })
    let strings = 'form.phone'
    if (isNaN(wx.getStorageSync("current-user").data.phone)){
      this.setData({
        [strings]: wx.getStorageSync("current-user").data.phone
      })
    }
   
  },
  // 绑定黑金卡
  bindingcard:function(){
    wx.navigateTo({
      url: '/pages/card/bind',
    })
  },
  // 点击购物车
  shoppingclick: function () {
    // 只有购物车存在商品时
    if (arr.length != 0) {
      if (this.data.iscartcontent) {
        this.setData({
          iscartcontent: false
        })
      } else {
        this.setData({
          iscartcontent: true
        })
      }
    }
  },
  iscartcontentclick: function () {
    this.setData({
      iscartcontent: false
    })
  },
  // 去地址页面
  gosite: function () {
    let box = this.data.address
    wx.navigateTo({
      url: `/pages/site/index?namevalue=${box.name}&phonevalue=${box.phone}&regionvalue=${box.address.region}&streetvalue=${box.address.street}&detailedvalue=${box.address.address}`
    })
  },

  // 会员点击单选
  isclick: function (e) {
    console.log(e)
    this.setData({
      isclicknum: e.detail
    })
    if (e.detail == "1") {
      // 点击押金订房时,用于提交的购物车清空，价格改为当前房价+押金
      this.setData({
        shoppingarr: [],
        sum: nocart
      })
    } else if (e.detail == "2"){
      console.log(arr)
      // 当点击免押金订房时，获取之前的购物车以及购物车的价格
      this.setData({
        shoppingarr:arr,
        sum: this.data.shoppingmoney
      })
    }
  },
  // 折扣方案按钮
  choice: function () {
    this.setData({
      show: true
    })
  },
  // 点击购物车中的删除
  cartdel: function (e) {
    // 非删除商品
    let isarr = []
    // 非删除商品ID
    let isnewcartidarr = []
    let box = this.data.shoppingarr
    for (var i = 0; i < box.length; i++) {
      if (box[i].id != e.target.dataset.isid) {
        isarr.push(box[i])
        isnewcartidarr.push(box[i].id)
      } else {
        this.setData({
          sum: (this.data.sum - box[i].prices).toFixed(2),
          shoppingmoney: (this.data.sum - box[i].prices).toFixed(2),
          shoppingnum: this.data.shoppingnum - box[i].num
        })
        console.log(this.data.shoppingnum)
      }
    }


    this.setData({
      shoppingarr: isarr
    })

    arr = this.data.shoppingarr
    iscartidarr = isnewcartidarr
    // 删到没有时，收起
    if (this.data.shoppingarr.length == 0) {
      this.setData({
        iscartcontent: false
      })
    }
  },
  // 点击立即支付触发
  changeTypenumber(event) {
    const {
      isclicknum
    } = this.data
    let arrs = []
    let objs = {}
    // 商品列表
    for (var i = 0; i < this.data.shoppingarr.length; i++) {
      objs = {
        id: `${this.data.shoppingarr[i].id}`,
        num: this.data.shoppingarr[i].num
      }
      arrs.push(objs)
    }
    this.blurInput()
    // 验证必填项是否填写
    if (this.blurInput()) {
      // 买的商品数量 要小于等于 几间房*几天
      // if (arrs.length > Number(this.data.sum) * Number(this.data.wan) || this.data.isclicknum=='1') {
        // app.toast(`多添加了${arrs.length - Number(this.data.sum) * Number(this.data.wan)}件商品！`)
      // } else {
        const that = this
        let isdata = {
          name: this.data.form.name,
          phone: this.data.form.phone,
          store_id: this.data.store_id, //"门店ID"
          rooms: [{
            model_id: this.data.id,
            begin_time: this.data.begin_time,
            end_time: this.data.end_time,
            num: this.data.num
          }],
          remark: that.data.form.remark,
          type: Number(this.data.isclicknum),
          // 商品
          goods: arrs,
          address: this.data.address
        }
        app.request({
          url: app.apis.create,
          data: isdata
        }).then(res => {
          if (res.data.success) {
            // wx.navigateTo({
            //   url: `/pages/order/orderWay/index?order_id=${res.data.order_id}&trade_no=${res.data.trade_no}&money=${this.data.sum}&iscard=false`
            // })
             // 触发支付流程
             console.log(res.data,"订单号")
            that.setData({
               order_id: res.data.order_id,
               trade_no: res.data.trade_no
             })
            that.alipay()
          } else {
            app.toast(`${res.data.msg}`)
          }
        })

      // }


    }

  },

  // 失去焦点时
  blurInput: function () {
    console.log(this.data.form)
    // 验证
    if (this.data.form.name == '' || this.data.form.phone == '') {
      app.utils.info('入住人信息不可为空')
      return false
    } else if (Number(this.data.isclicknum) == '2' && this.data.address.name == '') {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none'
      })
      return false
    }
    else {
      return true
    }
  },
  // 输入有变化时
  nameinputInput: function (value) {
    let name = "form.name"
    this.setData({
      [name]: value.detail
    })
  },
  phoneinputInput: function (value) {
    let phone = "form.phone"
    this.setData({
      [phone]: value.detail
    })
  },
  remarksinputInput: function (value) {
    let remark = "form.remark"
    this.setData({
      [remark]: value.detail
    })
  },


  onCancel: function () {
    // 点击了取消
    this.setData({
      show: false
    })

  },

  onClose: function () {
    this.setData({
      show: false
    })
  },
  onConfirm: function (event) {
    // 点击了确定
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(picker, value, index)
    this.setData({
      show: false,
      optfor: value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.member,'385')
  },
  // 购买黑金卡
  buycard: function () {
    this.setData({
      ismembercard: true
    })
    app.request({
      url: app.apis.pageList
    }).then(res => {
      console.log(res.data)
      let handleArr = []
      res.data.map(item => {
        item.price = app.utils.formatPrice(item.price)
        handleArr.push(item)
      })
      this.setData({
        ismembercardlist: handleArr
      })
      if (this.data.radio == -1) {
        this.setData({
          radio: res.data[0].id
        })
      }
    })
  },
  // 关闭
  ismembercardclose: function () {
    this.setData({
      ismembercard: false
    })
  },

  onChange: function (e) {
    console.log(e.detail)
    this.setData({
      radio: Number(e.detail)
    })
  },
  onChangelist: function (e) {
    console.log(e.currentTarget.dataset.isid)
    this.setData({
      radio: Number(e.currentTarget.dataset.isid)
    })
  },
  shoppingcard: function () {
    let name = ''
    let price = ''
    const that = this
    let box = this.data.ismembercardlist
    for (var i = 0; i < box.length; i++) {
      if (this.data.radio == box[i].id) {
        name = box[i].name
        price = box[i].price
      }
    }
    app.request({
      url: app.apis.cardBuy,
      data: {
        card_id: Number(this.data.radio)
      }
    }).then(res => {
        // wx.navigateTo({
        //   url: `/pages/order/orderWay/index?iscard=true&id=${this.data.radio}&money=${price}&name=${name}&trade_no=${res.data.trade_no}`
        // })
        // 触发支付流程
      that.setData({
          trade_no: res.data.trade_no
        })
      that.alipay()
      
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.request({
      url: app.apis.userBlackCardData
    }).then(res=>{
      console.log(res)
    })
    console.log(this.data.options)
    let box = this.data.options
    this.setData({
      begin_time: box.begin,
      end_time: box.end,
      isimg: box.cover,
      num: box.num,
      wan: box.isnum,
      store_name: box.isname,
      name: box.name,
      id: box.id,
      store_id: box.store_id,
      roomcost: (box.price),
      cashpledge: (box.price),
      sum: (Number(box.price)) * box.num * box.isnum,
      member: box.member
    })

    this.setData({
      is_deposit_pay: box.is_deposit_pay
    })
    console.log(box, "订单计算")
    nocart = (Number(box.price)) * box.num * box.isnum
    housingprice = (Number(box.price)) * box.num * box.isnum
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  alipay: function () {
    const self = this;
    console.log( "订单号11")
    wx.login({
      //获取code换取openID
      success: function (res) {
        //code = res.code //返回code
        console.log("获取code");
        console.log(res.code);
        self.payclick(res.code)
      }
    })
  },
  payclick(open_id) {
    const self = this
    app.request({
      url: app.apis.wxMiniPay,
      data: {
        trade_no: this.data.trade_no
      }
    }).then(res => {
      console.log(res.data)
      self.pay(res.data)
    })
  },
  //支付
  pay: function (payData) {
    // const {
    //   name,
    //   id,
    //   trade_no
    // } = this.data.options

    let that = this;
    console.log("发起支付")
    console.log(payData)
    wx.requestPayment({
      timeStamp: payData.timeStamp.toString(),
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success(res) {
        console.log(res);
        console.log(res, "success");
        wx.navigateTo({
          url: '/pages/pay/paySuccess/index?name=' + that.data.name + "&id=" + that.data.order_id
        })
      },
      fail(res) {
        console.log(res, "fail");
        wx.navigateTo({
          url: `/pages/pay/payResult/index?trade_no=${that.data.trade_no}&name=${that.data.name}&id=${that.data.order_id}`,
        })
      }
    })

    // wx.requestPayment({
    //   timeStamp: param.timeStamp,
    //   nonceStr: param.nonceStr,
    //   package: param.package,
    //   signType: param.signType,
    //   paySign: param.paySign,
    //   success: function (res) {
    //     console.log("success");
    //     console.log(res,"success");
    //     wx.navigateTo({
    //       url: '/pages/pay/paySuccess/index?name=' + name + "&id=" + id + "&trade_no=" + trade_no 
    //     })
    //   },
    //   fail: function (res) {
    //     console.log("fail")
    //     console.log(res,"fail");
    //     wx.navigateTo({
    //       url: '/pages/pay/payResult/index',
    //     })
    //   },
    //   complete: function (res) {
    //     console.log("complete");
    //     console.log(res,"complete")
    //   }
    // })
  },
})