const db = wx.cloud.database()

module.exports = {
  collection: function(table, params={}) {
    let page = params.page || 1;
    let limit = params.limit || 20;
    let skip = ( page - 1 ) * limit;
    let where = params.where || {};
    let orderBy = params.orderBy || [];
    let dbcollection;
    if(skip){
      dbcollection = db.collection(table).skip(skip)
    }else{
      dbcollection = db.collection(table)
    }
    return dbcollection
      .where(where)
      .limit(limit)
      .orderBy('create_time', 'desc')
      .get()
  },
  count: function(table, params={}) {
    let where = params.where || {};
    return db.collection(table)
      .where(where)
      .count()
  },
  add: function(table, params={}) {
    return db.collection(table).add({
      data: params
    })
  }
}