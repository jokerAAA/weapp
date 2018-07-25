// pages/common/buttons/buttons.js
const tsy = require('../../../utils/util.js').tsy;
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'item': {
      type: null,
      value: ''
    },
    'showinsurance': {
      type: Boolean, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true     //可选，默认值，如果页面没传值过来就会使用默认值
    },
    'styleclass': {
      type: Boolean,
      value: false    
    },
    'tempTime': {
      type: null,
      value: ''
    },
    'tradelogid': {
      type: null,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeShow: '',
    sec:'',
    min:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickBtn: function(event){
      if (event.target.dataset.flag == 13){
        // 购买保险
        this.buyInsurance(event);
      } else if (event.target.dataset.flag == 1) {
        // 催单
        this.reminder(event);
      } else if (event.target.dataset.flag == 2) {
        // 联系客服（小能客服）
        
      } else if (event.target.dataset.flag == 5) {
        // 申请售后（小能客服）

      } else if (event.target.dataset.flag == 10) {
        // 确认收货
        this.takeGoods(event);
      } else if (event.target.dataset.flag == 11) {
        // 关闭交易
        this.closeTrade(event);
      }
    },
    
    // 购买保险
    buyInsurance: function (event) {
      var price = event.target.dataset.ndanprice,
        str = event.target.dataset.insuranceRate,
        insuranceArray = JSON.parse(str),
        that = this,
        insuranceId = event.target.dataset.id;
      insuranceArray.forEach(function (value, index, arr) {
        value.insuranceMoney = price * value.rate / 100;
        value.insuranceMoney = value.insuranceMoney.toFixed(2);
      });

      var myEventDetail = {
        showDialog: 'showinsurance',
        insuranceArray: insuranceArray,
        insuranceId: insuranceId
      } // detail对象，提供给事件监听函数
      console.log(myEventDetail)
      this.triggerEvent('senddata', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
    //催单
    reminder: function(event){
      var goodsparentid = event.target.dataset.goodsparentid,
          time = event.target.dataset.countdown; //到期时间，以s为单位
          time = time - parseInt(Date.now() / 1000);
          time -= this.data.tempTime;
     
      if (time > 0) {
        var interval = setInterval(function () {
          // 秒数
          var second = time;

          // 分钟位
          var min = Math.floor(second % (60 * 60 * 24) % 3600 / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;

          // 秒位
          var sec = Math.floor(second % (60 * 60 * 24) % 3600 % 60);
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;

          this.setData({
            min: minStr,
            sec: secStr
          });
          this.showModal('若客服' + this.data.min + '分' + this.data.sec + '秒后还未联系您，您可以联系客服进行催单', interval)
          time--;
        }.bind(this), 1000);
        
      } else {
        // 小能客服
        
      }
    },
    //提示框
    showModal(error, interval) {
      wx.showModal({
        content: error,
        showCancel: false,
        success:function(res){
          if (res.confirm) {
            clearInterval(interval);
          } 
        }
      })
    },
    //关闭交易
    closeTrade: function (event){
      var time = event.target.dataset.countdown; 
          time = time - parseInt(Date.now() / 1000);
          time -= this.data.tempTime;
      if (time > 0) {
        wx.showModal({
          content: '下单未超过十分钟不能取消！',
          showCancel: false
        })
      } else {
        var myEventDetail = {
          showDialog: 'closeOrder',
          tradelogid: event.target.dataset.id
        } // detail对象，提供给事件监听函数
        console.log(myEventDetail)
        this.triggerEvent('senddata', myEventDetail)
      }
    },
    // 确认收货
    takeGoods:function(event){
      var price = event.target.dataset.ndanprice,
        tradelogid = event.target.dataset.id;
      wx.showModal({
        title:'确认收货后￥'+ price +'直接付款到卖家账户',
        content: '小心点击“确定”，否则可能钱货两空～',
        showCancel: true,
        success:function(res){
          if (res.confirm) {
            tsy.request({
              url: app.globalData.host + '/user/trade/receiptpro',
              data: {
                id: tradelogid
              },
              success: function (res) {
                tsy.success(res, function () {
                  wx.navigateTo({
                    url: "/pages/orderstate/orderstate?id=" + tradelogid
                  })
                })

              }
            })
            // wx.request({
            //   url: app.globalData.host + '/user/trade/receiptpro',
            //   data: {
            //     id: tradelogid
            //   },
            //   success: function () {
            //     wx.navigateTo({
            //       url: "/pages/orderstate/orderstate?id=" + tradelogid
            //     })
            //   }
            // })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
          
        }
      })
    }
  }
})
