// pages/search/searchMain/index.js
const app = getApp();
Page({
  data: {
    title: "搜索名称",
    inputVal: "",
    isHistory: true,
    typeList:[],
    searchList: []
  },

  handleChange(e) {
    console.log(e)
    this.setData({
      inputVal: e.detail
    })
    if (e.detail){
      this.getList()
    }
   
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 

  getList(){
    const self = this
    const {
      inputVal
    } = this.data
    app.request({
      url: app.apis.searchKeys,
      data: {
        name: inputVal,
      }
    }).then(res => {
      console.log(res)
      self.setData({
        isHistory: false,
        searchList: res.data
      })
    }).catch(err => {

    })
  },

  onShow: function () {
    if(wx.getStorageSync("historySearch")){
      this.setData({
        typeList: wx.getStorageSync("historySearch")
      })
    }
  },
  // 事件
  handleSearch(e){
    let {
      typeList
    } = this.data
    const {
      info
    } = e.currentTarget.dataset
    let idArr = []
    typeList.map(item=>{
      idArr.push(item.id)
    })
    if (idArr.indexOf(info.id)==-1){
      typeList.unshift(info)
    }
    this.setData({
      typeList
    })
    wx.setStorageSync("historySearch", typeList)
    wx.setStorageSync("searchInfo", info)
    wx.navigateTo({
      url: '/pages/search/index'
    })

  },
  handleTab(e){
    const {
      info
    } = e.currentTarget.dataset
    wx.setStorageSync("searchInfo", info)
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },


  onCancel(e) {
    this.setData({
      isHistory: true,
      inputVal: ""
    })
  },

  handleDel(){
    this.setData({
      typeList: []
    })
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

  }
})