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
	},
	globalData: {
		userInfo: null,
		host: 'http://cdt0-wxmn.taoshouyou.com',
		picHost: 'http://img-test.taoshouyou.com',
		passportHost: 'http://cdt0-passport.taoshouyou.com',
		payHost: 'http://cdt0-pay.taoshouyou.com',
		cookie:''
	}
})