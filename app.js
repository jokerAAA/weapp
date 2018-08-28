//app.js

App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				const code = res.code ;
				wx.setStorageSync("code",code);
			}
		})
		// 获取用户信息
		/* wx.getSetting({
			success: res => {
				console.log(res);
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;
							console.log(res.userInfo);

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				} else {
					wx.showToast({
						title: "授权失败",
						icon: "none",
						duration: 2000
					})
				}
			}
		}) */
	},
	globalData: {
    userInfo: null,
    host: 'http://wx.tsy.com',
    payHost: 'http://pay.tsy.com',
    passportHost: 'http://passport.tsy.com',
    	// host: 'http://cdt0-wxmn.taoshouyou.com',
		picHost: 'http://img-test.taoshouyou.com',
		// passportHost: 'http://cdt0-passport.taoshouyou.com',
		// payHost: 'http://cdt0-pay.taoshouyou.com',
		/* 以上为测试域名 */
		// host: 'https://wxmn.taoshouyou.com',
		// picHost: 'https://img.taoshouyou.com',
		// passportHost: 'https://passport.taoshouyou.com',
		// payHost: 'https://pay.taoshouyou.com',
		cookie:''
	}
})