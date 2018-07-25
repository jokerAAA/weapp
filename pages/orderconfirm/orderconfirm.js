// pages/orderconfirm/orderconfirm.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		price: 0,
		serviceMoney: 0,
		insuranceMoney: 0,
		activeLeftMenu: '0',
		isShowInsurance: false,
		activeInsurance: 0,
		textInsurance:'请选择',
		isShowNotice:false,
		isShowService: false,
		activeService:'',
		tradeid: '',
		trades: {},
		service: {
			list: {},
			info: {},
			text: "请选择"
		},
		app: app,
		insuranceList: {},
		formData: {
			buyermobile: '',
			buyerqq: '',
			service: '',
			amount: 1,
			goodsid: 1,
			tradeid: '',
			baoxian_type:''
		}

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showNavigationBarLoading();
		const tradeid = options.tradeid;
		const tradeidKey = "formData.tradeid"
		const amount = 1;
		const amountKey = "formData.amount"
		this.setData({
			[tradeidKey]: tradeid,
			[amountKey]: amount
		}, () => {
			this.getData({
				tradeid: tradeid,
				amount: amount
			});
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	/* 获取页面数据 */
	getData(obj) {
		const that = this;
		tsy.request({
			url: app.globalData.host + '/user/buy/trade',
			data: {
				tradeid: obj.tradeid,
				amount: obj.amount
			},
			success: function (res) {
				wx.hideNavigationBarLoading();
				tsy.success(res, function () {
					that.setData({
						trades: res.data.data.trademodel,
						price: res.data.data.trademodel.price,
						service: {
							list: res.data.data.servicelist,
							info: res.data.data.complaintgroup,
							text: "请选择"
						},
						insuranceList: res.data.data.baoxianList
					})
				})
			}

		})
	},

	/* 阻止事件冒泡 */
	stopPropgation() {

	},

	/* 选择保险 */
	toggleInsurance() {
		this.setData({
			isShowInsurance: !this.data.isShowInsurance
		})
	},

	/* 购买保险 */
	chooseInsurance(e) {
		const day = e.currentTarget.dataset['day'];
		const price = this.data.price;
		const rate = e.currentTarget.dataset['rate'];
		const key = 'formData.baoxian_type';

		this.setData({
			activeInsurance: day,
			insuranceMoney: price * rate / 100 ,
			textInsurance:`${day}天保险`,
			[key] : day
		})
	},

	/* 展示卖家已投保 */
	showInsuranceTips() {
		console.log("卖家已投保");
		const isShowNotice = this.data.isShowNotice;
		this.setData({
			isShowNotice:!isShowNotice
		})
	},

	/* 关闭卖家投保 */
	toggleNotice() {
		const isShowNotice = this.data.isShowNotice;
		this.setData({
			isShowNotice:!isShowNotice
		})
	},

	/* 选择客服 */
	toggleService() {
		this.setData({
			isShowService: !this.data.isShowService
		})
	},

	/* 选择客服挡位 */
	chooseType(e) {
		const index = e.currentTarget.dataset['index'];
		this.setData({
			activeLeftMenu: index
		});
	},

	/* 选择客服 */
	chooseService(e) {
		const status = e.currentTarget.dataset['status'];
		if (status != 1) return;
		/* 处理客服展示 */
		const index = +e.currentTarget.dataset['index'];
		const text = e.currentTarget.dataset['text'];
		let service = this.data.service;
		service = Object.assign({}, service, {
			text
		});
		/* 处理客服id */
		const id = e.currentTarget.dataset['id'];
		let formData = this.data.formData;
		formData = Object.assign({}, formData, {
			service: id
		});
		this.setData({
			formData:formData
		})

		this.setData({
			serviceMoney: index,
			service: service ,
			activeService:id
		}, () => {
			this.toggleService();
		})
	},

	/* 处理输入 */
	handleInput(e) {
		const value = e.detail.value;
		const key = e.currentTarget.dataset['name'];
		let formData = this.data.formData;
		formData = Object.assign({}, formData, {
			[key]: value
		});
		this.setData({
			formData: formData
		});
	},

	/* 提交订单 */
	submitOrder() {
		let formData = this.data.formData;
		const _csrf = wx.getStorageSync('cookie')._csrf;
		formData = Object.assign({},formData,{_csrf:_csrf});
		if(this.checkForm()) {
			tsy.request({
				url:app.globalData.host + '/user/buy/tradelogcreate',
				method:"POST",
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data:formData,
				success:function(res) {
					tsy.success(res,function(){
						const data = res.data.data;
						wx.navigateTo({
							url: `/pages/paymentorder/paymentorder?tradelogid=${data.tradelogid}`
						})
					})
				}
			})
		}
		

	},

	checkForm() {
		
		const formData = this.data.formData;
		const goodsid = formData.goodsid;
		if(goodsid == 1) {
			if(this.data.insuranceList.insurance_status  == 1 && this.data.trades.insurance_type == 0 && (!this.data.formData.baoxian_type) ) {
				wx.showToast({
					title:'请选择保险',
					icon:'none',
					duration:2000
				})
				return false;
			}
			if(!formData.service) {
				wx.showToast({
					title:'请选择客服',
					icon:'none',
					duration:2000
				})
				return false;
			}
			if(!formData.buyermobile || formData.buyermobile.length<11) {
				wx.showToast({
					title:'请输入手机',
					icon:'none',
					duration:2000
				})
				return false;
			}
			if(!formData.buyerqq || formData.buyerqq.length<6) {
				wx.showToast({
					title:'请输入qq',
					icon:'none',
					duration:2000
				})
				return false;
			}
			return true;
		}else {
			wx.showToast({
				title:'类型有误！'
			})
		}	
	}
})