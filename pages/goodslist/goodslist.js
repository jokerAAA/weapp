// pages/goodslist/goodslist.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		sortText: '排序',
		showType: '',
		hasChooseInfo: false,
		clientList: [],
		areaList: [],
		originAreaList: [],
		areaWord: "",
		goodsList: [],
		goodsid: '',
		gameid: '',
		clientid: '0',
		areaid: '0',
		sortid: '',
		isbindcertificate: '2',
		isbindmobile: "2",
		isbindemail: '2',
		isCertificationShop: "2",
		wd: '',
		price: '0',
		page: 1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showNavigationBarLoading();
		const goodsid = options.id || '1';
		const gameid = options.gameid;
		this.setData({
			goodsid: goodsid,
			gameid: gameid
		}, () => {
			this.getData();
			this.getGoodslist();
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		const goodslist = this.goodsList;
		if (!goodslist) return;
		const length = this.goodsList.length;
		if (length && length % 15 != 0) {
			return;
		}
		let that = this;
		this.setData({
			page: that.data.page + 1
		}, function () {
			that.getGoodslist();
		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	/* 获取页面数据 */
	getData() {
		const that = this;
		tsy.request({
			url: app.globalData.host + "/trades/list/index",
			method: "GET",
			data: {
				goodsid: that.data.goodsid,
				gameid: that.data.gameid
			},
			success: function (res) {
				tsy.success(res, function () {
					that.setData({
						clientList: res.data.data.gameClientList
					})
				})
			},


		})
	},

	/* 获取商品列表 */
	getGoodslist() {
		const that = this;
		tsy.request({
			url: app.globalData.host + "/trades/list/indexpager",
			method: "GET",
			data: {
				goodsid: that.data.goodsid,
				gameid: that.data.gameid,
				page: that.data.page,
				sort: that.data.sortid || '0',
				areaid: that.data.areaid,
				clientid: that.data.clientid,
				isbindcertificate: that.data.isbindcertificate,
				isbindmobile: that.data.isbindmobile,
				isbindemail: that.data.isbindemail,
				price: that.data.price,
				isCertificationShop: that.data.isCertificationShop,
				wd: that.data.wd
			},
			success: function (res) {
				wx.hideNavigationBarLoading();
				tsy.success(res, function () {
					const page = that.data.page;
					let goodslist = that.data.goodsList;
					if (page > 1) {
						if (res.data.data) {
							goodslist = goodslist.concat(res.data.data)
						}
					} else {
						goodslist = res.data.data;
					}
					that.setData({
						goodsList: goodslist
					})
				})

			}
		})
	},

	/* 选择区服 */
	chooseClient(e) {
		const clientid = e.currentTarget.dataset['clientid'];
		this.setData({
			clientid: clientid
		}, () => {
			this.getArealist();
		})
	},

	/* 获取客户端列表 */
	getArealist() {
		const that = this;
		
		tsy.request({
			url: app.globalData.host + "/trades/list/getarealist",
			data: {
				gmid: that.data.gameid,
				goodsid: that.data.goodsid,
				cntid: that.data.clientid
			},
			success: function (res) {
				tsy.success(res,function() {
					that.setData({
						areaList: res.data.data
					});
					that.originAreaList = res.data.data;
				})
			}
		})
	},

	/* 选择区服 */
	chooseArea(e) {
		const areaid = e.currentTarget.dataset['areaid'];
		this.setData({
			areaid: areaid,
			showType: ''
		}, () => {
			this.getGoodslist();
		})
	},

	/* 输入区服 */
	inputArea(e) {
		const value = e.detail.value;
		this.setData({
			areaWord: value
		})
	},

	/* 搜索区服 */
	searchArea(e) {
		const value = this.data.areaWord;
		const valueReg = new RegExp(value);
		let filterArr = this.originAreaList.filter(function (v, i, arr) {
			return valueReg.test(v.name) == true;
		});
		if (filterArr.length == 0) {
			filterArr = null;
		}
		this.setData({
			areaList: filterArr
		})
	},

	/* 展示筛选项 */
	showMask(e) {
		const key = e.currentTarget.dataset['key'];
		if (key == this.data.showType) {
			this.setData({
				showType: ''
			}, () => {

			})
		} else {
			this.setData({
				showType: key
			}, () => {

			})
		}
	},
	/* 关闭筛选项 */
	closeMask(e) {
		if (e.currentTarget.id == 'info' && !this.data.hasChooseInfo) {
			this.resetInfo();
		}
		this.setData({
			showType: ''
		})
	},

	/* 阻止关闭筛选项 */
	stopCloseMask() {

	},

	/* 选择排序 */
	chooseSort(e) {
		const sortid = e.currentTarget.dataset['sortid'];
		const text = e.currentTarget.dataset['text'];
		this.setData({
			sortid: sortid,
			sortText: text,
			showType: ""
		}, () => {

			this.getGoodslist();
		})
	},

	/* 选择筛选项 */
	chooseInfo(e) {
		const key = e.currentTarget.dataset['key'];
		const value = e.currentTarget.dataset['value'];
		const obj = {};
		obj[key] = value;
		this.setData(obj);
	},

	/* 关键字 */
	searchKeyWord(e) {
		this.setData({
			wd: e.detail.value
		});
	},

	/* 重置筛选项 */
	resetInfo(e) {
		const originData = {
			isbindcertificate: '2',
			isbindmobile: "2",
			isbindemail: '2',
			isCertificationShop: "2",
			wd: '',
			price: '0'
		};
		if (e) {
			originData.hasChooseInfo = false;
		}
		this.setData(originData);
	},

	/* 确定筛选 */
	confirmInfo(e) {
		let data = {
			showType: ''
		};
		let hasChooseInfo = this.data.hasChooseInfo;
		if (!hasChooseInfo) {
			hasChooseInfo = true;
			data = Object.assign(data, {
				hasChooseInfo: hasChooseInfo
			});
		};
		this.setData(data, () => {
			this.getGoodslist();
		})
	}

})