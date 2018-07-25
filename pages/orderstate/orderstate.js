// pages/orderstate/orderstate.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatePic: true,
    positionfixed:true,
    hour:'',
    min:'',
    models:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    tsy.request({
      url: app.globalData.host + '/user/trade/info',
      data: {
        id: options.id
      },
      success: function (res) {
        tsy.success(res, function () {
          if (res.data.data.models.detailStatus.leftTime == undefined) {
            var time = '';
          } else {
            var time = res.data.data.models.detailStatus.leftTime;
          }
          var timeid;
          that.setData({
            models: res.data.data.models,
            leftTime: time,
            reason: res.data.data.colsedata
          })

          that.setTime(time, timeid, that);
        })

      }
    })
    // wx.request({
    //   url: app.globalData.host + '/user/trade/info',
    //   data: {
    //     id: options.id
    //   },
    //   success: function (res) {
    //     if (res.data.data.models.detailStatus.leftTime == undefined){
    //       var time = '';
    //     }else{
    //       var time = res.data.data.models.detailStatus.leftTime;
    //     }
    //     var timeid;
    //     that.setData({
    //       models: res.data.data.models,
    //       leftTime: time
    //     })
        
    //     that.setTime(time,timeid,that);
    //   }
    // })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //切换节点图
  showNode: function(){
    var that = this;
    that.setData({
      showStatePic: !that.data.showStatePic
    })
  },
  //复制
  copyText: function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.models.tradelogno
    })
  },
  //倒计时
  setTime: function (time, timeid, that) {
    if (time) {
      var timeArr = time.match(/\d{2}/g),
        hour = 0,
        min = 0,
        totalMin = 0;
      if (timeArr.length > 1) {
        hour = timeArr[0];
        min = timeArr[1]
      } else {
        min = timeArr[0]
      }
      totalMin = hour * 60 + min * 1;
      timeid = setInterval(function () {
        var htmlStr = '';
        totalMin--;
        if (totalMin > 0) {
          hour = parseInt(totalMin / 60);
          min = totalMin % 60;
          hour = hour > 10 ? hour : "0" + hour;
          min = min > 10 ? min : "0" + min;
          if (hour > 0) {
            htmlStr = hour + "小时" + min + "分钟"
          } else {
            htmlStr = min + "分钟"
          }
          that.setData({
            leftTime: htmlStr
          })
        } else {
          timeid && clearInterval(timeid);
          // location.reload();
        }
      }, 1000 * 60)


    }
  },
  onGetCode: function (e) {
    this.setData({
      showDialog: e.detail.showDialog
    })
  },
  onGetBtnData: function (e) {
    console.log(e.detail)
    var param = e.detail;
    this.setData(
      param
    )

  }
})