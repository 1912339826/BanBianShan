export default (options) => {
  const {
    url,
    data,
    header,
    method = 'GET',
    ...rest
  } = options
  return new Promise((resolve, reject) => {
    const cookie = wx.getStorageSync('sessionid');
    let token 
    if (wx.getStorageSync("user-auth")){
      token = "Bearer " + wx.getStorageSync("user-auth")
    }
    wx.request({
      url,
      method,
      data: {
        ...data
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token,
        ...header,
        cookie
      },
      ...rest,
      success(res) {
        console.log('success->', url, '->', res,res.data)
        const {
          statusCode
        } = res
        console.log('success->', url, '->', statusCode)
        if (statusCode == 200) {
            resolve(res)
        } else if (statusCode === 403) {
          onfail(res)
          reject(res)
          jump2login(res)
        } else {
          onfail(res)
          reject(res)
        }
      },
      fail(err) {
        console.log('error->', url, '->', err)
        reject(err)
        onfail(err)
      }
    })

    function onfail(err = {}) {
      console.log(err)
      const msg = err.data ? err.data.message : err.message
      // if (err.data.status==400) {
  
      // } else if (err.data.status == 510){

      // } else {
      //   wx.showToast({
      //     icon: 'none',
      //     title: `${msg}`,
      //     duration: 3000
      //   })
      // }
    }

    // 调到登录页重新登录
    function jump2login(res) {
      wx.removeStorageSync('token')
      wx.showToast({
        icon: 'none',
        title: res.data.message,
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 300)
    }
  })
}