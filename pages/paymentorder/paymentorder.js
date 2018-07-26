// pages/paymentorder/paymentorder.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		price: 0,
		tradelogid: 0,
		tradelogno: 0,
		tradename: '',
		addtime: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const tradelogid = options.tradelogid;
		this.setData({
			tradelogid,
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
		const that = this ;
		tsy.request({
			url: app.globalData.host + '/user/buy/get-before-pay',
			data: {
				tradelogid: tradelogid
			},
			success: function (res) {
				tsy.success(res, function () {
					const data = res.data.data;
					that.setData({
						price: data.total_price,
						tradelogid: data.tradelogid,
						tradelogno: data.tradelogno,
						tradename: data.tradename,
						addtime: data.addtime
					})
				})
			}
		})
	},

	/* 支付订单 */
	pay() {
		const that = this ;
		wx.login({
			success(res) {
				if(res.code) {
					wx.showLoading();
					tsy.request({
						url:app.globalData.payHost + '/minipro/pay/payment' ,
						method:'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data:{
							tradelogid:that.data.tradelogid,
							app_id:23,
							money:+that.data.price,
							tradename:that.data.tradename,
							payplatform:56,
							code:res.code
						},
						success:function(res) {
							tsy.success(res,function() {
								that.wxPay(res.data.data);
							})
						},
						fail:function(res) {
							console.log(res);
						},
						complete(res) {
							wx.hideLoading();
						}
					 })
				}else {
					wx.showToast({
						title:'登陆失败',
						icon:'none',
						duration:2000
					})
				}
			}
		})
	},
	wxPay: function (config) {
		const that = this ;
		wx.requestPayment({
			timeStamp: config.timeStamp, //当前时间
			nonceStr: config.nonceStr, //随机字符串
			package: config.package, //接口返回id
			signType: config.signType, //固定为md5
			paySign: config.paySign, //签名
			success(res) {
				console.log(res);
				if(res.errMsg == 'requestPayment:ok') {
					wx.navigateTo({
						url: `/pages/payresult/payresult?tradelogid=${that.data.tradelogid}`
					})
				}
			},
			fail(res) {
				console.log(res);
				// 不是用户取消弹出提示
				if (res.errMsg != 'requestPayment:fail cancel') {
					wx.showToast({
						title:'支付出错'
					})
				}else {
					wx.showToast({
						title:'取消付款'
					})
				}
			},
			complete(res) {
				wx.hideLoading()
			}
		})
	}
})