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
		wx.request({
			url:app.globalData.payHost + '/minipro/pay/payment' ,
			method:'POST',
			data:{
				tradelogid:that.data.tradelogid,
				app_id:wxf37eea09f65e9bf2,
				money:+that.data.price,
				tradename:that.data.tradename,
				payplatform:56,
				code:wx.getStorageSync('code')
			},
			success:function(res) {
				console.log(res);
			},
			fail:function(res) {
				console.log(res);
			},
			complete() {
				
			}
 		})
		// wx.navigateTo({
		// 	url: '/pages/payresult/payresult'
		// })
	},
	wxPay: function (config) {
		wx.requestPayment({
			timeStamp: config.timeStamp, //当前时间
			nonceStr: config.nonceStr, //随机字符串
			package: `prepay_id=${config.prepayid}`, //接口返回id
			signType: 'MD5', //固定为md5
			paySign: config.sign, //签名
			success() {

			},
			fail(res) {
				console.log('onFail')
				// 不是用户取消弹出提示
				if (res.errMsg != 'requestPayment:fail cancel') {
					onFail() && onFail(res)
				}
			},
			complete(res) {
				wx.hideLoading()
			}
		})
	}
})