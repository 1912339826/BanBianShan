// pages/login/register.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     nickname:'',
     avatar:'',
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
  release:function()
  {
     this.setData({
       nickname:''
     })
  },
  bindNickName: function (evt){
    this.setData({
      nickname: evt.detail.value
    });
  },
  uploadAvatar:function(){
    const that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.apiHost + '/user_center/open/v1/upload/thumb', 
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data.replace(/\ufeff/g, ""))
            that.setData({
               avatar:data.url
            }) 
          }
        })
      }
    })
  },
  onLogin:function(){
      var that = this;
      var data = {
        nickname:that.data.nickname,
        head    :that.data.avatar
      }
      wx.request({
        url: app.apiHost +'/user_center/api/v1/open/changeNameHead',
        header: {
          'Authorization': "Bearer " + wx.getStorageSync("user-auth")
        },
        data:data,
        success(res){
          console.log(res);
          if (res.data.success){
            wx.request({
              url: app.apiHost + '/user_center/api/v1/user/loadInfo',
              header: {
                'cookie': wx.getStorageSync("sessionid"),
                'Authorization': "Bearer " + wx.getStorageSync("user-auth")
              },
              success(re) {
                wx.setStorageSync("current-user", re.data);
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/mine/index'
                  })
                }, 1000)
              }
            })
          }
        }
      })
  }
})