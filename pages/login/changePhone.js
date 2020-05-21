// pages/login/changePhone.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     userInfo:false,
     phone:'',
    dataPosting:false,
    hideImgCodeError: true,
    captchaCode:'',
    validCode:'',
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
  bindPhone: function (evt) {
    this.setData({
      phone: evt.detail.value
    });
  },
  bindCaptchaCode: function (evt) {
    this.setData({
      captchaCode: evt.detail.value
    });
  },
  onShowValidImg: function () {
    console.log(this.data.phone);
    if (this.data.phone == '' || this.data.phone.length != 11 || !app.validatePhoneNumber(this.data.phone)) {
      app.toast('请输入正确的手机号');
      return;
    };
    this.refreshCaptcha();
    this.setData({
      captchaCode: '',
      showImgCode: true
    });
    // console.log(this.data.showImgCode);
  },
  refreshCaptcha: function () {
    // 获取图形验证码，返回的格式为base64
    if (!this.data.dataPosting) {
      this.setData({
        dataPosting: true
      });
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: app.apiHost + '/sms/api/captcha?t=' + Math.random(),
        header: {
            'cookie': wx.getStorageSync("sessionid")
        },
        responseType: 'arraybuffer',
        success: (res) => {
          wx.hideLoading();
          this.setData({
            dataPosting: false
          });
          var cookie = res.header["Set-Cookie"];
          // console.log(res);
          // console.log(res.header["Set-Cookie"]);
          if (cookie != null) {
            wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
          }
          var base64 = wx.arrayBufferToBase64(res.data);
          base64 = 'data:image/jpeg;base64,' + base64;
          this.setData({
            captchaCode: '',
            captchaImg: base64,
          });
        },
        fail: (res) => {
          wx.hideLoading();
          app.mag.alertWithNoCancelBtn('请求出错，请稍后再试~');
        }
      });
    }
  },
  onGetcode: function () {
    var that = this;
    if (that.data.phone == '' || that.data.phone.length != 11 || '' == that.data.captchaCode ||  !app.validatePhoneNumber(that.data.phone)) return;
    if (!that.data.dataPosting) {
      that.setData({
        dataPosting: true
      });
      // 获取手机验证码
      wx.request({
        url: app.apiHost + '/sms/api/sendCode',
        header: {
          'cookie': wx.getStorageSync("sessionid"),
          'Authorization': "Bearer " + wx.getStorageSync("user-auth")
        },
        data: {
          screen: 'mobile',
          phone: that.data.phone,
          code: that.data.captchaCode
        },
        // needLoadingIndicator: true,
        success(res) {
          var msg = '发送成功';
          console.log(res.data.success);
          if (res.data.success) {
            that.setData({
              showImgCode: false,
              time: 60,
              captchaCode: '',
            });
            var timer = setInterval(() => {
              that.setData({
                time: --that.data.time
              });
              if (that.data.time < 1) {
                clearInterval(timer);
                that.setData({
                  time: 0
                });
              }
            }, 1000);
            that.setData({
              dataPosting: false
            });
          } else {
            msg = res.msg || '发送失败';
            that.setData({
              dataPosting: false
            });
          }
          app.toast(msg);
        }

      });
    }
  },
  bindValidCode: function (evt) {
    this.setData({
      validCode: evt.detail.value
    });
  },
  upPhone:function(){
    var that = this;
      wx.request({
        url: app.apiHost + '/user_center/api/v1/user/bindPhone',
        header: {
          'cookie': wx.getStorageSync("sessionid"),
          'Authorization': "Bearer " + wx.getStorageSync("user-auth")
        },
        data:{
          phone:that.data.phone,
          code:that.data.validCode
        },
        success(res){
          if (res.data.success){
            app.toast("换绑成功")
            wx.request({
              url: app.apiHost + '/user_center/api/v1/user/loadInfo',
              header: {
                'cookie': wx.getStorageSync("sessionid"),
                'Authorization': "Bearer " + wx.getStorageSync("user-auth")
              },
              success(re) {
                wx.setStorageSync("current-user", re.data);
                //手机号码是否注册 0已注册 
                wx.redirectTo({
                  url: '/pages/setting/index',
                })
              }
            })
          }
        }
      })
  },
  closeDialog: function () {
    this.setData({
      showImgCode: false
    });
  }
})