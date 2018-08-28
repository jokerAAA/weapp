// pages/login/login.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: 0,
		trade: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const id = options.id;
		this.setData({
			id: id
		}, () => {
			this.getData();
		})
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

	/* 初始化 */
	getData() {
		const id = this.data.id;
		const that = this;
		tsy.request({
			url: app.globalData.host + '/user/seller/tradelogdesc',
			data: {
				tradelogid: id
			},
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					that.setData({
						trade: data.models
					})
				})
			}
		})
	},

	/* 按钮点击，后期添加更多按钮 */
	handleButton() {

	}


})