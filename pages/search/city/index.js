const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "城市列表",
    indexList: [],
    cityList: [],
    scrollTop: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
    this.showBusy()
  },
  showBusy: function () {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
    })
  },

  handleAll(){
    wx.setStorageSync("cityData", { city_name: "全部城市", city_code: "0" })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  getList(){
    const self = this
    app.request({
      url: app.apis.city
    }).then(res => {
      console.log(res)
      self.handleData(res.data)
    }).catch(err => {

    })
  },

  handleData(arr){
    let {
      indexList,
      cityList
    } = this.data
    let indexArr = []
    let cityArr = []
    let alpList = []
    let currentIndex
    arr.map(item=>{
      currentIndex = indexArr.indexOf(item.pingyin_index) 
      if (currentIndex == -1){
        indexArr.push(item.pingyin_index)
        cityArr.push({
           name: item.pingyin_index,
           children: [{
             city: item.name,
             checked: false,
             index: 0,
            ...item
           }]
         })
      } else {
        cityArr[currentIndex].children.push({
          city: item.name,
          checked: false,
          index: cityArr[currentIndex].children.length,
          ...item
        })
      }
    })
    alpList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"]
    alpList.map(item=>{
      currentIndex = indexArr.indexOf(item)
      if (currentIndex!=-1){
        cityList.push(cityArr[currentIndex])
        indexList.push(indexArr[currentIndex])
      }
    })
    // 已选城市判断
    let changeInfo
    if (wx.getStorageSync("cityData")){
      changeInfo = wx.getStorageSync("cityData")
      console.log(changeInfo.city_code,"城市code参数")
      if (changeInfo.city_code != "0"){
        cityList.map(item => {
          item.children.map(itemC => {
            if (itemC.name == changeInfo.city_name) {
              itemC.checked = true
            }
          })
        })
      }
    }
    wx.hideLoading()
    this.setData({
      indexList,
      cityList
    })
    console.log(indexList,cityList)
   
  },

  handleCity(e){
    let {
      cityList
    } = this.data
    const {
      info,
      index
    } =  e.currentTarget.dataset
    console.log(info, index)
    console.log(cityList[index].children[info.index])
    cityList[index].children[info.index].checked = true
    this.setData({
      cityList
    })
    wx.setStorageSync("cityData", { ...info, city_name: info.name, city_code: info.code})
    wx.navigateBack({
      delta: 1
    })
  },

  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    });
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

  }
})