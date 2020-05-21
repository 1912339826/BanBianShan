const app = getApp();
Page({

    data: {
        statusBarHeight: 20
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '宇博园',
        });
        this.setData({
            statusBarHeight : app.mag.getAppData().statusBarHeight + 8
        })
    },

    onGetUserPhoneNumber: function(phonenumres) {       
        wx.login({
            success: (loginres) => {
                if (loginres.code) {
                    var code = loginres.code + '';
                    if (phonenumres.detail.errMsg === 'getPhoneNumber:ok') {
                        getApp().mag.request('/weixin_center/api/miniApp/login',{
                            needLoadingIndicator: true,
                            code: code,
                        }, rs => {                            
                            wx.setStorageSync('user-auth', rs['auth-token']); 
                           if(rs.success){
                             getApp().mag.request('/weixin_center/api/miniApp/userPhoneBind',{
                                encrypted_data: phonenumres.detail.encryptedData,
                                iv:phonenumres.detail.iv
                             }, res => { 
                               wx.setStorageSync('user-auth', res['auth-token']);   
                                //未注册
                                if(!res.has_register){
                                    wx.navigateTo({
                                        url:'/page/user/phoneRegister',
                                    })
                                }else {
                                    getApp().mag.toast('授权成功');
                                    getApp().mag.request('/user_center/api/v1/user/loadInfo',{},re => {
                                        wx.setStorageSync("current-user", re.data);
                                        setTimeout(function(){
                                            wx.switchTab({
                                                url: '/page/user/user'
                                            })
                                        },1000)
                                    })
                                }
                             }, () => {}, 'POST')
                           }
                        }, ()=>{},'POST')
                    }else{
                        getApp().mag.toast('取消授权不能正常使用小程序哦~');
                    }
                }
            }
        })
    },
    gologin:function() {
        wx.navigateTo({
            url:'phoneLogin'
        })
    },
    outLogin:function() {
        wx.switchTab({
            url: '../index/index'
          })
    }
})