# <center>微信小程序<center/>  

## 0.目录说明  

+ pages:页面  
+ img:图片  
+ components:公用组件  
+ lib:公用类库  
+ utils:公用方法  

## 1、路由对应页面  

+ "pages/index/index"：首页  
+ "pages/logs/logs":自带目录  
+ "pages/search/search" ：搜索页  
+ "pages/gamelist/gamelist"：游戏列表页  
  + letter 游戏名称首字母
  + gamename 搜索的游戏名称
+ "pages/goodslist/goodslist"：商品列表页
  + goodsid 商品类型
  + gameid 游戏id
    ...
+ "pages/goodsdetail/goodsdetail"：商品详情  
  + id 商品id
+ "pages/orderconfirm/orderconfirm"：订单页  
  + id 商品id
+ "pages/paymentorder/paymentorder"：支付页
  + 订单号  
+ "pages/payresult/payresult"：支付结果  
+ "pages/center/center"：个人中心  
+ "pages/myorder/myorder"：我的订单  
+ "pages/statement/statement"：申述理赔  
+ "pages/orderstate/orderstate"：订单状态  
+ "pages/login/login"： 登录页  
+ "pages/cert/cert" : 生成证书页

## 文档

+ 接口文档具体见项目根目录下的api.mdown文件中  
+ 小能客服文档地址：[小能客服](http://doc3.xiaoneng.cn/ntalker.php?id=webb2b:start#%E9%9B%86%E6%88%90%E6%B5%81%E7%A8%8B1)

## 注意点

### 登陆处理  

  目前项目中登陆采用模拟cookie的机制来实现，前端在每次req中携带cookie，在res中更新cookie，如果出现未登录则在登陆页面中统计处理；

### 部分样式问题
  
  部分图片在wxss中通过伪元素来实现，目前小程序不支持，暂时转为base64处理