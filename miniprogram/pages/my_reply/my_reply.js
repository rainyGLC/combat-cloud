const regeneratorRuntime = require('../../libs/runtime')
const cloud = require('../../models/cloud.js')
const App = getApp();

Page({
  data:{
    replies: [],
    page: 1,
    limit: 5,
    total: 0,
    userInfo: {}
  },
  // onLoad:function() {
  //   this.getReplies()
  // },
  // getReplies: function(id) {
  //   db.collection('reply').orderBy('createTime', 'desc').where({
  //     _openid: App.globalData.openid,
  //   }).get({
  //     success: (res)=> {
  //       let replies = res.data;
  //       this.setData({ replies})
  //     }
  //   })
  // }

  onShow: function() {
    this.setData({ page: 1 }, async ()=>{
      try {
        // let userInfo = await App.getUserInfo();
        // console.log(userInfo);
        let limit = this.data.limit;
        let page = this.data.page;
        let count = await cloud.count('reply', {
          where: {
            _openid: App.globalData.openid,
          }
        });
        let getReplies = await cloud.collection('reply',{ limit, page, 
          where: {
            _openid: App.globalData.openid,
          }
        })
        let total = count.total;
        let replies = getReplies.data;
        page = page + 1;
        this.setData({ total,replies, page })
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
    // let userInfo = this.data.userInfo;
    
    if((page - 1) * limit >= total){
      console.log('没有信息了')
      return 
    }

    try {
      wx.showNavigationBarLoading();
      let getReplies = await cloud.collection('reply',{ limit, page,
        where: {
          _openid: App.globalData.openid,
        }
      })
      let reply = getReplies.data;
      let replies = this.data.replies.concat(reply);
      page = page + 1;
      this.setData({ replies, page })
      wx.hideNavigationBarLoading();
    }catch(e) {
      console.log(e)
      wx.showToast({ icon: 'none', title: '查询记录失败' })
    }
  }
})

