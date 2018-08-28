// pages/login/login.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type: '',
		page: 1,
		orderList: [],
		app: app,
		isShowPrice: true,
		prevPrice: 0,
		currentPrice: 0,
		currentId: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const type = options.type;
		let title = type == 'sell' ? '我卖出的' : '我发布的';
		wx.setNavigationBarTitle({
			title: title
		})
		this.setData({
			type: type
		}, () => {
			this.getData();
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

	/* 订单点击 */
	handleOrder(e) {
		const type = this.data.type;
		const id = e.currentTarget.dataset['id'];
		if (type == 'release') {
			wx.navigateTo({
				url: `/pages/goodsdetail/goodsdetail?id=${id}`
			})
		} else {
			wx.navigateTo({
				url: `/pages/orderdetail/orderdetail?id=${id}`
			})
		}
	},

	/* 下拉加载更多 */
	onReachBottom() {
		const orderList = this.data.orderList;
		if (!orderList.length) return;
		if (orderList.length && orderList.length % 10 != 0) return;
		this.setData({
			page: this.data.page + 1
		}, () => {
			this.getData();
		})
	},
	/* 初始化数据 */
	getData() {
		const page = this.data.page;
		const type = this.data.type;
		let url = type == 'sell' ? '/user/seller/sold' : '/user/sellertrade/index';
		const that = this;
		tsy.request({
			url: app.globalData.host + url,
			data: {
				page: page
			},
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					let orderListNew = type == 'sell' ? data.dataProvider : data;
					if (orderListNew.length > 0) {
						/* 修改状态颜色 */
						orderListNew.forEach(function (value) {
							if (value.statusname == '待收货' || value.statusname == '待发货' || value.statusname == '待付款') {
								value.color = 'red';
							} else if (value.statusname == '交易成功' || value.statusname == '正出售') {
								value.color = 'green';
							} else {
								value.color = '';
							}
						})
					}
					that.setData({
						orderList: that.data.orderList.concat(orderListNew)
					}, () => {

					})
				})
			}
		})
	},

	/* 按钮点击 */
	handleButton(e) {
		const flag = +e.currentTarget.dataset['flag'];
		const id = e.currentTarget.dataset['id'];
		const price = e.currentTarget.dataset['price'];
		const editUrl = e.currentTarget.dataset['url'];
		switch (flag) {
			case 101:
				/* 上架 */
				this.handleGoods({
					type: 'up',
					id: id,
					url: editUrl
				});
				break;
			case 102:
				/* 下架 */
				this.handleGoods({
					type: 'down',
					id: id
				});
				break;
			case 103:
				/* 修改价格 */
				this.setData({
					currentId: id,
					prevPrice: price
				}, () => {
					this.changePrice();
				});
				break;
			case 104:
				/* 编辑商品 */
				this.editGoods();
				break;
			default:
				break;
		}

	},

	/* 上架、下架 */
	handleGoods(config) {
		const type = config.type;
		const editUrl = config.url;
		if (type == 'up' && editUrl) {
			wx.showToast({
				title: "编辑商品",
				icon: 'none'
			});
			return;
		};
		const id = config.id;
		let url = type == 'down' ? '/user/sellertrade/putoffsale' : '/user/sellertrade/putonsale';
		let str = type == 'down' ? '下架' : '上架';
		const that = this;
		wx.showModal({
			title: '温馨提示',
			content: `是否确定${str}`,
			success(res) {
				if (res.confirm) {
					that.updateState({
						url: url,
						id: id
					});
				}
			}
		})

	},

	/* 更新上架下架状态 */
	updateState(config) {
		const that = this;
		tsy.request({
			url: app.globalData.host + config.url,
			data: {
				tradeid: config.id
			},
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					if (data.valid == 'success') {
						wx.showToast({
							title: '操作成功',
							duration: 1200,
						})
						setTimeout(that.reload, 1000);
					} else {
						wx.showToast({
							title: data.errmsg,
							icon: 'none'
						})
					}
				})
			}
		})
	},

	/* 刷新页面 */
	reload() {
		this.setData({
			page: 1,
			orderList: []
		}, () => {
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
			this.getData();
		})
	},

	/* 修改价格 */
	changePrice() {
		this.togglePrice();
	},

	/* 修改价格弹窗显隐 */
	togglePrice() {
		const flag = this.data.isShowPrice;
		this.setData({
			isShowPrice: !flag
		})
	},

	/* 格式化输入 */
	handlePrice(e) {
		let value = e.detail.value;
		if (isNaN(+(value)) || +value < 0 || +value >= 1000000) {
			return value.slice(0, -1);
		}
		this.setData({
			currentPrice: +value
		}, () => {

		})
	},

	/* 确认修改价格 */
	confirmPrice() {
		const id = this.data.currentId;
		const currentPrice = this.data.currentPrice;
		const prevPrice = this.data.prevPrice;
		const that = this;

		if (currentPrice == prevPrice) {
			this.togglePrice();
			return;
		}
		tsy.request({
			url: app.globalData.host + '/user/sellertrade/ajaxupdata',
			data: {
				price: currentPrice,
				id: id
			},
			success(res) {
				tsy.success(res, function () {
					const data = res.data.data;
					if (data.errcode == 0) {
						wx.showToast({
							title: '修改成功',
							duration: 1200
						});
						that.setData({
							isShowPrice: true
						})
						setTimeout(that.reload, 1000);
					} else {
						wx.showToast({
							title: data.errmsg,
							duration: 2000,
							icon: 'none'
						})
					}
				})
			}
		})
	},

	/* 编辑商品 */
	editGoods() {

	}

})