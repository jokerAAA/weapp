// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 模糊匹配
  searchGame: function(e){
    var that = this,
      isNum = /^[0-9]{3,}$/,
      gameName = e.detail.value;
    that.setData({
      gameName: gameName
    })
    if(gameName){
      if (isNum.test(gameName)){
        that.setData({
          searchGame: ''
        })
      }else{
        wx.request({
          url: app.globalData.host + '/search/game/auto-complete',
          data: {
            keyword: gameName
          },
          success: function (data) {
            that.setData({
              searchGame: data.data.data.list
            })
          }
        })
      }
    }else{
      that.setData({
        searchGame: ''
      })
    }
    
  },
  // 点击搜索
  searchClick: function(){
    var that = this,
      isNum = /^[0-9]{3,}$/,
      gameName = this.data.gameName;

    if (!gameName){
      return false;
    }  
    if (isNum.test(gameName)) {
      wx.navigateTo({
        url: "/taoid_" + gameName + ".html"
      })
    } else {
      wx.navigateTo({
        url: "/pages/gamesearch/gamesearch?page=1&keyword=" + gameName
      })
    }
  }
})