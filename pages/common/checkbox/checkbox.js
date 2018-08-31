// pages/common/checkbox/checkbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'pick': {
      type: null,
      value: ''
    },
    'attrid': {
      type: null,
      value: ''
    },
    'index':{
      type: null,
      value: ''
    },
    'currentIndex':{
      type: null,
      value: ''
    },
    'attrname':{
      type: null,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    curIdx: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange: function (e) {
      var items = this.data.pick;
      var checkArr = e.detail.value;
      for (var i = 0; i < items.length; i++) {
        if (checkArr.indexOf(i + "") != -1) {
          items[i].val = true;
        } else {
          items[i].val = false;
        }
      }
      this.setData({
        pick: items
      })
      let objattrcheck = {}
      let attrname = this.data.attrname
      objattrcheck[attrname] = items
       // detail对象，提供给事件监听函数
      this.triggerEvent('myeventdata', objattrcheck) //myevent自定义名称事件，父组件中使用
    },
    closePop: function () {
      const that = this;
      this.setData({
        currentIndex : -1
      })
    },
    stop: function () {

    }
  }
})
