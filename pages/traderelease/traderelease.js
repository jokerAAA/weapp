// pages/traderelease/traderelease.js

import WxValidate from '../../utils/WxValidate';
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
var Validate = "";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        queryParams: {},
        showstepone: true,
        showsteptwo: false,
        showarea: false,
        mychooseval: 1,
        areaList:[], //区服列表
        pricemode: [{
            name: "一口价",
            value: 1
        }, {
            name: "可议价",
            value: 0
        }],
        tradedata: [{
            name: "30天",
            value: 30
        }, {
            name: "14天",
            value: 14
        }, {
            name: "5天",
            value: 5
        }],
        picUrl: [],
        serveprice: 0,
        defaultinsurance: {
            day: "不购买",
            rate: 0
        },
        price: '',
        bxrate: 0,
        gamelist:[],
        gameattrs: {}, //配置项表单
        gameAttrArr: [],
        formData: {}, //表单提交数据
        clientlist: [], //配置项密保
        clientattr: {},
        isbindcertificate: '0',
        isbindmobile: 0,
        isbindemail: 0,

        /* 编辑页数据 */
        sellinfo:{},
        tradeid:'',
		picHosts: app.globalData.picHost
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const that = this;
        const id = options.id;
        if (id) {
            tsy.request({
                url: app.globalData.host + '/user/my-posted-edit-trade-game-account/index',
                data: {
                    id: id
                },
                success(res) {
                    tsy.success(res, function () {
                        const data = res.data.data;
                        that.setData({
                            tradeid:id,
                            sellinfo:data.sellinfolist,
                            gamelist:data.gamelist,
                            areaList:data.sellinfolist.areaList,
                            clientlist: data.clientlist,
                            insuranceInfo:data.insuranceInfo
                        },()=> {
                            /* 赋值自定义属性 */
                            const gamelist = that.data.gamelist;
                            let obj = {};
                            gamelist.forEach(function (value, index, arr) {
                                obj['gameattr_' + value.id] = value.chooseval;
                            });
                            that.setData({
                                gameattrs: obj
                            }, () => {

                            })
                            /* 设置服务费 */
                            const price = that.data.sellinfo.price ;
                            that.countPrice(price);
                            /* 设置密保信息 */
                            const clientattr = {};
                            that.data.clientlist.forEach(function(value,index) {
                                clientattr['clientattr_' + value.id] = value.chooseval;
                            });
                            that.setData({
                                clientattr:clientattr
                            })
                        })
                    })
                }
            })
        } else {
            this.setData({
                gameid: options.gameid,
                queryParams: options
            })
            tsy.request({
                url: app.globalData.host + '/user/sell-trade-factory/index',
                data: {
                    parentgoodsid: options.parentgoodsid,
                    gameid: options.gameid,
                    goodsid: options.goodsid,
                    gamename: options.gamename,
                    clientid: options.clientid,
                    clientname: options.clientname,
                    sellmode: options.sellmode
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded', // 默认值
                    'X-Requested-With': 'XMLHttpRequest'
                },
                method: 'POST',
                success: function (res) {
                    tsy.success(res, function () {
                        let newinsuranceInfo = res.data.data.insuranceInfo.insurance_rate_arr
                        /* 可能存在非数组 */
                        if(Object.prototype.toString.call(newinsuranceInfo) == '[object Array]') {
                            newinsuranceInfo.unshift(that.data.defaultinsurance)
                        }

                        that.setData({
                            areaList: res.data.data.sellinfolist.areaList,
                            gamelist: res.data.data.gamelist,
                            clientlist: res.data.data.clientlist,
                            insuranceInfo: newinsuranceInfo
                        }, () => {
                            const gamelist = that.data.gamelist;
                            let obj = {};
                            let attrArr = [];
                            gamelist.forEach(function (value, index, arr) {
                                obj['gameattr_' + value.id] = '';
                                attrArr.push({
                                    name: 'gameattr_' + value.id,
                                    value: '',
                                    tip: value.name
                                });

                            });
                            that.setData({
                                gameattrs: obj,
                                gameAttrArr: attrArr
                            }, () => {

                            })
                        })
                    })
                }
            })
            
        }
        this.initValidate()
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
    /* 选择区服 */
    chooseArea: function () {
        this.setData({
            showstepone: false,
            showarea: true
        })
    },
    onGetAreaCode: function (e) {
        this.setData({
            showarea: e.detail.showarea,
            showstepone: e.detail.showstepone
        })
    },
    onGetAreaNameCode: function (e) {
        let formData = this.data.formData ;
        formData = Object.assign({},formData,e.detail);
        this.setData({
            showareaname: e.detail.showareaname,
            formData:formData
        },()=> {
            
        })
    },
    onGetChooseCode: function (e) {
        console.log(e)

        this.setData(e.detail)
    },
    onGetTextData: function (e) {
        this.setData(e.detail)
    },
    onGetDataCode: function (e) {
        console.log(e)
        // this.setData({

        // })
    },
    // 上传图片
    choosegameimage: function () {
      var that = this;

      wx.chooseImage({
        count: 14,  //最多可以选择的图片总数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          //启动上传等待中...
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          var uploadImgCount = 0;
          for (var i = 0, h = tempFilePaths.length; i < h; i++) {
            wx.uploadFile({
              url: app.globalData.host + '/com/webupload/newupload?oper=_mark|_l|_m|_ml|_ms',
              filePath: tempFilePaths[i],
              name: 'file',
              data: {
                file: tempFilePaths[i]
              },
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                uploadImgCount++;
                var data = JSON.parse(res.data);
                console.log(data)
                //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
                var picUrl = that.data.picUrl;
                that.setData({
                  picUrl: that.data.picUrl.concat(data.result)
                })
                // productInfo.bannerInfo.push({
                //   "catalog": data.Catalog,
                //   "fileName": data.FileName,
                //   "url": data.Url
                // });
                // that.setData({
                //   productInfo: productInfo
                // });

                //如果是最后一张,则隐藏等待中
                if (uploadImgCount == tempFilePaths.length) {
                  wx.hideToast();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
            });
          }
        }
      })
        // const _this = this;
        // wx.chooseImage({
        //     count: 14, // 默认9  
        //     // 可以指定是原图还是压缩图，默认二者都有  
        //     sizeType: ['original', 'compressed'],
        //     // 可以指定来源是相册还是相机，默认二者都有
        //     sourceType: ['album', 'camera'],
        //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
        //     success: function (res) {
        //         _this.setData({
        //             picUrl: _this.data.picUrl.concat(res.tempFilePaths)
        //         })
        //     }
        // })
    },
    // 删除照片
    deletePic: function (e) {
        let picUrl = this.data.picUrl;
        picUrl.splice(e.target.dataset.index, 1);
        this.setData({
            picUrl: picUrl
        })
    },
    // 计算服务费
    changeSerPrice: function (e) {
        var price = e.detail.value;
        this.countPrice(price);
    },

    /* 计算服务费 */
    countPrice(price) {
        var free = 0;
        var dis = 0;
        var money = '';
        this.setData({
            price: price
        })
        if (price >= 10 && price < 100) {
            money = 2;
            dis = 0.035;
        } else if (price >= 100 && price < 300) {
            money = 3;
            dis = 0.045;
        } else if (price >= 300 && price < 500) {
            money = 5;
            dis = 0.055;
        } else if (price >= 500 && price < 1000) {
            money = 8;
            dis = 0.065;
        } else if (price >= 1000) {
            money = 10;
            dis = 0.075;
        } else {
            this.setData({
                serveprice: "0"
            })
        }
        free = (price * dis) + money;
        if (free > 680) {
            free = 680;
            this.setData({
                serveprice: 680
            })
        } else if (free != 0 && free < 680) {
            var floVal = parseFloat(free).toFixed(2),
                intVal = parseInt(free);
            if (floVal == intVal) {
                floVal = intVal;
            }
            this.setData({
                serveprice: floVal
            })
        }

        if (this.data.bxrate) {
            this.changeBxPrice()
        }

        console.log(this.data.serveprice);
        return this.data.serveprice;
    },

    bindBxChange: function (e) {
        console.log(this.data.price)
        this.setData({
            'bxday': this.data.insuranceInfo[e.detail.value].day,
            'bxrate': this.data.insuranceInfo[e.detail.value].rate
        })
        this.changeBxPrice()
    },
    changeBxPrice: function (e) {
        // 获取商品信息
        let price = this.data.price
        let tradePrice = 0;

        tradePrice = price;
        // if (parseInt(isfixedprice) == 0) {
        //   tradePrice = highprice;
        // }

        // 获取保险信息
        var insurance_rate = this.data.bxrate;
        // if (typeof (insurance_rate) == "undefined") {
        //   $(function () {
        //     $(".js-baoxian-tab:first").click();
        //   })
        // }

        // 计算价格并显示
        var insurance_price = 0;

        if (tradePrice != 0) {
            insurance_price = parseFloat(tradePrice * insurance_rate / 100).toFixed(2);
            console.log(insurance_price)
            var intVal = parseInt(tradePrice * insurance_rate / 100);
            console.log(intVal)
        }

        if (insurance_price == intVal) {
            insurance_price = intVal;
        }
        console.log(insurance_price)
        if (insurance_price > 0) {
            this.setData({
                'bxprice': insurance_price
            })
        } else {
            this.setData({
                'bxprice': 0
            })
        }
    },
    submitForm: function (event) {
        const that = this
        const params = event.detail.value

        console.log(params)
        // 传入表单数据，调用验证方法
        if (!this.WxValidate.checkForm(event)) {
            const error = this.WxValidate.errorList[0]
            this.showModal(error)
            return false
        };
        let formData = this.data.formData ;
        formData = Object.assign({},formData,event.detail.value);
        this.setData({
            showstepone: false,
            showsteptwo: true,
            formData:formData
        },()=> {
            
        })
    },
    showModal(error) {
        wx.showModal({
            content: error.msg,
            showCancel: false,
        })
    },
    switch1Change(e) {
        console.log('switch1 发生 change 事件，携带值为', e.detail.value)
        if (e.detail.value == true) {
            this.setData({
                isbindcertificate: 1
            })
        } else {
            this.setData({
                isbindcertificate: 0
            })
        }
    },
    switch2Change(e) {
        console.log('switch2 发生 change 事件，携带值为', e.detail.value)
        if (e.detail.value == true) {
            this.setData({
                isbindmobile: 1
            })
        } else {
            this.setData({
                isbindmobile: 0
            })
        }
    },
    switch3Change(e) {
        console.log('switch3 发生 change 事件，携带值为', e.detail.value)
        if (e.detail.value == true) {
            this.setData({
                isbindemail: 1
            })
        } else {
            this.setData({
                isbindemail: 0
            })
        }
    },
    initValidate() {
        // 验证字段的规则
        const rules = {
            name: {
                required: true
            },
            areaname: {
                required: true
            },
            isfixedprice: {
                required: true
            },
            price: {
                required: true,
            },
            enddate: {
                required: true,
            },
            transactioncode: {
                required: true,
            },
            mobile: {
                required: true,
                tel: true
            },
            qq: {
                required: true,
            },

        }

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            name: {
                required: '请输入商品标题',
            },
            areaname: {
                required: '请选择游戏区服'
            },
            isfixedprice: {
                required: '请选择售价类型'
            },
            price: {
                required: '请输入商品价格'
            },
            enddate: {
                required: '请选择到期时间',
            },
            transactioncode: {
                required: '请输入交易暗号',
            },
            mobile: {
                required: '请输入手机号',
                tel: '请输入正确的手机号',
            },
            qq: {
                required: '请输入QQ号'
            },

        }

        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages)

    },

    /*传参 */
    handleEvent(data) {
        let gameattr = this.data.gameattrs;
        for(var key in data.detail) {
            
            if(Object.prototype.toString.call(data.detail[key]) == '[object Array]') {
                /* 多选框要保持原有选项 */
                gameattr[key] = [...gameattr[key],...data.detail[key]];
                /* 过滤重复项 */
                gameattr[key] = gameattr[key].filter(function(value,index,arr) {
                    return arr.indexOf(value) == index ;
                })
            }else {
                gameattr = Object.assign({}, gameattr, data.detail);
            }
        }
        console.log(gameattr);
        //gameattr = Object.assign({}, gameattr, data.detail);
        
        this.setData({
            gameattrs: gameattr
        }, () => {
            //console.log(this.data.gameattrs);
        })
    },

    /* 处理密保项 */
    handleClient(e) {
        const value = e.detail.value;
        const name = e.currentTarget.dataset['name'];
        let clientattr = this.data.clientattr;
        clientattr = Object.assign({}, clientattr, {
            [name]: value
        });
        this.setData({
            clientattr: clientattr
        }, () => {})
    },

    /* 确认发布 */
    release() {
        const gameattr = this.data.gameattrs;
        const confirmFlag = this.confirmData();
        if (!confirmFlag) {
            return;
        } else {
            this.sendData();
        }
    },
    /* 验证配置项 */
    confirmData() {
        const gameattrs = this.data.gameattrs;
        const gameAttrArr = this.data.gameAttrArr;
        var i = 0;
        var flag = true;
        /* 配置项存在顺序，以数组排序为准 */
        for (; i < gameAttrArr.length; i++) {
            if (!gameattrs[gameAttrArr[i].name]) {
                wx.showToast({
                    title: `请输入${gameAttrArr[i].tip}`,
                    icon: 'none'
                })
                return false;
            }
        }
        /* 验证密保信息 */
        const clientlist = this.data.clientlist;
        const clientattr = this.data.clientattr;

        if (clientlist.length > 0) {
            clientlist.forEach(function (value, index, arr) {
                if (!clientattr['clientattr_' + value.id]) {
                    wx.showToast({
                        title: `请输入${value.name}`,
                        icon: 'none'
                    });
                    return false;
                }
            })
        }
        if (i == gameAttrArr.length) {
            return true;
        }
    },

    /* 提交数据 */
    sendData() {
        let formData = this.data.formData;
        const gameattrs = this.data.gameattrs;
        const clientattr = this.data.clientattr;
        const queryParams = this.data.queryParams;
        /* 添加配置属性和密保 */
        formData = Object.assign({}, formData, gameattrs);
        formData = Object.assign({}, formData, clientattr);
        formData = Object.assign({}, formData, queryParams);
        
        /* 判断发布或修改 */
        const id = this.data.tradeid ;
        let url = '/user/sell-trade-factory/save';
        if(id) {
            url = '/user/my-posted-edit-trade-game-account/save';
            formData.id = id ;
            formData.goodsid = 1 ;
            formData.insurance_type = 0 ;
        }
        console.log(formData);
        // return ;
        tsy.request({
            url: app.globalData.host + url,
            data: formData,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            success(res) {
                tsy.success(res, function () {
                    const data = res.data.data;
                    wx.redirectTo({
                        url: `/pages/releasesuccess/releasesuccess?id=${data.tradeid}&parentgoodsid=${queryParams.parentgoodsid}`
                    })

                })
            }
        })
    }

})