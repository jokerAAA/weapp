// pages/login/login.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tel: '',
		code: '',
		timeId: '',
		text: '发送验证码',
		activeCode: false,
		activeLogin: false,
		timeCount:60
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
		let activeCode = tel.length == 11 ? true : false;
		this.setData({
			tel: tel,
			activeCode: activeCode
		})
	},

	handleCode(e) {
		const code = e.detail.value;
		let activeLogin = code.length == 6 ? true : false;
		this.setData({
			code: code,
			activeLogin: activeLogin
		})
	},

	/* 获取验证码 */
	getCode() {
		const text = this.data.text ;
		if(text != '发送验证码' && text != '重新发送') {
			return ;
		}
		const tel = this.data.tel;
		const that = this;
		if (!this.checkTel(tel)) {
			return;
		}
		that.setData({
			text: '发送中...'
		})
		tsy.request({
			url: app.globalData.passportHost + "/api/user/send-login-sms",
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				mobile: tel
			},
			success: function (res) {
				if(res.data.errcode != 0) {
					that.setData({
						text:'重新发送'
					})
				}
				tsy.success(res,function() {
					that.setData({
						text: `${that.data.timeCount}后重发`
					},()=> {
						that.countTime();
					})
					wx.showToast({
						title: "发送成功",
						icon: "success",
						duration: 2000
					})
				})
				// if (res.data.errcode == 0) {
					
				// } else {
				// 	that.setData({
				// 		text: '重新发送'
				// 	})
				// 	wx.showToast({
				// 		title: res.data.msg,
				// 		icon: "none",
				// 		duration: 2000
				// 	})
				// }
			}
		})

	},

	/* 倒计时 */
	countTime() {
		const that = this ;
		let time = that.data.timeCount ;
		that.data.timeId = setInterval(function() {
			if(time > 0) {
				that.setData({
					text: `${time}s后重发`
				},()=> {
					time-- ;
				});
				
			}else {
				clearInterval(that.data.timeId);
				that.data.timeId = 0 ;
				that.setData({
					text:'重新发送'
				})
			}
		},1000)

	},

	debounce:{
		flag : true ,
		time : 0 ,
		maxTime : 1000
	},

	/* login */
	login() {
		const that = this ;
		let flag = that.debounce.flag;
		// if(!flag) return ;
		if((new Date().getTime() - that.debounce.time) < that.debounce.maxTime ) return ;
		that.debounce.time = new Date().getTime();
		that.debounce.flag = false ;

		const tel = that.data.tel;
		const code = that.data.code;
		if (!that.checkTel(tel)) return;
		if (!that.checkCode(code)) return;
		tsy.request({
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
				that.debounce.flag = true ;
				tsy.success(res, function () {
					let cookie = res.data.manualCookie;
					wx.setStorageSync('cookie', cookie);
					// app.globalData.cookie = cookie ;
					let returnurl = wx.getStorageSync("returnurl");
					returnurl = '/' + returnurl;
					// wx.navigateTo({
					// 	url: returnurl
					// })
					wx.showToast({
						title: '登陆成功',
						icon: 'none',
						duration: 2000,
						success() {
							setTimeout(function () {
								wx.redirectTo({
									url: returnurl
								})
							}, 2000)
						}
					})


				})

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