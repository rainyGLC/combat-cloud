import {formatTime} from './../../utils/util.js'
const App = getApp();
const db = wx.cloud.database();



Page({
  data: {
    content:'',
    imageUrl:'',//图片地址
    videoUrl:'', //视频地址
    reply_count:''
  },

  onLoad:function(){
    let openid = App.globalData.openid;
    console.log(openid,'lolo');
    let userInfo = App.globalData;
    console.log(App.globalData);
    console.log(userInfo,'kokok');
  },
  handleChange:function(event) {
    let value = event.detail.value;
    this.setData({
      content:value
    })
    // console.log(this.data.content)
  },
  doUpload:function(){
    wx.showActionSheet({
      itemList: ['图片','视频','删除'],
      success:res=>{
        // console.log(res.tapIndex);
        let tapIndex = res.tapIndex;
        console.log(tapIndex);
        if(tapIndex==0){
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:res =>{
              wx.showLoading({
                title: '加载中',
              })
              // tempFilePath可以作为img标签的src属性显示图片
              const filePath = res.tempFilePaths[0];
              
              //上传图片
              let openid = App.globalData.openid;
              console.log(openid,'oool');
              let timestamp = Date.now();
              console.log(timestamp);
              let postfix = filePath.match(/\.[^.]+?$/)[0];
              const cloudPath = `${openid}_${timestamp}${postfix}`;
              console.log(cloudPath);
              // const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
              wx.cloud.uploadFile({
                cloudPath,
                filePath,
                success: res => {
                  console.log('[上传文件] 成功：', res)
                  this.setData({imageUrl:res.fileID});
                  App.globalData.fileID = res.fileID
                  App.globalData.cloudPath = cloudPath
                  App.globalData.imagePath = filePath

                },
                fail: e => {
                  console.error('[上传文件] 失败：', e)
                  wx.showToast({
                    icon: 'none',
                    title: '上传失败',
                  })
                },
                complete: () => {
                  wx.hideLoading()
                }
              })
            }
          })

        }else if(tapIndex==1){
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success:res=> {
              console.log(res.tempFilePath)
              // wx.showLoading({
              //   title: '加载中',
              // })
              const filePath = res.tempFilePath
              this.setData({videoUrl:filePath})
              let openid = App.globalData.openid;
              console.log(openid,'oool');
              let timestamp = Date.now();
              console.log(timestamp);
              let postfix = filePath.match(/\.[^.]+?$/)[0];
              const cloudPath = `${openid}_${timestamp}${postfix}`;
              // const cloudPath = 'my-video' + filePath.match(/\.[^.]+?$/)[0];
              wx.cloud.uploadFile({
                cloudPath,
                filePath,
                success: res=>{
                  console.log('[视频上传]成功:',res)
                  this.setData({videoUrl:res.fileID})
                  App.globalData.fileID = res.fileID;
                  App.globalData.cloudPath = cloudPath;
                  App.globalData.videoUrl = filePath;
                }
              })
            }
          })
        }else if(tapIndex==2){
          this.setData({
            imageUrl:'',
            videoUrl:''
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
      // complete: () => {
      //   wx.hideLoading()
      // }
    })
  },
  handleSubmit:function(){
    let time = new Date();
    let time_display = formatTime(time);
    console.log(time_display);
    let create_time = db.serverDate();
    let content = this.data.content;
    let imageUrl = this.data.imageUrl;
    let videoUrl = this.data.videoUrl;
    let userInfo = App.globalData.userInfo;
    let reply_count = this.data.reply_count;
    if(!content && !imageUrl && !videoUrl) {
      wx.showToast({
        icon:'none',
        title:'请输入内容'
      })
      return
    }
    wx.showLoading({
      title:'上传中',
      make:true
    })
    
    db.collection('topic').add({
      data: {
        content,imageUrl,videoUrl,userInfo,create_time,time_display,reply_count
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.showToast({
          title: '新增记录成功',
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/index/index'
          })
        },1500)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }

})