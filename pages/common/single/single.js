// pages/common/single/single.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'title':{
      type: null,
      value: ''
    },
    'pick': {
      type: null,
      value: ''
    },
    'inputname': {
      type: null,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    chooseone: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindSureChange:function(e){
      this.setData({
        'choosename': this.data.pick[e.detail.value].name,
        'chooseval': this.data.pick[e.detail.value].value
      })
      if(this.data.title == "售价类型"){
        let mychooseval = {
          chooseval: this.data.chooseval
        } // detail对象，提供给事件监听函数
        console.log(mychooseval)
        this.triggerEvent('sendchooseval', mychooseval)
      }
      
    }
  }
})
