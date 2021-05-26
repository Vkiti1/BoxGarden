const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const models = require('./models')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const admin = require('firebase-admin')

const serviceAccount = require('./boxgarden-fec52-firebase-adminsdk-s76z3-179f143d53.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseUrl: 'https://boxgarden-fec52-firebasio.com',
})

const db = admin.firestore()

/*get, create, update, delete methods for boxGarden collection
===============================================================
==============================================================
=============================================================*/

//get
app.get('/boxGarden', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null

  let subCollection =
    typeof request.query.subCollection !== 'undefined'
      ? request.query.subCollection
      : null

  let order = null
  let where = null

  order = models.getOrder(request.query)
  where = models.getWhere(request.query)

  models
    .get(db, 'boxGarden', id, order, subCollection)
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send(error)
    })
})

//create
app.post('/boxGarden', (request, response) => {
  if (typeof request.query.id === 'undefined') {
    if (Object.keys(request.body).length) {
      db.collection('boxGarden')
        .doc()
        .set(request.body)
        .then(() => {
          return response.send('Document successfully written - created!')
        })
        .catch((error) => {
          return response.send('Error writing document: ' + error)
        })
    } else {
      return response.send(
        'No post data for new document. ' + 'A new document is not created!'
      )
    }
  } else {
    if (typeof request.query.subCollection === 'undefined') {
      if (Object.keys(request.body).length) {
        db.collection('boxGarden')
          .doc()
          .set(request.body)
          .then(() => {
            return response.send('Document successfully written - created!')
          })
          .catch((error) => {
            return response.send('Error writing document: ' + error)
          })
      } else {
        return response.send(
          'No post data for new document. ' + 'A new document is not created!'
        )
      }
    } else {
      if (Object.keys(request.body).length) {
        db.collection('boxGarden')
          .doc(request.query.id)
          .collection(request.query.subCollection)
          .doc()
          .set(request.body)
          .then(() => {
            return res.send('Document successfully written - created!')
          })
          .catch((error) => {
            return res.send('Error writing document: ' + error)
          })
      } else {
        return res.send(
          'No post data for new document. ' + 'A new document is not created!'
        )
      }
    }
  }
})

//update
app.put('/boxGarden', (request, response) => {
  if (typeof request.query.id === 'undefined') {
    if (Object.keys(request.body).length) {
      if (typeof request.query.id !== 'undefined') {
        db.collection('boxGarden')
          .doc(request.query.id)
          .update(request.body)
          .then(() => {
            return response.send(
              'Document successfully written - ' + 'updated!'
            )
          })
          .catch((error) => {
            return response.send('Error writing document: ' + error)
          })
      } else {
        return response.send(
          'A parameter id is not set. ' + 'A document is not updated!'
        )
      }
    } else {
      return response.send(
        'No post data for new document. ' + 'A document is not updated!'
      )
    }
  } else {
    if (typeof request.query.subCollection === 'undefined') {
      if (Object.keys(request.body).length) {
        if (typeof request.query.id !== 'undefined') {
          db.collection('boxGarden')
            .doc(request.query.id)
            .update(request.body)
            .then(() => {
              return response.send(
                'Document successfully written - ' + 'updated!'
              )
            })
            .catch((error) => {
              return response.send('Error writing document: ' + error)
            })
        } else {
          return response.send(
            'A parameter id is not set. ' + 'A document is not updated!'
          )
        }
      } else {
        return response.send(
          'No post data for new document. ' + 'A document is not updated!'
        )
      }
    } else {
      if (Object.keys(request.body).length) {
        if (
          typeof request.query.id !== 'undefined' &&
          typeof request.query.subCollection !== 'undefined'
        ) {
          db.collection('boxGarden')
            .doc(request.query.id)
            .collection(request.query.subCollection)
            .doc(request.query.subCollectionID)
            .update(request.body)
            .then(() => {
              return response.send(
                'Document successfully written - ' + 'updated!'
              )
            })
            .catch((error) => {
              return response.send('Error writing document: ' + error)
            })
        } else {
          return response.send(
            'A parameter id is not set. ' + 'A document is not updated!'
          )
        }
      } else {
        return response.send(
          'No post data for new document. ' + 'A document is not updated!'
        )
      }
    }
  }
})

//delete
app.delete('/boxGarden', (request, response) => {
  if (typeof request.query.id === 'undefined') {
    if (typeof request.query.id !== 'undefined') {
      db.collection('boxGarden')
        .doc(request.query.id)
        .delete()
        .then(() => {
          return response.send('Document successfully deleted!')
        })
        .catch((error) => {
          return response.send('Error removing document: ' + error)
        })
    } else {
      return response.send(
        'A parameter id is not set. ' + 'A document is not deleted!'
      )
    }
  } else {
    if (typeof request.query.subCollection === 'undefined') {
      if (typeof request.query.id !== 'undefined') {
        db.collection('boxGarden')
          .doc(request.query.id)
          .delete()
          .then(() => {
            return response.send('Document successfully deleted!')
          })
          .catch((error) => {
            return response.send('Error removing document: ' + error)
          })
      } else {
        return response.send(
          'A parameter id is not set. ' + 'A document is not deleted!'
        )
      }
    } else {
      if (typeof request.query.id !== 'undefined') {
        db.collection('boxGarden')
          .doc(request.query.id)
          .collection(request.query.subCollection)
          .doc(request.query.subCollectionID)
          .delete()
          .then(() => {
            return response.send('Document successfully deleted!')
          })
          .catch((error) => {
            return response.send('Error removing document: ' + error)
          })
      } else {
        return response.send(
          'A parameter id is not set. ' + 'A document is not deleted!'
        )
      }
    }
  }
})

/* get, create, update, delete methods for measurements collection
===================================================================
===================================================================
===================================================================*/

//get
app.get('/measurements', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  let order = null
  let where = null
  order = models.getOrder(request.query)
  where = models.getWhere(request.query)
  models
    .get(db, 'measurements', id, order, null)
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send(error)
    })
})

//create
app.post('/measurements', (request, response) => {
  models
    .cud(db, 'measurements', null, request.body, 'post')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Post request didnt work: ' + error)
    })
})

//update
app.put('/measurements', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'measurements', id, request.body, 'put')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Put request didnt work: ' + error)
    })
})

//delete
app.delete('/measurements', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'measurements', id, null, 'delete')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Delete request didnt work: ' + error)
    })
})

/*get, create, update, delete methods for sensor collection
====================================================================
==============================================================
==============================================================*/

//get
app.get('/sensor', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  let order = null
  let where = null
  order = models.getOrder(request.query)
  where = models.getWhere(request.query)
  models
    .get(db, 'sensor', id, order, null)
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send(error)
    })
})

//create
app.post('/sensor', (request, response) => {
  models
    .cud(db, 'sensor', null, request.body, 'post')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Post request didnt work: ' + error)
    })
})

//update
app.put('/sensor', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'sensor', id, request.body, 'put')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Put request didnt work: ' + error)
    })
})

//delete
app.delete('/sensor', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'sensor', id, null, 'delete')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Delete request didnt work: ' + error)
    })
})

/*get, create, update, delete methods for user collection
=========================================================
=========================================================
=========================================================*/

//get
app.get('/user', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  let order = null
  let where = null
  order = models.getOrder(request.query)
  where = models.getWhere(request.query)
  models
    .get(db, 'user', id, order, null)
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send(error)
    })
})

//create
app.post('/user', (request, response) => {
  models
    .cud(db, 'user', null, request.body, 'post')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Post request didnt work: ' + error)
    })
})

//update
app.put('/user', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'user', id, request.body, 'put')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Put request didnt work: ' + error)
    })
})

//delete
app.delete('/user', (request, response) => {
  let id = typeof request.query.id !== 'undefined' ? request.query.id : null
  models
    .cud(db, 'user', id, null, 'delete')
    .then((res) => {
      return response.send(res)
    })
    .catch((error) => {
      return response.send('Delete request didnt work: ' + error)
    })
})
app.listen(3000, () => {
  console.log('Server running on port 3000')
})
