// pages/goodsdetail/goodsdetail.
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		activeTab: '0',
		piclist: [],
		trade: {},
		game: {},
		goodsname: '',
		mobilesystem: '',
		reclist: [],
		extensionAttr:[],
		hotTrades:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showNavigationBarLoading();
		const id = options.id;
		this.getData(id);
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

	/* 获取数据 */
	getData(id) {
		const that = this;
		tsy.request({
			url: app.globalData.host + '/trades/list/info',
			data: {
				id: id
			},
			success: function (res) {
				wx.hideNavigationBarLoading();
				tsy.success(res,function() {
					let data = res.data.data;
					that.setData({
						trade: data.trade,
						game: data.game,
						goodsname: data.goodsname,
						mobilesystem: data.mobilesystem,
						piclist: data.piclist,
						reclist: data.hotTrades,
						extensionAttr:data.extensionAttr,
						hotTrades:data.hotTrades
					})
				})
			}
		})
	},

	/* 预览图片 */
	priviewPics(e) {
		const that = this;
		const piclist = this.data.piclist;
		const index = e.currentTarget.dataset['index'];
		let urlArr = [];
		piclist.forEach(function(value,index,arr) {
			urlArr.push(value.picurl);
		})
		/* 调整预览顺序 */
		for(let i = 0 ; i<index; i++) {
			urlArr.push(urlArr.shift())
		}
		wx.previewImage({
			urls: urlArr
		})
	},

	/* 切换tab */
	changeTab(e) {
		const index = e.currentTarget.dataset['index'];
		this.setData({
			activeTab: index
		})
	},

	/* 立即购买 */
	buyGoods() {
		const that = this ;
		const csrf = wx.getStorageSync('cookie')._csrf;
		tsy.request({
			url:app.globalData.host + "/user/verify/check-login",
			success:function(res) {
				tsy.success(res,function() {
					tsy.request({
						url:app.globalData.host + '/user/buy/check-trade-state',
						data:{
							tradeid:that.data.trade.id
						},
						success:function(res) {
							tsy.success(res,function() {
								wx.navigateTo({
									url: `/pages/orderconfirm/orderconfirm?tradeid=${that.data.trade.id}`
								})
							})
						}
					})
				})
				
			}
		})
		
	}
})