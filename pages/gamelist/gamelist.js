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
        scrollId: '',
        scrollHeight: 560,
        type:'',
        scrollY:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showNavigationBarLoading();
        const goodsid = options.goodsid || '1';
        const letter = options.letter || 'hot';
        const type = options.type || 'buy';
        this.setScrollHeight();
        this.setData({
            goodsid: goodsid,
            letter: letter,
            type: type
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
        this.setData({
            scrollY:0
        })
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

    /* 设置scroll-view高度 */
    setScrollHeight() {
        const that = this ;
        wx.getSystemInfo({
            success: function (res) {
                let windowHeight = res.windowHeight;
                wx.createSelectorQuery().selectAll('.search').boundingClientRect(function (rects) {
                    let searchHeight = 0 ;
                    rects.forEach(function (rect) {
                        searchHeight += rect.height;
                        
                    })
                    that.setData({
                        scrollHeight: windowHeight - searchHeight
                    });
                }).exec();
            }
        });

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
        const type = this.data.type;
        if(type == 'buy') {
            wx.navigateTo({
                url: `/pages/goodslist/goodslist?goodsid=${goodsid}&gameid=${gameid}`,
            })
        }else {
            wx.navigateTo({
                url: `/pages/selltrade/selltrade?&gameid=${gameid}`,
            })
        }
        
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