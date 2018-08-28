// pages/login/login.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		activeTab: 0,
		orderList: [],
		freezeList: [],
		app: app
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

	/* 切换tab */
	changeTab(e) {
		const index = e.currentTarget.dataset['index'];
		this.setData({
			activeTab: index
		}, () => {
			this.getData();
		})
	},

	/* 初始化数据 */
	getData() {
		const index = +this.data.activeTab;
		const that = this;
		tsy.request({
			url: app.globalData.host + '/user/assets/freezingexact',
			data: {
				type: index + 1
			},
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					if (index == 0) {
						that.setData({
							orderList: data
						})
					} else {
						that.setData({
							freezeList: data
						})
					}
				})
			}
		})
	},

	/* 查看原因 */
	check(e) {
		const reason = e.currentTarget.dataset['reason'];
		if (reason == '无') {
			wx.showToast({
				title: "请联系客服了解详情",
				icon: "none"
			})
		} else {
			wx.showToast({
				'title': reason,
				icon: 'none',
				duration: 1500
			})
		}

	},


})