const app = getApp()
Component({
  properties: {
    routerIndex: {
      type: Number,
      value: 2
    }
  },
  data: {
   
    tagList: [],
    handleArr: []
  },
  ready() {
    console.log(11111111)
    this.getList()
  },
  methods: {
    getList() {
      let tagList = []
      let targetArr = []
      if (wx.getStorageSync('tagInfo')){
        targetArr = wx.getStorageSync('tagInfo')
        console.log(targetArr)
      }
      app.request({
        url: app.apis.tagData,
      }).then(res => {
        console.log(res.data)
        tagList = res.data.map(item=>{
            if(item.tag.length>0){
              item.tag = item.tag.map(itemChild=>{   
                if (targetArr.indexOf(itemChild.id)!=-1){
                  itemChild.checked = true
                } else {
                  itemChild.checked = false
                }
                return itemChild
              })
            }
            return item
          })
          this.setData({
            tagList,
            handleArr: targetArr
          })
          console.log(this.data.tagList)
        
      }).catch(err => {

      })
    },
     handleChange(e){
       let indexArr 
       let {
         tagList,
         handleArr
       } = this.data
       const {
         type,
         index
       } = e.currentTarget.dataset
       console.log(e,type,index)
       tagList = tagList.map( (item,typ) => {
         if (typ == type){
           item.tag[index].checked = !item.tag[index].checked
         }
         return item
       })
       const currentCheck = tagList[type].tag[index]
       if (currentCheck.checked){
         handleArr.push(currentCheck.id, currentCheck.name)
       } else {
         indexArr = handleArr.indexOf(currentCheck.id)
         if (indexArr != -1) {
           handleArr.splice(indexArr, 2)
         }
       }
       this.setData({
         tagList,
         handleArr
       })
     },
    handleSave(){
      let {
        routerIndex
      } = this.data
      console.log(this.data.handleArr)
      wx.setStorageSync('tagInfo', this.data.handleArr)
      if (routerIndex==1){
        wx.navigateBack({
          delta: 1
        })
      } else {
        this.triggerEvent('getTagInfo', false)
      }
    },

    handleReset(){
      let{
        tagList
      } = this.data
      if (wx.getStorageSync('tagInfo')) {
        wx.removeStorageSync('tagInfo')
      }
      tagList = tagList.map(item => {
        if (item.tag.length > 0) {
          item.tag = item.tag.map(itemChild => {
            itemChild.checked = false
            return itemChild
          })
        }
        return item
      })
      this.setData({
        tagList,
        handleArr: []
      })
    },
    


    
  }
})