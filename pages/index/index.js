//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    swiperCurrent: 0,
    currentTab: 0,
    picHosts: app.globalData.picHost,
    hosts: app.globalData.host
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    var query = wx.createSelectorQuery()//创建节点查询器 query
    if (this.data.currentTab == 0) {
      query.select('.goods-container').boundingClientRect()//选择节点，获取节点位置信息的查询请求
    } else {
      query.select('.game-container').boundingClientRect()//选择节点，获取节点位置信息的查询请求
    }

    query.exec(function (res) {
      that.setData({
        clientHeight: res[0].height
      })
    })
  },
  //点击切换
  clickTab: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    var query = wx.createSelectorQuery()//创建节点查询器 query
    if (this.data.currentTab == 0) {
      query.select('.goods-container').boundingClientRect()
    } else {
      query.select('.game-container').boundingClientRect()
    }

    query.exec(function (res) {
      that.setData({
        clientHeight: res[0].height
      })
    })
    

  },  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;


    wx.request({
      url: app.globalData.host + '/indexpage/index/index',
      success: function (res) {
        if (res.data.errcode != 0) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加banner图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data.bannerlist,
            highList: res.data.data.highQualityTradeList,
            hotGame: res.data.data.hotGameList
          })
          var query = wx.createSelectorQuery()//创建节点查询器 query
          query.select('.goods-container').boundingClientRect()//
          query.exec(function (res) {
            that.setData({
              clientHeight: res[0].height
            })
          }) 
        }
      }
    })

       
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
