const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "修改昵称",
    nickname: ""
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
    var data = wx.getStorageSync("current-user");
    this.setData({
      nickname: data.data ? data.data.nickname : false
    })
  },

  handleChange(e){
    var nickname  = e.detail;
    this.setData({
      nickname:nickname
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

  },
  upNickName:function(){
    var that = this;
     wx.request({
       url: app.apiHost + '/user_center/api/v1/user/userEdit',
       header: {
         'cookie': wx.getStorageSync("sessionid"),
         'Authorization': "Bearer " + wx.getStorageSync("user-auth")
       },
       data:{
         nickname:that.data.nickname
       },
       success:function(res){
           if (res.data.success){
                wx.request({
                  url: app.apiHost + '/user_center/api/v1/user/loadInfo',
                  header: {
                    'cookie': wx.getStorageSync("sessionid"),
                    'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                  },
                  success(re) {
                    wx.setStorageSync("current-user", re.data);
                    wx.navigateBack({
                      
                    })
                  }
                })
           }
       }
     })    
  },
 
})