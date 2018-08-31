// pages/common/gameattr/gameattr.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        'gamelist': {
            type: null,
            value: ''
        },
        'index': {
            type: null,
            value: ''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /* 输入框 */
        inputEnglish: function (e) {
            const name = e.currentTarget.dataset['name'];
            this.setData({
                english: e.detail.value.replace(/[^a-zA-Z]/g, '')
            },()=> {
                this.triggerEvent('myevent', {[name]:this.data.english})
            })
            
        },
        inputChinese: function (e) {
            const name = e.currentTarget.dataset['name'];
            this.setData({
                chinese: e.detail.value.replace(/[^\u4e00-\u9fa5]/g, '')
            },()=> {
                this.triggerEvent('myevent', {[name]:this.data.chinese});
            })
        },
        inputText: function (e) {
            let sendInputName = e.target.dataset.name;
            let mychooseval = {};
            mychooseval[sendInputName] = e.detail.value;
            console.log(mychooseval)
            this.triggerEvent('myevent', mychooseval);
        },

        /* 单选框 */
        onGetChooseCode: function (e) {
            this.triggerEvent('myevent', e.detail);
        },

        showCheckPop: function (e) {
            console.log(e)
            this.setData({
                currentIndex: e.currentTarget.dataset.current
            })
        },
        onGetAttrCode: function (e) {
            const data = e.detail ;
            const obj = {};
            const  valueArr= [];
            for(var keys in data) {
                data[keys].forEach(function(value,index,arr){
                    if(value.val) {
                        valueArr.push(value.name);
                    }
                })
                obj[keys] = valueArr
            }
            console.log(obj)
            this.setData({
              checkboxValue: valueArr
            })
            this.triggerEvent('myevent', obj);
            // this.setData(e.detail)
        }
    }
})