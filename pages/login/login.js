// pages/login/login.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tel: '',
		code: '',
		timeId: '',
		text:'发送验证码',
		activeCode: false,
		activeLogin: false
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

	handleTel(e) {
		const tel = e.detail.value;
		let activeCode = tel.length == 11 ? true : false ;
		this.setData({
			tel: tel,
			activeCode : activeCode 
		})
	},

	handleCode(e) {
		const code = e.detail.value;
		let activeLogin = code.length == 6 ? true : false ;
		this.setData({
			code: code ,
			activeLogin:activeLogin
		})
	},

	/* 获取验证码 */
	getCode() {
		const tel = this.data.tel;
		const that = this ;
		if (!this.checkTel(tel)) {
			return;
		}
		that.setData({
			text:'发送中...'
		})
		wx.request({
			url: app.globalData.passportHost + "/api/user/send-login-sms",
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				mobile: tel
			},
			success: function (res) {
				that.setData({
					text:'重新发送'
				})
				wx.showToast({
					title: "发送成功",
					icon: "success",
					duration: 2000
				})
			}
		})

	},

	/* login */
	login() {
		const that = this;
		const tel = this.data.tel;
		const code = this.data.code;
		if (!this.checkTel(tel)) return;
		if (!this.checkCode(code)) return;
		wx.request({
			url: app.globalData.passportHost + "/api/miniprogram/login-by-sms",
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				mobile: tel,
				smsverifycode: code
			},
			success: function (res) {
				let cookie;
				let returnurl;
				if (res.data.errcode == 0) {
					cookie = res.data.manualCookie;
					wx.setStorageSync('cookie', cookie);
					// app.globalData.cookie = cookie ;
					returnurl = wx.getStorageSync("returnurl");
					returnurl = '/' + returnurl ;
					wx.navigateTo({
						url: returnurl
					})
				} else {
					wx.showToast({
						title: res.data.msg,
						icon: "none",
						duration: 2000
					})
				}

			}

		})
	},

	/* 验证手机号 */
	checkTel(tel) {
		if (!tel || tel.length < 11 || Number.isNaN(+tel)) {
			wx.showToast({
				title: '手机号输入有误',
				icon: 'none',
				duration: 2000
			});
			return false;
		} else {
			return true;
		}
	},

	/* 验证验证码 */
	checkCode(code) {
		if (!code || code.length < 6 || Number.isNaN(+code)) {
			wx.showToast({
				title: '验证码输入有误',
				icon: 'none',
				duration: 2000
			});
			return false;
		} else {
			return true;
		}
	}
})