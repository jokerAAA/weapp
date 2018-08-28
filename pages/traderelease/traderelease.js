// pages/traderelease/traderelease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showstepone:true,
    showarea: false,
    mychooseval:1,
    pricemode:[{name:"一口价",value:1},{name:"可议价",value:0}],
    tradedata: [{ name: "30天", value: 30 }, { name: "14天", value: 14 }, { name: "5天", value: 5}],
    picUrl:[]
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
  chooseArea: function(){
    this.setData({
      showstepone:false,
      showarea:true
    })
  },
  onGetAreaCode: function (e) {
    console.log(e)
    this.setData({
      showarea: e.detail.showarea,
      showstepone: e.detail.showstepone
    })
  },
  onGetChooseCode:function(e){
    console.log(e)
    this.setData({
      mychooseval: e.detail.chooseval
    })
  },
  onGetDataCode: function (e) {
    console.log(e)
    // this.setData({
      
    // })
  },
  // 上传图片
  choosegameimage: function () {
    const _this = this;
    wx.chooseImage({
      count: 14, // 默认9  
      // 可以指定是原图还是压缩图，默认二者都有  
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
      success: function (res) {
        _this.setData({
          picUrl: _this.data.picUrl.concat(res.tempFilePaths)
        })
      }
    })
  },
  // 删除照片
  deletePic: function(e){
    let picUrl = this.data.picUrl;
    picUrl.splice(e.target.dataset.index,1);
    this.setData({
      picUrl: picUrl
    })
  }
})