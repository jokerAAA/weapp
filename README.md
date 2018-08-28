# <center>微信小程序<center/>  

## 0.目录说明  

+ pages:页面  
+ img:图片  
+ components:公用组件  
+ lib:公用类库  
+ utils:公用方法  

## 1、路由对应页面  

  淘手游小程序可以大致分为以下模块：
  1. 首页  
  2. 买家
    买家包含游戏列表、商品列表、商品详情、确认订单、支付、支付成功页，其中游戏列表和卖家公用
  3. 卖家
    卖家包含游戏列表、客户端选择、发布页、发布成功页  
  4. 订单
    从用户角度可以将订单分为买到的、发布的和卖出的。
    从代码角度可以分为买家订单列表、订单详情、卖家订单列表、订单详情，发布的订单列表与卖家公用，订单列表和详情中有申诉理赔、证书页面的入口
  5. 个人中心  
    个人中心页面包含订单页、提现、资金冻结页面的入口，提现和冻结的功能后续补充。
  6. 登录
    登录页面暂时只支持短信登录的功能，登录是通过模拟cookie的形式实现的，未使用token方案，后续可以添加微信一键登录、单点登陆等功能。
  具体页面路由如下：
+ "pages/index/index"：首页  
+ "pages/logs/logs":自带目录  
+ "pages/search/search" ：搜索页  

+ "pages/gamelist/gamelist"：游戏列表页  
  + letter 游戏名称首字母
  + gamename 搜索的游戏名称
+ "pages/goodslist/goodslist"：商品列表页
  + goodsid 商品类型
  + gameid 游戏id
+ "pages/goodsdetail/goodsdetail"：商品详情  
  + id 商品id
+ "pages/orderconfirm/orderconfirm"：确认订单页  
  + id 商品id
+ "pages/paymentorder/paymentorder"：支付页
  + 订单号  
+ "pages/payresult/payresult"：支付结果  

+ "pages/selltrade/selltrade" 客户端选择
  + gameid 游戏id
+ "pages/traderelease/traderelease" 发布  
+ "pages/releasesuccess/releasesuccess" 发布成功  

+ "pages/myorder/myorder"：买到的宝贝订单列表
+ "pages/orderstate/orderstate"：买到的宝贝订单详情  
  + id 订单id
+ "pages/orderlist/orderlist": 发布的宝贝和卖出的宝贝列表
+ "pages/orderdetail/orderdetail": 卖出的宝贝订单详情  
  + tradelogid 订单id
+ "pages/statement/statement"：申述理赔  
  + tradelogid 订单id
+ "pages/cert/cert" : 生成证书页  
  + id: 订单id

+ "pages/center/center"：个人中心  
+ "pages/withdraw/withdraw": 提现
+ "pages/freeze/freeze": 资金冻结  
  
+ "pages/login/login"： 登录页  

## 文档

+ 接口文档具体见项目根目录下的api.mdown文件中  
+ 小能客服文档地址：[小能客服](http://doc3.xiaoneng.cn/ntalker.php?id=webb2b:start#%E9%9B%86%E6%88%90%E6%B5%81%E7%A8%8B1)

## 注意点

### 登陆处理  

  目前项目中登陆采用模拟cookie的机制来实现，前端在每次req中携带cookie，在res中更新cookie，如果出现未登录则在登陆页面中统计处理；

### 样式
  
  部分图片在wxss中通过伪元素来实现，目前小程序不支持，暂时转为base64处理
  总体布局rpx + 百分比 ,字体多数情况下使用px单位，在小屏下可能出现字体溢出的情况