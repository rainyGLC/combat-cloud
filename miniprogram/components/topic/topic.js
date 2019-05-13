Component({
  properties: {
    //组件的对外属性，是属性名到属性设置的映射表
    topics:{
      type:Array,
      value:[],
    }
  },
  data: {
    //组件的内部数据，和 properties 一同用于组件的模板渲染
    fullScreen:false

  },
  methods: {
    //组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
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
  }
})