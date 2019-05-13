const App = getApp(); //通过getApp方法来引用全局对象

Page({
  data:{
    userInfo:{},
    logged:false
  },

  onLoad:function(){
    this.getUserInfo();
  },
  // 获取全局对象中的 App.globalData.userInfo
  // 判断是否有昵称 nickName
  // 如果有，把用户信息设置到 Page.data.userInfo 内
  getUserInfo:function(){
    let userInfo = App.globalData.userInfo;
    console.log(userInfo,'aaa');
    if(userInfo) {
      this.setData({
        logged:true,
        userInfo:userInfo
      })
    }
  },
  onGetUserInfo:function(e){
    let userInfo = e.detail.userInfo;
    console.log(userInfo);
    if(userInfo){
      App.getUserInfo((res) => {
        console.log(res)
        this.setData({
          userInfo:res.userInfo
        })
      })
    }
  }
})