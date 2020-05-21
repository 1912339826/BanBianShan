export default class Validator {
  valid = true

  required(key, value) {
    if (value === undefined || value === null || value === '') {
      wx.showToast({
        icon: 'none',
        title: `${key}不能为空`,
      })

      this.valid = false

      return false
    }

    return true
  }

  test(reg, key, value) {
    if (!reg.test(value)) {
      wx.showToast({
        icon: 'none',
        title: `${key}校验错误`,
      })

      this.valid = false

      return false
    }
    return true
  }


  
}