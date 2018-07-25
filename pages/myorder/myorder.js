// pages/myorder/myorder.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 1,
    htmlStr: [],
    showinsurance: true,
    showDialog: '',
    tradelogid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    tsy.request({
      url: app.globalData.host + '/user/trade/bought',
      success: function (res) {
        tsy.success(res, function () {
          var tempTime = parseInt((res.data.data.serviceDate * 1000 - Date.now()) / 1000);
          that.setData({
            orderList: res.data.data.dataProvider,
            tempTime: tempTime,
            reason: res.data.data.colsedata
          })
        })
        
      }
    })
    // wx.request({
    //   url: app.globalData.host + '/user/trade/bought',
    //   success: function (res) {
    //     var tempTime = parseInt((res.data.data.serviceDate * 1000 - Date.now()) / 1000);
    //     that.setData({
    //       orderList: res.data.data.dataProvider,
    //       tempTime: tempTime,
    //       reason: res.data.data.colsedata
    //     })
    //   }
    // })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中...',
    })
    // 页数+1
    var page = that.data.page + 1;
    that.setData({
      page: page
    }, function () {
      tsy.request({
        url: app.globalData.host + '/user/trade/bought',
        data: {
          page: parseInt(page)
        },
        method: "GET",
        // 请求头部
        header: {
          'content-type': 'application/text'
        },
        success: function (res) {
          tsy.success(res, function () {
            var newDataList = res.data.data.dataProvider;

            that.setData({
              orderList: that.data.orderList.concat(newDataList)
            })

            // 隐藏加载框
            wx.hideLoading();
          })

        }
      })
      // wx.request({
      //   url: app.globalData.host + '/user/trade/bought',
      //   data: {
      //     page: parseInt(page)
      //   },
      //   method: "GET",
      //   // 请求头部
      //   header: {
      //     'content-type': 'application/text'
      //   },
      //   success: function (res) {
      //     // 回调函数
      //     var newDataList = res.data.data.dataProvider;

      //     that.setData({
      //       orderList: that.data.orderList.concat(newDataList)
      //     })

      //     // 隐藏加载框
      //     wx.hideLoading();
      //   }
      // })
    })


  },
  showTime: function (time, $dom) {
    var str = '',
      min = parseInt((time % 3600) / 60),
      sec = time % 60,
      timeStr = '',
      timeArr = [];
    min = min < 10 ? "0" + min : min + '';
    sec = sec < 10 ? "0" + sec : sec + '';
    timeStr = min + ":" + sec,
      timeArr = timeStr.split("");
    timeArr.forEach(function (value, index, arr) {
      str += "<b class='red'>" + value + "</b>";
    });
    $dom.html(str);
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