module.exports = {
  get: async function (db, collection, id, order, subCollection) {
    let res = []
    let collectionRef
    if (id === null) {
      if (order.orderAttr === null) {
        collectionRef = db.collection(collection)
      } else {
        collectionRef = db
          .collection(collection)
          .orderBy(order.orderAttr, order.Type)
      }
      return collectionRef
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let document = {
              id: doc.id,
              data: doc.data(),
            }
            res.push(document)
          })
          return Promise.resolve(res)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    } else {
      if (subCollection === null) {
        const docRef = db.collection(collection).doc(id)
        return docRef
          .get()
          .then((doc) => {
            if (typeof doc.data() !== null) {
              let document = {
                id: doc.id,
                data: doc.data(),
              }
              return Promise.resolve(document)
            } else {
              let error =
                'Error getting document ' + id + ': The document is undefined'
              return Promise.reject(error)
            }
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      } else {
        const subCollectionRef = db
          .collection(collection)
          .doc(id)
          .collection(subCollection)
        return subCollectionRef
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let document = {
                id: doc.id,
                data: doc.data(),
              }
              res.push(document)
            })
            return Promise.resolve(res)
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }
    }
  },

  cud: async function (db, collection, id, request, method) {
    if (method === 'put') {
      if (Object.keys(request).length) {
        if (id !== null) {
          db.collection(collection)
            .doc(id)
            .update(request)
            .then(() => {
              return Promise.resolve('Document successfully updated')
            })
            .catch((error) => {
              return Promise.reject('Error updating document: ' + error)
            })
        } else {
          return Promise.reject('ID not provided')
        }
      } else {
        return Promise.reject('No data for updating document')
      }
    } else if (method === 'delete') {
      if (id !== null) {
        db.collection(collection)
          .doc(id)
          .delete()
          .then(() => {
            return Promise.resolve('Document successfully deleted')
          })
          .catch((error) => {
            Promise.reject('Error deleting document: ' + error)
          })
      } else {
        return Promise.reject('Document ID not provided')
      }
    } else if (method === 'post') {
      if (Object.keys(request).length !== null) {
        db.collection(collection)
          .doc()
          .set(request)
          .then(() => {
            return Promise.resolve('Document successfully created')
          })
          .catch((error) => {
            return Promise.reject('Error creating document: ' + error)
          })
      } else {
        return Promise.reject('No request data for creating document')
      }
    }
  },

  getOrder: function (requestQuery) {
    let order = {
      orderAttr:
        typeof requestQuery.orderAttr !== 'undefined'
          ? requestQuery.orderAttr
          : null,
      orderType: typeof requestQuery.orderDesc !== 'undefined' ? 'desc' : 'asc',
    }
    return order
  },

  getWhere: function (requestQuery) {
    // let where = null;
    // if (typeof requestQuery.whereAttr !== 'undefined' && typeof requestQuery.whereVal !== 'undefined' && typeof requestQuery.whereOp !== 'undefined') {
    //     let op = '=='
    //     if(requestQuery.whereOp === 'eq'){op = '=='}
    //     else if(requestQuery.whereOp === 'gt'){op = '>'}
    //     else if(requestQuery.whereOp === 'ge'){op = '>='}
    //     else ​​if​(​requestQuery​.​whereOp​ === ​'lt'​) { ​op​ = ​'<'​ }
    //     else​​ if​(​requestQuery​.​whereOp​ === ​'le'​) { ​op​ = ​'<='​ }
    //     else ​​if​(​requestQuery​.​whereOp​ === ​'ne'​) { ​op​ = ​'!='​ }
    //     else​​ if​(​requestQuery​.​whereOp​ === ​'array-contains'​) {op = "array-contains"}
    //     else if(requestQuery.whereOp === 'array-contains-any'){op = 'array-contains-any'}
    //     else if(requestQuery.whereOp === 'in'){op = 'in'}
    //     else if(requestQuery.whereOp === 'not-in'){op = 'not-in'}
    //     where = {
    //         attr: requestQuery.whereAttr,
    //         op: op,
    //         val: requestQuery.whereVal
    //     }
    //     return where
    // }
  },

  getCollectionRef: (db, collection, order, where) => {
    const collectionRef = this.getCollectionRef(db, collection, order, where)
    console.log(where)
    if (order.orderAttr === null) {
      if (where && where.attr && where.op && where.val) {
        collectionRef = db
          .collection(collection)
          .where(where.attr, where.op, where.val)
      } else {
        collectionRef = db.collection(collection)
      }
    } else {
      if (where && where.attr && where.op && where.val) {
        collectionRef = db
          .collection(collection)
          .where(where.attr, where.op, where.val)
          .orderBy(order.orderAttr, order.orderType)
      }
    }
    return collectionRef
  },
}
