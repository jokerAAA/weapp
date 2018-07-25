const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const app = getApp();

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const tsy = {
	request(config) {
		/* 在请求中携带cookie */
		let cookie = wx.getStorageSync('cookie');
		// let cookie = app.globalData.cookie;
		let str = '';
		if (cookie) {
			for (var key in cookie) {
				str += `${key}=${cookie[key]}; `
			};
			str = str.slice(0, -1);
		}
		let header = {
			cookie : str 
		};
		header = Object.assign({},header,config.header);
		const obj = Object.assign({}, config, {
			header: header
		});
		wx.showLoading();
		wx.request(obj);
	},
	success(res, fn) {
		/* 处理returnurl */
		wx.hideLoading();
		const url = this.getUrl();
		wx.setStorageSync('returnurl', url);
		/* res中有新的cookie则更新cookie */
		let cookieNew = res.data.manualCookie;
		let cookie = wx.getStorageSync("cookie");
		// let cookie = app.globalData.cookie ;
		if (cookieNew && cookie) {
			cookieNew = Object.assign({}, cookie, cookieNew);
		};
		wx.setStorageSync('cookie', cookieNew);
		// app.globalData.cookie = cookieNew ;
		/* 处理响应 */
		if (res.data.errcode == 0) {
			fn && fn();
		} else if (res.data.errcode == 100001) {
			wx.navigateTo({
				url: `/pages/login/login`
			})
		} else {
			wx.showToast({
				title: res.data.msg,
				icon: "none",
				duration: 2000
			})
		}
	},
	getUrl() {
		const page = getCurrentPages();
		const curPage = page[page.length - 1];
		let url = curPage.route;
		const options = curPage.options;

		let query = '?';
		for (var key in options) {
			query += `${key}=${options[key]}&`;
		};
		query = query.slice(0, -1);
		url += query;
		return url;
	}
}

module.exports = {
	formatTime: formatTime,
	tsy: tsy
}