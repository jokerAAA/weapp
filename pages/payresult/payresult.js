// pages/payresult/payresult.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tradelogid: '',
		tradename:'',
		amount:1,
		money:'',
		type:1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const tradelogid = options.tradelogid;
		this.setData({
			tradelogid: tradelogid
		}, () => {
			this.getData(tradelogid);
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

	getData(tradelogid) {
		const that = this; 
		tsy.request({
			url:app.globalData.payHost + '/minipro/pay/result',
			method:"GET",
			data:{
				tradelogid:tradelogid
			},
			success(res) {
				const data = res.data.data;
				that.setData({
					tradename:data.tradename,
					money:data.money,
					type:data.type,
					amount:data.tradenum
				})
			},
			complete() {
				wx.hideLoading();
			}
		})
	}
})