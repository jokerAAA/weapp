// pages/center/center.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		pic: '',
		username: '',
		app
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getData();
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
	 * 获取用户头像
	 */
	getData() {
		const that = this;
		tsy.request({
			url: app.globalData.host + '/user/assets/index',
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					that.setData({
						pic: data.pic,
						username: data.username,
            accountSum: data.accountSum,
            frozenSum: data.frozenSum
					})
				})
			}
		})
	},

	/* 冻结资金 */
	freezeMoney() {
		wx.navigateTo({
			url: "/pages/freeze/freeze"
		})
	},

	/* 充值 */
	recharge() {
		wx.showToast({
			title: '请使用淘手游app进行充值',
			icon: 'none'
		})
	},

	/* 提现 */
	withdraw() {
		wx.navigateTo({
			url: "/pages/withdraw/withdraw"
		})
	}
})