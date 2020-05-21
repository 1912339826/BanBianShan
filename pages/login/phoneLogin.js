// page/user/phoneLogin.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        codeLoading: false,
        time: 0,
        phone: "",
        showImgCode: false,
        captchaImg: "",
        hideImgCodeError: true,
        captchaCode: "",
        dataPosting: false,
        validCode: '',
        actionFrom: '',
        session_id: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    bindValidCode: function(evt) {
        this.setData({
            validCode: evt.detail.value
        });
    },
    bindPhone: function(evt) {
        this.setData({
            phone: evt.detail.value
        });
    },
    bindCaptchaCode: function(evt) {
        this.setData({
            captchaCode: evt.detail.value
        });
    },
    onShowValidImg:function() {
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
    refreshCaptcha: function() {
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
                  'cookie': wx.getStorageSync("sessionid"),
                  'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                },
                responseType: 'arraybuffer',
                success: (res) => {
                    wx.hideLoading();
                    this.setData({
                        dataPosting: false
                    });
                    var cookie = res.header["Set-Cookie"];
                  console.log(res);
                  console.log(res.header["Set-Cookie"]);
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
    onGetcode: function() {
      var that = this;
      if (that.data.phone == '' || that.data.phone.length != 11 || '' == that.data.captchaCode || !app.validatePhoneNumber(that.data.phone)) return;
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
                data:{
                  screen: 'mobile',
                  phone: that.data.phone,
                  code: that.data.captchaCode
                },
                // needLoadingIndicator: true,
                success (res) {
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
            // () => {
            //   that.setData({
            //         dataPosting: false
            //     });
            // };
        }
    },
    onLogin: function() {
      var that = this;
      if (!app.validatePhoneNumber(that.data.phone)) {
            app.toast('请输入正确的手机号');
            return;
        }
      if (that.data.validCode == '') {
            app.toast('请输入验证码');
            return;
        }
      if (!that.data.dataPosting) {
        that.setData({
                dataPosting: true
            });
            // 手机号+验证码进行用户登录或注册
            wx.request({
                url: app.apiHost + '/user_center/api/v1/open/phoneLoginOrRegister',
                // needLoadingIndicator: true,
                header: {
                  'cookie': wx.getStorageSync("sessionid"),
                  'Authorization': "Bearer " + wx.getStorageSync("user-auth")
                },
                data:{
                  login_type: 'mobile',
                  phone: that.data.phone,
                  code: that.data.validCode
                },
                success (res) {
                    that.setData({
                        dataPosting: false
                    });
                var msg = '登录成功';
                console.log(res);
                if (res.data.success) {
                    wx.setStorageSync("user-auth", res.data.auth);
                    wx.request({
                      url: app.apiHost + '/user_center/api/v1/user/loadInfo',
                      header: {
                        'cookie': wx.getStorageSync("sessionid"),
                        'Authorization': "Bearer "+ wx.getStorageSync("user-auth")
                      },
                      success (re) {
                        console.log(re);
                        wx.setStorageSync("current-user", re.data);
                        //手机号码是否注册 0已注册 
                         if(res.data.is_new == 0) {
                              wx.switchTab({
                                  url:'/pages/mine/index'
                              })
                          }else{
                              wx.navigateTo({
                                  url:'/pages/login/register'
                              })
                          }
                        }
                    })
                } else {
                    msg = res.msg || '登录失败';
                }
                app.toast(msg);
            }
            // , () => {
            //   that.setData({
            //         dataPosting: false
            //     });
            // });
        })
      }
    },
  closeDialog:function(){
    this.setData({
      showImgCode: false
    });
  }
    
    
})