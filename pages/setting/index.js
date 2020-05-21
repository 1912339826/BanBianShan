// pages/setting/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "设置",
    userInfo:false,
    head:false,
    bindWx:true,
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
      userInfo: data.data ? data.data : false
    })
  },

  handleTab(e) {
    if (!wx.getStorageSync("user-auth")) {
      wx.navigateTo({
        url: '/pages/login/choose',
      })
      return;
    }
    const type = e.currentTarget.dataset.type / 1
    let url
    switch (type) {
      case 1:
        url = '/pages/setting/edit/index'
        break
    }
    console.log(url)
    wx.navigateTo({
      url
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
  upHead: function () {
    if (!wx.getStorageSync("user-auth")) {
      wx.navigateTo({
        url: '/pages/login/choose',
      })
      return;
    }
    const that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.apiHost + '/user_center/open/v1/upload/thumb',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Authorization': "Bearer " + wx.getStorageSync("user-auth")
          },
          success(res) {
            const data = JSON.parse(res.data.replace(/\ufeff/g, ""))
            that.setData({
              head: data.url
            })
            wx.request({
              url: app.apiHost + '/user_center/api/v1/user/userEdit',
              header: {
                'cookie': wx.getStorageSync("sessionid"),
                'Authorization': "Bearer " + wx.getStorageSync("user-auth")
              },
              data: {
                head: data.url
              },
              success: function (res) {
                if (res.data.success) {
                  wx.request({
                    url: app.apiHost + '/user_center/api/v1/user/loadInfo',
                    header: {
                      'cookie': wx.getStorageSync("sessionid"),
                      'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                    },
                    success(re) {
                      wx.setStorageSync("current-user", re.data);
                    }
                  })
                }
              }
            })    
          }
        })
      }
    })
  },
  logout:function(){
    if (!wx.getStorageSync("user-auth")) {
      wx.navigateTo({
        url: '/pages/login/choose',
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认退出吗?',
      success(res){
        if (res.confirm) {
              wx.request({
                url: app.apiHost + '/user_center/api/v1/open/logout',
                header: {
                  'cookie': wx.getStorageSync("sessionid"),
                  'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                },
                success(res) {
                  if (res.data.success) {
                    wx.clearStorageSync("user-auth");
                    wx.clearStorageSync("current-user");
                    wx.navigateBack({

                    })
                  }
                }
              })
        }
      }
    })
  },
  changePhone:function()
  {
     wx.navigateTo({
       url: '/pages/login/changePhone',
     })
  }
})