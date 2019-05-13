const regeneratorRuntime = require('../../libs/runtime')
const cloud = require('../../models/cloud.js')
// 引用全局对象 App
const App = getApp();

Page({
  data:{
    topics:[],
    fullScreen:false,//是否全屏
    page:1,//当前页面
    total:0,//总共页面
    limit:5,//单次获取信息的条数
  },
  // onLoad:function() {
  //   this.getTopics() 
  // },


  // onPullDownRefresh:function() {
  //   //监听用户下拉动作
  //   this.getTopics(()=>{
  //     wx.startPullDownRefresh()//触发下拉刷新
  //   })
  // },

  // getTopics:function(callback){
  //   db.collection('topic').orderBy('create_time', 'desc').where({
  //     _openid:App.globalData.openid,
  //   }).get({
  //     success: res => {
  //       console.log('[数据库] [查询记录] 成功: ', res)
  //       let topics = res.data;  //res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
  //       this.setData({ topics })
  //       typeof cb === 'function' && callback();
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     }
  //   })
  // },


  onShow: function() {
    this.setData({ page: 1 }, async ()=>{
      try {
        // let userInfo = await App.getUserInfo();
        let limit = this.data.limit;
        let page = this.data.page;
        let count = await cloud.count('topic', {
          where: {
            _openid: App.globalData.openid,
          }
        });
        let getTopics = await cloud.collection('topic',{ limit, page, 
          where: {
            _openid: App.globalData.openid,
          }
        })
        let total = count.total;
        let topics = getTopics.data;
        // 2019-4-15 修复数据传入自定义组件日期时间对象的丢失，因此改为时间戳格式
        topics.forEach(data => data.createTime = Date.now(data.createTime))
        page = page + 1;
        this.setData({ total,topics, page })
        wx.stopPullDownRefresh()
      }catch(e) {
        console.log(e)
        wx.showToast({ icon: 'none', title: '查询记录失败' })
      }
    });
  },
  onPullDownRefresh: function() {
    this.onShow();
  },
  onReachBottom: async function() {
    let page = this.data.page;
    let limit = this.data.limit;
    let total = this.data.total;
    let userInfo = this.data.userInfo;
    
    if((page - 1) * limit >= total){
      console.log('没有信息了')
      return 
    }

    try {
      wx.showNavigationBarLoading();
      let getTopics = await cloud.collection('topic',{ limit, page,
        where: {
          _openid: App.globalData.openid,
        }
      })
      let topic = getTopics.data;
      let topics = this.data.topics.concat(topic);
      page = page + 1;
      this.setData({ topics, page })
      wx.hideNavigationBarLoading();
    }catch(e) {
      console.log(e)
      wx.showToast({ icon: 'none', title: '查询记录失败' })
    }
  },
  previewImage:function(event){
    // console.log(event)
    let url = event.currentTarget.dataset.url;
    wx.previewImage({
      current: 'url', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  previewVideo:function(event) {
    console.log(event)
    let id = event.currentTarget.dataset.id;
    let videoContext = wx.createVideoContext(id);
    // VideoContext.requestFullScreen(direction,0);
    let fullScreen = this.data.fullScreen;
    if(fullScreen) {
      videoContext.pause();//暂停视频
      videoContext.exitFullScreen();//退出全屏
      this.setData({fullScreen:false})
    }else{
      videoContext.requestFullScreen(); 
      videoContext.play();
      this.setData({fullScreen:true})
    }
  }
})  