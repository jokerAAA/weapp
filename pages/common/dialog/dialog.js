// pages/common/buyinsurance/buyinsurance.js
const tsy = require('../../../utils/util.js').tsy;
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'showinsurance': {
      type: Boolean, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true     //可选，默认值，如果页面没传值过来就会使用默认值
    },
    'insuranceArray': {
      type: null,
      value: ''      
    },
    'insuranceId': {
      type: null,
      value: '' 
    },
    'reason':{
      type: null,
      value:''
    },
    'showDialog':{
      type: null,
      value: ''
    },
    'tradelogid': {
      type: null,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chooseCurrent: 0,
    baoxiantype: '',
    closecheck:true,
    reasonVal:'',
    chooseReason:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closepop: function(){
      const that = this;
      let myEventDetail = {
        showDialog: ''
      } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
    stop: function () {
      
    },
    myCatchTouch: function () {
      return;
    },
    // 选择保险
    chooseDay: function(e){
      const that = this;
      if (this.data.chooseCurrent === e.currentTarget.dataset.current) {
        return false;
      } else {
        that.setData({
          chooseCurrent: e.currentTarget.dataset.current,
          baoxiantype: e.currentTarget.dataset.day
        })
      }
    },
    // 确认购买保险
    buyinsurance:function(event){
      const that = this,
          rateDay = this.data.insuranceArray[0].day;
      
      if(!this.data.baoxiantype){
        that.setData({
          baoxiantype: rateDay
        })
       
      }
      console.log(this.data.baoxiantype);
      wx.request({
        url: app.globalData.host + '/user/trade/insurance',
        data: {
          tradelogid: this.data.insuranceId,
          baoxiantype: this.data.baoxiantype
        },
        success:function(res){
          if (res.errcode == 0) {
            that.setData({
              showDialog: ''
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    //选择原因
    reasonClick:function(event){
      const that = this;
      if (this.data.chooseReason === event.currentTarget.dataset.val) {
        return false;
      } else {
        that.setData({
          chooseReason: event.currentTarget.dataset.val,
          reasonVal: event.target.dataset.val
        })
      }
    },
    //确认原因
    reasonConfirm:function(){
      let tradelogid = this.data.tradelogid,
          val = this.data.reasonVal,
          orderidstatus = tradelogid + '-' + val;
      if (!val) return;
      tsy.request({
        url: app.globalData.host + '/user/trade/closepro',
        data: {
          orderidstatus: orderidstatus
        },
        success: function (res) {
          tsy.success(res, function () {
            wx.navigateTo({
              url: "/pages/orderstate/orderstate?id=" + res.data.data.tradelogid
            })
          })

        }
      })
    },
    //取消关闭
    cancelReason: function(){
      this.setData({
        showDialog: '',
        chooseReason:0
      })
    }
  }
})
