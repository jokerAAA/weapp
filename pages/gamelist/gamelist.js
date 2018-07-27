// pages/gamelist/gamelist.js
const app = getApp();
const tsy = require('../../utils/util.js').tsy;
const cache = require('../../utils/util.js').cache;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        letterArr: [],
        gameArr: [],
        gamename: '',
        letter: '',
        hasGamelist: true,
        goodsid: '',
        scrollId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showNavigationBarLoading();
        const goodsid = options.goodsid || '1';
        const letter = options.letter || '';
        this.setData({
            goodsid: goodsid,
            letter: letter
        }, () => this.getGamelist());
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

    /* 加载页面数据 */
    getGamelist: function () {
        let that = this;
        const gamename = that.data.gamename;
        const letter = that.data.letter;
        const key = `gamename=${gamename}&letter=${letter}`;
        const item = cache.get(key);
        if (item) {
            that.render(item);
            wx.hideNavigationBarLoading();
            return;
        }
        tsy.request({
            url: app.globalData.host + "/games/list/index",
            data: {
                gamename: gamename,
                letter: letter
            },
            success: function (res) {
                wx.hideNavigationBarLoading();
                tsy.success(res, function () {
                    let data = res.data.data;
                    cache.set(key, data);
                    that.render(data);
                })
            }
        })
    },

    /* 渲染页面 */
    render(data) {
        const that = this;
        if (data.gameList.length > 0) {
            that.setData({
                hasGamelist: true
            })
            data.gameList.forEach(function (value, index, arr) {
                value.pic = app.globalData.picHost + value.pic;
            })
            that.setData({
                letterArr: data.firstLetterList,
                gameArr: data.gameList
            })
        } else {
            that.setData({
                hasGamelist: false
            })
        }
    },

    /* 切换游戏列表 */
    changeLetter: function (e) {
        const letter = e.currentTarget.dataset['letter'];
        const that = this;
        this.setData({
            letter: letter,
            scrollId: letter,
            gamename: ""
        }, function () {
            that.getGamelist();
        });

    },

    /* 选择游戏 */
    chooseGame: function (e) {
        const goodsid = e.currentTarget.dataset['goodsid'] || 1;
        const gameid = e.currentTarget.dataset['gameid'];
        wx.navigateTo({
            url: `/pages/goodslist/goodslist?goodsid={goodsid}&gameid=${gameid}`,
        })
    },

    /* 处理搜索 */
    handleInput: function (e) {
        this.setData({
            gamename: e.detail.value || ''
        })
    },

    /* 搜索游戏 */
    searchGame: function (e) {
        const value = this.data.gamename;
        if (!value) {
            return;
        }
        this.setData({
            letter: ""
        }, () => this.getGamelist())

    }
})