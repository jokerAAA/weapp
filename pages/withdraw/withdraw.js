// pages/login/login.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		money: 0.00
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

	/* 初始化数据 */
	getData() {
		const that = this;
		tsy.request({
			url: app.globalData.host + '/user/assets/get-account',
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					that.setData({
						money: data.accountSum
					})
				})
			}
		})
	}
})