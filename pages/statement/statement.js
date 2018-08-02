// pages/statement/statement.js
import WxValidate from '../../utils/WxValidate';
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
var Validate = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '',
    customItem: '全部',
    dates:'',
    form: {
      account: '',
      email: '',
      mobile: '',
      bank_name: '',
      bank: '',
      username: '',
      bank_userid: '',
      game_role: '',
      textarea: '',
    },
    tradelogList:'',
    flag:true,
    areafocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    tsy.request({
      url: app.globalData.host + '/user/insurance/index',
      data: {
        tradelogid: options.tradelogid
      },
      method: 'GET',
      success: function (res) {
        tsy.success(res, function () {
          that.setData({
            tradelogList: res.data.data.tradelogList
          })
        })

      }
    })
    this.initValidate()
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
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
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      'form.dateTime': e.detail.value
    })
  },
  bindIdDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      'form.dateId': e.detail.value
    })
  },
  //城市选择
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'form.region': e.detail.value
    })
  },
  chooseidimage: function () {
    const _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      // 可以指定是原图还是压缩图，默认二者都有  
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
      success: function (res) {

        _this.setData({
          IdPaths: res.tempFilePaths
        })
      }
    })
  },
  choosebankimage: function () {
    const _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      // 可以指定是原图还是压缩图，默认二者都有  
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
      success: function (res) {

        _this.setData({
          bankPaths: res.tempFilePaths
        })
      }
    })
  },
  addHeight:function(){
    this.setData({
      areafocus:true
    })
    console.log("add" + this.data.areafocus)
  },
  redHeight: function () {
    this.setData({
      areafocus: false
    })
    console.log("red" + this.data.areafocus)
  },
  // 表单提交
  submitForm: function(event){
    const that = this
    const params = event.detail.value
    let flag = this.data.flag;
    
    console.log(params)
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(event)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    if (!flag) return;

    this.setData({
      flag: false
    })
   
    //提交
    tsy.request({
      url: app.globalData.host + '/user/insurance/save',
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          flag: true
        })
        tsy.success(res, function () {
          wx.redirectTo({
            url: res.data.data.url
          })
        })

      }
    })
  },
  initValidate() {
    // 验证字段的规则
    const rules = {
      bind_mobile: {
        required: true,
        tel: true,
      },
      bind_account: {
        required: true,
        maxlength: 30,
      },
      bind_game_role: {
        required: true
      },
      bind_time_one: {
        required: true,
      },
      city: {
        required: true,
      },
      bind_bank_name: {
        required: true,
      },
      bind_bank: {
        required: true,
        digits: true
      },
      bind_bank_user: {
        required: true,
      },
      bind_bank_userid: {
        required: true,
        idcard: true,
      },
      bind_userid_time: {
        required: true
      },
      shenfenpic: {
        required: true
      },
      jietuImg: {
        required: true
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      bind_mobile: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      bind_account: {
        required: '请输入游戏账号',
        maxlength: '账号长度不多于30位',
      },
      bind_game_role: {
        required: '请输入角色名称'
      },
      bind_time_one: {
        required: '请选择被找回时间',
      },
      city: {
        required: '请选择银行归属地',
      },
      bind_bank_name: {
        required: '请输入开户行',
      },
      bind_bank: {
        required: '请输入银行卡号',
        digits: '请输入正确的银行卡号'
      },
      bind_bank_user: {
        required: '请输入真实姓名',
      },
      bind_bank_userid: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      bind_userid_time: {
        required: '请选择身份证有限期',
      },
      shenfenpic: {
        required: '请添加身份证正面照',
      },
      jietuImg: {
        required: '请添加银行卡正面照',
      },
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

  }  
})