// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init();
const db = cloud.database();
const_ = db.command //获取数据库查询及更新指令


// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

exports.main = async (event,context) => {
  console.log(event,'ppp');
  let topic_id = event.topic_id;
  console.log(topic_id);
  try{
    return await db.collection('topic').doc(topic_id).update({
      data:{
        reply_count:_.inc(1)//原子自增字段值
      }
    })
  }catch(e){
    console.error(e)
  }
}