const App = getApp(); //通过getApp方法来引用全局对象

Page({
  data:{
    userInfo:{},
    logged:false
  },
  onLoad:function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getOpenid();
          App.globalData.userInfo = res.userInfo
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo:function(e){
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: e.detail.userInfo
      })
    }
  },
  getOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        App.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }

})