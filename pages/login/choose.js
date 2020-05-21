// pages/login/choose.js
const app = getApp()
Page({
   

  /**
   * 页面的初始数据
   */
  data: {

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
  goIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goPhoneLogin:function()
  {
    wx.navigateTo({
      url: '/pages/login/phoneLogin',
    })
  },
  goAuth:function()
  {
    wx.navigateTo({
      url: '/pages/login/auth',
    })
  },
  onGetUserPhoneNumber: function (phonenumres)
  {
    console.log(phonenumres);
    wx.login({
      success(loginres) {
        // console.log(loginres);
        if (loginres.code) {
          var code = loginres.code + '';
          // console.log(code);
          if (phonenumres.detail.errMsg === 'getPhoneNumber:ok') {
            wx.request({
              url: app.apiHost + '/weixin_center/api/miniApp/login',
              data: { code: code },
              success(rs) {
                // console.log(rs.header["Set-Cookie"]);
                wx.setStorageSync('sessionid', rs.header["Set-Cookie"]);
                if (rs.data.success) {
                  wx.request({
                    url: app.apiHost + '/weixin_center/api/miniApp/userPhoneBind',
                    header: {
                      'cookie': wx.getStorageSync("sessionid")
                    },
                    data: {
                      encrypted_data: phonenumres.detail.encryptedData,
                      iv: phonenumres.detail.iv
                    },
                    success(res) {
                      // console.log(res);
                      // console.log(res['data']['auth-token']);
                      wx.setStorageSync('user-auth', res['data']['auth-token']);
                      wx.request({
                        url: app.apiHost + '/weixin_center/api/miniApp/syncOpenId',
                        header: {
                          'cookie': wx.getStorageSync("sessionid"),
                          'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                        },
                        success(result){
                              //未注册
                              if (!res.data.has_register) {
                                wx.navigateTo({
                                  url: '/pages/login/register',
                                })
                              } else {
                                app.toast('授权成功');
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
                } else {
                  getApp().toast('取消授权不能正常使用小程序哦~');
                }
              }
            })
          }
        }
      }
    })
  }

})