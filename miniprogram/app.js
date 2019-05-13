//app.js

App({
  onLaunch: function () {
    this.cloudInit();
    this.getUserInfo();
  },
  cloudInit(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },
  // getUserInfo 获取用户信息
  // 调用 wx.getSetting 方法查看用户是否授权过
  // 如果有就调用 wx.getUserInfo 获取用户信息
  // 并把用户信息并存储到 globalData 中
  // 调用 getOpenid 方法从云函数中获取 openid
  // 并把 openid 存储到 globalData 中
  getUserInfo(callback){
    // console.log(callback);
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.getOpenid();
              this.globalData.userInfo = res.userInfo;
              // console.log(res.userInfo);
              typeof callback === 'function' && callback(res);
            }
          })
        }else{
          console.log('用户未授权');
        }
      }
    })
  },
  // getOpenid 方法从云函数中获取 openid
  // 调用 wx.cloud.callFunction 方法调取云函数
  // 并在 name 参数中指定使用 login 函数
  // 成功后把返回的 openid 存储到 globalData 中。
  getOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //globalData对象用于存放全局数据
  //globalData.userInfo用于存放用户数据
  //globalData.openid存放openid
  globalData: {
    openid: '',
    userInfo: {}
  }
})
