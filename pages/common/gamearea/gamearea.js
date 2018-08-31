// pages/common/gamearea/gamearea.js
const tsy = require('../../../utils/util.js').tsy;
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'showarea': {
      type: null,
      value: false
    },
    'areaList': {
      type: null,
      value: ''
    },
    'gameid':{
      type: null,
      value:'6157'
    },
    'clientid':{
      type:null,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curHdIndex: 1,
    curBdIndex:1,
    curAreaIndex:-1,
    otherarea:'',
    areaid:"0"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // tab切换
    tab: function (e) {
      let dataId = e.currentTarget.dataset.id;
      let areaid = e.currentTarget.dataset.val;
      this.setData({
        curHdIndex: dataId,
        curBdIndex: dataId,
        areaid: areaid
      })
    },
    // 关闭
    closeArea: function(){
      let myEventDetail = {
        showarea: false,
        showstepone: true
      } // detail对象，提供给事件监听函数
      console.log(myEventDetail)
      this.triggerEvent('senddata', myEventDetail)
    },
    //搜索区服
    chooseArea:function(e){
      console.log(e)
      let dataId = e.currentTarget.dataset.id;
      let areagameid = e.currentTarget.dataset.areagameid;
      let areaname = e.currentTarget.dataset.areaname;
      this.setData({
        curAreaIndex: dataId,
        areaid: areagameid,
        areaname: areaname,
        areagameid: areagameid
      })
    },
    searchArea:function(e){
      const that = this
      tsy.request({
        url: app.globalData.host + '/user/sell-trade-goods-base/choosearea',
        data: {
          gameid: this.data.gameid,
          clientid: this.data.clientid,
          searcharea: this.data.searchname
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'X-Requested-With': 'XMLHttpRequest'
        },
        method: 'GET',
        success: function (res) {
          tsy.success(res, function () {
            that.setData({
              areaList: res.data.data
            })
          })

        }
      })
    },
    searchName:function(e){
      this.setData({
        searchname: e.detail.value
      })
    },
    inputOther:function(e){
      console.log(e)
      this.setData({
        otherarea: e.detail.value
      })
    },
    //确认选择
    areaSure:function(){
      console.log(this.data.areaid)
      if (this.data.areaid == 0){
        this.setData({
          areaname: "全部区服"
        })
        let myEventDetail = {
          showareaname: this.data.areaname,
          areaid : this.data.areaid
        } // detail对象，提供给事件监听函数
        console.log(myEventDetail)
        this.triggerEvent('sendareaname', myEventDetail)
        this.closeArea()
      } else if (this.data.areaid == -1){
        if (this.data.otherarea == ""){
          wx.showToast({
            title: '请输入区服',
            icon: 'none'
          })
        }else{
          this.setData({
            areaname: this.data.otherarea,
            areaid:this.data.areaid
          })
          let myEventDetail = {
            showareaname: this.data.areaname
          } // detail对象，提供给事件监听函数
          console.log(myEventDetail)
          this.triggerEvent('sendareaname', myEventDetail)
          this.closeArea()
        }
       
      }else{
       
          if (this.data.areagameid) {
            let myEventDetail = {
              showareaname: this.data.areaname,
              areaid:this.data.areaid
            } // detail对象，提供给事件监听函数
            console.log(myEventDetail)
            this.triggerEvent('sendareaname', myEventDetail)
            this.closeArea()
          } else {
            wx.showToast({
              title: '请选择区服',
              icon: 'none'
            })
          }
        
      }
    }
  }
})
