// pages/common/gamearea/gamearea.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'showarea': {
      type: null,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curHdIndex: 1,
    curBdIndex:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // tab切换
    tab: function (e) {
      var dataId = e.currentTarget.dataset.id;
      // var dataId = e.currentTarget.id;
      this.setData({
        curHdIndex: dataId,
        curBdIndex: dataId
      })
    },
    // 关闭
    closeArea: function(){
      let myEventDetail = {
        showarea: false,
        showstepone: true
      } // detail对象，提供给事件监听函数
      console.log(myEventDetail)
      this.triggerEvent('senddata', myEventDetail)
    }
  }
})
