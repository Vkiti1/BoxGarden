const express = require('express')
const app = express()

const admin = require('firebase-admin')

const serviceAccount = require('./boxgarden-fec52-firebase-adminsdk-s76z3-179f143d53.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseUrl: 'https://boxgarden-fec52-firebasio.com',
})

const db = admin.firestore()

app.use(express.json())

app.post('/setMeasurements', async (request, response) => {
  if (request.method === 'POST') {
    const data = request.body
    try {
      if (JSON.stringify(data) == JSON.stringify({})) {
        throw new Error('Data is not valid')
      } else if (data.IDBoxGarden == null) {
        throw new Error('Box garden ID is not valid')
      } else if (data.IDSensor == null) {
        throw new Error('Sensor ID is not valid')
      } else if (data.value == null) {
        throw new Error('Value is not valid')
      }

      const boxGardenReference = db
        .collection('boxGarden')
        .doc(data.IDBoxGarden)
      const boxGardenDocument = await boxGardenReference.get()

      if (boxGardenDocument.data() == null) {
        throw new Error('Provided BoxGarden ID is not found in database')
      }

      const boxSensorReference = db
        .collection('boxGarden')
        .doc(boxGardenDocument.id)
        .collection('boxSensor')
        .doc(data.IDSensor)

      const boxSensorDocument = await boxSensorReference.get()

      if (boxSensorDocument.data() == null) {
        throw new Error('Provided Sensor ID is not found in the database')
      }

      const measurement = {
        IDBoxGarden: boxGardenDocument.id,
        IDSensor: boxSensorDocument.id,
        measurementDateTime: admin.firestore.Timestamp.fromDate(new Date()),
        value: data.value,
      }

      const measurementsCollectionReference = db.collection('measurements')

      const newMeasurementReference = await measurementsCollectionReference.add(
        measurement
      )

      const newMeasurement = await newMeasurementReference.get()

      return response.status(201).send(newMeasurement.data())
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
