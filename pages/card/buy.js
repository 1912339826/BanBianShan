// pages/card/buy.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_list: false,
    showModalStatus:false,
    contentData:"",
    url: app.apiHost,
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
    var self = this;
    wx.request({
      url: app.apiHost + '/minsu/api/BlackCard/pageList',
      header: {
        'cookie': wx.getStorageSync("sessionid"),
        'Authorization': "Bearer " + wx.getStorageSync("user-auth")
      },
      success(res) {
        // console.log(res);
        for(var i in res.data) {
            res.data[i].checked = false; 
           res.data[i].price = res.data[i].price/100
        }
        self.setData({
          card_list: res.data
        })
      }
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

  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  checkboxChange: function (evt) {
    var cid = evt.currentTarget.dataset.cid;
    var card_list = this.data.card_list;
    for (var i in card_list) {
       if (card_list[i].id == cid) {
         if (card_list[i].checked == false) {
             card_list[i].checked = true;
         } else {
           card_list[i].checked = false;
         }
       } else {
           card_list[i].checked = false;
       }
    }
    this.setData({
      card_list: card_list
    });
  },
  buyMoment:function(){
     var checked_cid = false;
    var card_list = this.data.card_list;
    for (var i in card_list) {
      if (card_list[i].checked) {
        checked_cid = card_list[i].id
      }
    }
    console.log(checked_cid);
    if (!checked_cid) {
      app.toast("请选择购买的卡");
    }
    wx.request({
      url: app.apiHost + '/minsu/api/BlackCard/cardBuy',
      header: {
        'cookie': wx.getStorageSync("sessionid"),
        'Authorization': "Bearer " + wx.getStorageSync("user-auth")
      },
      data:{
        card_id:checked_cid
      },
      method:'post',
      success(res){
        console.log(res);
        if (res.data.success) {
            var trade_no = res.data.trade_no;
            wx.request({
              url: app.apiHost + '/order_center/open/weixinOrder/wxMiniPay',
              header: {
                'cookie': wx.getStorageSync("sessionid"),
                'Authorization': "Bearer " + wx.getStorageSync("user-auth")
              },
              data: {
                trade_no: trade_no
              },
              method: 'post',
              success(result){
                 console.log(result);
                 var payData = result.data;
                wx.requestPayment({
                  timeStamp: payData.timeStamp.toString(),
                  nonceStr: payData.nonceStr,
                  package:  payData.package,
                  signType: payData.signType,
                  paySign: payData.paySign,
                  success(res) { 
                      console.log(res);
                      wx.navigateTo({
                        url: '/pages/card/buy/succes',
                      })
                  },
                  fail(res) {
                      console.log(res);
                      wx.navigateTo({
                        url: '/pages/card/buy/fail',
                      })
                  }
                })
              }
            })
        }
      }
    })
  }
})