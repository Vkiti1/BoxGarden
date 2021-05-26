<template>
  <div class="q-pa-lg row justify-center">
    <div class="col" style="max-width: 900px">
      <div class="q-pb-md">
        <q-btn color="green" label="Add box garden" @click="onNewBoxGarden" />
      </div>
      <q-list bordered>
        <div
          v-for="(boxGarden, boxGardenIndex) in boxGardens"
          :key="boxGarden.id"
        >
          <q-expansion-item
            group="boxGardens"
            :label="boxGarden.boxGardenName"
            :default-opened="boxGardenIndex === 0"
            header-class="bg-teal-3 text-bold"
            dense
            @click="resetTakenImage()"
          >
            <q-card>
              <q-card-actions align="right">
                <q-btn
                  dense
                  color="green"
                  icon="edit"
                  @click="onUpdateBoxGarden(boxGarden)"
                />
                <q-btn
                  dense
                  color="green"
                  icon="delete"
                  @click="onDeleteBoxGarden(boxGarden)"
                />
              </q-card-actions>
              <q-separator />
              <q-card-section>
                <div class="row">
                  <div class="col-12 q-pr-xs">
                    <q-input
                      readonly
                      dense
                      label="Box garden ID"
                      v-model="boxGarden.id"
                    />
                    <div class="row">
                      <div class="col-12 q-pr-xs">
                        <q-input
                          readonly
                          dense
                          label="Address"
                          v-model="boxGarden.address"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12 q-pr-xs">
                        <q-input
                          readonly
                          dense
                          label="Location"
                          v-model="boxGarden.location"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <q-input
                          readonly
                          dense
                          label="Latitude"
                          v-model="boxGarden.geoPoint.latitude"
                        />
                      </div>
                      <div class="col">
                        <q-input
                          readonly
                          dense
                          label="Longitude"
                          v-model="boxGarden.geoPoint.longitude"
                        />
                      </div>
                    </div>

                    <div v-if="$q.platform.is.mobile" class="row">
                      <div class="col">
                        <q-btn
                          class="full-width q-mt-md"
                          icon="add_a_photo"
                          @click="openCamera()"
                        />
                      </div>
                      <div v-if="uploadButton" class="col">
                        <q-btn
                          @click="uploadPhoto(boxGarden)"
                          class="full-width q-mt-md"
                          icon="upload"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="$q.platform.is.mobile">
                  <div class="row full-width q-mt-md" v-if="boxGarden.imageUrl">
                    <q-img width="100%" :src="boxGarden.imageUrl" />
                  </div>
                  <div class="row full-width q-mt-md" v-if="takenImage">
                    <q-img width="100%" :src="takenImage.src" />
                  </div>
                </div>
                <div v-else>
                  <div
                    class="row q-mt-md"
                    style="width: 300px"
                    v-if="boxGarden.imageUrl"
                  >
                    <q-img width="100%" :src="boxGarden.imageUrl" />
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-bold">
                      Sensors
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <div class="q-pb-md">
                      <q-btn
                        color="green"
                        label="Add sensor"
                        @click="onNewBoxGardenSensor(boxGarden)"
                      />
                    </div>
                    <q-list bordered>
                      <div
                        v-for="(boxGardenSensor,
                        boxGardenSensorIndex) in sensors"
                        :key="boxGardenSensor.documentID"
                      >
                        <q-expansion-item
                          v-if="boxGarden.id === boxGardenSensor.UIDBoxGarden"
                          group="boxSensor"
                          :label="boxGardenSensor.sensorName"
                          :default-opened="boxGardenSensorIndex === 0"
                          header-class="bg-teal-2 text-bold"
                          dense
                        >
                          <q-card>
                            <q-card-actions align="right">
                              <q-btn
                                dense
                                color="green"
                                icon="edit"
                                @click="
                                  onUpdateBoxGardenSensor(
                                    boxGarden,
                                    boxGardenSensor
                                  )
                                "
                              />
                              <q-btn
                                dense
                                color="green"
                                icon="delete"
                                @click="
                                  onDeleteBoxGardenSensor(
                                    boxGarden,
                                    boxGardenSensor
                                  )
                                "
                              />
                            </q-card-actions>
                            <q-separator />
                            <q-card-section>
                              <div class="row">
                                <div class="col-6 q-pr-xs">
                                  <q-input
                                    label="Sensor type"
                                    readonly
                                    dense
                                    v-model="boxGardenSensor.type"
                                  />
                                  <q-input
                                    label="Box garden ID"
                                    readonly
                                    dense
                                    v-model="boxGardenSensor.UIDBoxGarden"
                                  />
                                </div>
                                <div class="col-6 q-pr-xs">
                                  <q-input
                                    label="Sensor ID"
                                    readonly
                                    dense
                                    v-model="boxGardenSensor.UIDSensor"
                                  />
                                  <q-input
                                    label="Unit of measurement"
                                    readonly
                                    dense
                                    v-model="boxGardenSensor.unitOfMeasurement"
                                  />
                                </div>
                              </div>
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </div>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
        </div>
      </q-list>
    </div>
    <q-dialog v-if="openBoxGardenDialog" v-model="openBoxGardenDialog">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">
            Box garden
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            ref="Name"
            :error="
              !boxGardenModel.boxGardenName ||
                boxGardenModel.boxGardenName.length === 0
            "
            error-message="Name is required."
            label="Name"
            v-model="boxGardenModel.boxGardenName"
          />
          <q-input label="Address" v-model="boxGardenModel.address" />
          <div class="row">
            <div class="col">
              <q-input
                ref="Latitude"
                :error="
                  !boxGardenModel.geoPoint.Latitude &&
                    boxGardenModel.geoPoint.Latitude !== 0
                "
                error-message="Latitude is required."
                label="Latitude"
                type="number"
                v-model.number="boxGardenModel.geoPoint.Latitude"
              />
            </div>
            <div class="col">
              <q-input
                ref="Longitude"
                :error="
                  !boxGardenModel.geoPoint.Longitude &&
                    boxGardenModel.geoPoint.Longitude !== 0
                "
                error-message="Longitude is required."
                label="Longitude"
                type="number"
                v-model.number="boxGardenModel.geoPoint.Longitude"
              />
            </div>
          </div>
          <div v-if="$q.platform.is.mobile" class="col">
            <q-btn
              class="full-width q-mt-md"
              icon="location_on"
              @click="getGeolocation()"
            />
          </div>
          <q-input label="Location" v-model="boxGardenModel.location" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" label="OK" @click="onOKBoxGardenDialogClick" />
          <q-btn
            color="green"
            label="Cancel"
            @click="onCancelBoxGardenDialogClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-if="openBoxGardenSensorDialog"
      v-model="openBoxGardenSensorDialog"
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">
            Sensor
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select
            ref="Sensor"
            :error="boxGardenSensorModel.type === ''"
            error-message="Choose a sensor from list"
            label="Sensor"
            dense
            v-model="boxGardenSensorModel"
            :options="sensorsFromDB"
            option-value="type"
            option-label="type"
          />
          <q-input
            clearable
            label="Sensor name"
            ref="SensorName"
            :error="!boxGardenSensorModel.sensorName"
            error-message="Enter a sensor name"
            v-model="boxGardenSensorModel.sensorName"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="green"
            label="OK"
            @click="onOKBoxGardenSensorDialogClick"
          />
          <q-btn
            color="green"
            label="Cancel"
            @click="onCancelBoxGardenSensorDialogClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import firebase from "firebase/app";
export default {
  name: "BoxGardensIndex",
  data() {
    return {
      uploadButton: false,
      openBoxGardenDialog: false,
      openBoxGardenSensorDialog: false,
      boxGardens: [],
      boxGardenModel: {
        boxGardenName: "",
        geoPoint: {
          Latitude: null,
          Longitude: null
        },
        address: "",
        location: "",
        imageUrl: ""
      },
      boxGardenSensorModel: {
        sensorName: "",
        UIDBoxGarden: "",
        type: "",
        UIDSensor: "",
        unitOfMeasurement: ""
      },
      sensors: [],
      boxGardenID: null,
      boxSensorID: null,
      sensorsFromDB: [],
      takenImage: null
    };
  },
  mounted: async function() {
    let boxGardenCollectionReference = this.$db.collection("boxGarden");
    const boxGardenData = await boxGardenCollectionReference.get();
    boxGardenData.forEach(async boxGarden => {
      const boxSensorCollectionReference = this.$db
        .collection("boxGarden")
        .doc(boxGarden.id)
        .collection("boxSensor");
      const boxSensorData = await boxSensorCollectionReference.get();
      boxSensorData.forEach(boxSensor => {
        this.sensors.push({
          documentID: boxSensor.id,
          UIDBoxGarden: boxGarden.id,
          ...boxSensor.data()
        });
      });
      const storageRef = this.$storage.ref();
      const boxGardenData = boxGarden.data();
      if (boxGardenData.imageUrl !== "") {
        const downloadUrl = await storageRef
          .child(boxGardenData.imageUrl)
          .getDownloadURL();

        this.boxGardens.push({
          id: boxGarden.id,
          ...boxGardenData,
          imageUrl: downloadUrl
        });
      } else {
        this.boxGardens.push({
          id: boxGarden.id,
          ...boxGardenData
        });
      }
    });
    const sensorCollectionReference = this.$db.collection("sensor");
    const sensorData = await sensorCollectionReference.get();
    sensorData.forEach(sensor => {
      this.sensorsFromDB.push({ ...sensor.data() });
    });
  },
  methods: {
    resetTakenImage() {
      this.takenImage = null;
    },
    onNewBoxGarden() {
      this.boxGardenID = null;
      this.openBoxGardenDialog = true;
    },
    onNewBoxGardenSensor(boxGarden) {
      this.boxGardenID = boxGarden.id;
      this.openBoxGardenSensorDialog = true;
    },
    onOKBoxGardenDialogClick() {
      const boxGardenCollectionReference = this.$db.collection("boxGarden");
      if (
        !this.$refs["Name"].hasError &&
        !this.$refs["Latitude"].hasError &&
        !this.$refs["Longitude"].hasError
      ) {
        const newBoxGarden = {
          ...this.boxGardenModel,
          geoPoint: new firebase.firestore.GeoPoint(
            this.boxGardenModel.geoPoint.Latitude,
            this.boxGardenModel.geoPoint.Longitude
          )
        };
        if (this.boxGardenID) {
          boxGardenCollectionReference
            .doc(this.boxGardenID)
            .set(newBoxGarden)
            .then(() => {
              console.log("Updated document");
            });
          const boxGardenUpdateIndex = this.boxGardens.findIndex(
            boxGarden => boxGarden.id === this.boxGardenID
          );
          this.boxGardens.splice(boxGardenUpdateIndex, 1, {
            ...newBoxGarden,
            id: this.boxGardenID
          });
          this.boxGardenID = null;
        } else {
          boxGardenCollectionReference
            .add(newBoxGarden)
            .then(docRef => {
              this.boxGardens.push({ ...newBoxGarden, id: docRef.id });
            })
            .catch(err =>
              console.log("Error adding document to collection ", err)
            );
        }
      }
      this.boxGardenModel = {
        boxGardenName: null,
        geoPoint: {
          Latitude: null,
          Longitude: null
        },
        address: "",
        location: ""
      };
      this.openBoxGardenDialog = false;
    },

    getGeolocation() {
      const onSuccess = position => {
        this.boxGardenModel.geoPoint.Latitude = position.coords.latitude;
        this.boxGardenModel.geoPoint.Longitude = position.coords.longitude;
      };

      const onError = error => {
        alert(`Code: ${error.code}
        Message: ${error.message}`);
      };

      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        timeout: 5000
      });
    },
    openCamera() {
      if (typeof navigator.camera !== "undefined") {
        const onSucces = imageData => {
          const image = new Image();
          image.setAttribute("crossOrigin", "anonymous");
          image.src = "data:image/jpeg;base64," + imageData;
          this.takenImage = image;
          this.uploadButton = true;
        };
        const onError = error => {
          if (error.code) {
            alert(`Error taking a photo: ${error.code}
                Error message: ${error.message}`);
          }
        };
        navigator.camera.getPicture(onSucces, onError, {
          destinationType: navigator.camera.DestinationType.DATA_URL, //changed this
          encodingType: navigator.camera.EncodingType.JPEG
        });
      }
    },
    async uploadPhoto(boxGarden) {
      const storageRef = this.$storage.ref();
      const imageUrl = `images/${boxGarden.id}.jpeg`;
      const imageRef = storageRef.child(imageUrl);
      try {
        await imageRef.putString(this.takenImage.src, "data_url");
        const boxGardenReference = this.$db.collection("boxGarden");
        await boxGardenReference
          .doc(boxGarden.id)
          .update({ imageUrl: imageUrl });
        const currentGardenIndex = this.boxGardens.findIndex(
          garden => garden.id === boxGarden.id
        );
        this.boxGardens[
          currentGardenIndex
        ].imageUrl = await imageRef.getDownloadURL();
      } catch (err) {
        console.log("Error uploading image: " + err);
      } finally {
        this.takenImage = null;
      }
    },
    onOKBoxGardenSensorDialogClick() {
      const boxSensorCollectionReference = this.$db
        .collection("boxGarden")
        .doc(this.boxGardenID)
        .collection("boxSensor");
      if (
        !this.$refs["SensorName"].hasError &&
        !this.$refs["Sensor"].hasError
      ) {
        const newBoxSensorDocument = this.boxGardenSensorModel;
        if (this.boxSensorID) {
          boxSensorCollectionReference
            .doc(this.boxSensorID)
            .set(newBoxSensorDocument)
            .then(() => {
              console.log("Updated sensor document");
            });
          const boxSensorUpdateIndex = this.sensors.findIndex(
            sensor => sensor.documentID === this.boxSensorID
          );
          this.sensors.splice(boxSensorUpdateIndex, 1, {
            documentID: this.boxSensorID,
            UIDBoxGarden: this.boxGardenID,
            ...newBoxSensorDocument
          });
          this.boxSensorID = null;
        } else {
          boxSensorCollectionReference
            .add(newBoxSensorDocument)
            .then(docRef => {
              this.sensors.push({
                documentID: docRef.id,
                UIDBoxGarden: this.boxGardenID,
                ...newBoxSensorDocument
              });
            })
            .catch(err =>
              console.log("Error adding document to subcollection ", err)
            );
        }
      }
      this.boxGardenSensorModel = {
        sensorName: "",
        UIDBoxGarden: "",
        type: "",
        UIDSensor: "",
        unitOfMeasurement: ""
      };
      this.openBoxGardenSensorDialog = false;
    },
    onCancelBoxGardenDialogClick() {
      this.boxGardenModel = {
        boxGardenName: null,
        geoPoint: {
          Latitude: null,
          Longitude: null
        },
        address: "",
        location: ""
      };
      this.boxGardenID = null;
      this.openBoxGardenDialog = false;
    },
    onCancelBoxGardenSensorDialogClick() {
      this.boxGardenSensorModel = {
        sensorName: "",
        UIDBoxGarden: "",
        type: "",
        UIDSensor: "",
        unitOfMeasurement: ""
      };
      this.boxGardenID = null;
      this.openBoxGardenSensorDialog = false;
    },
    onUpdateBoxGarden(boxGarden) {
      this.boxGardenID = boxGarden.id;
      this.boxGardenModel = {
        ...boxGarden,
        geoPoint: {
          Latitude: boxGarden.geoPoint.latitude,
          Longitude: boxGarden.geoPoint.longitude
        }
      };
      this.openBoxGardenDialog = true;
    },
    onUpdateBoxGardenSensor(boxGarden, boxGardenSensor) {
      this.boxGardenSensorModel = {
        UIDSensor: boxGardenSensor.UIDSensor,
        type: boxGardenSensor.type,
        sensorName: boxGardenSensor.sensorName,
        unitOfMeasurement: boxGardenSensor.unitOfMeasurement
      };
      this.boxGardenID = boxGarden.id;
      this.boxSensorID = boxGardenSensor.documentID;
      this.openBoxGardenSensorDialog = true;
    },
    onDeleteBoxGarden(boxGarden) {
      this.$q
        .dialog({
          title: "Delete",
          message: "Confirm deletion.",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          const boxGardenDocumentReference = this.$db
            .collection("boxGarden")
            .doc(boxGarden.id);
          this.sensors.forEach(sensor => {
            if (boxGarden.id === sensor.UIDBoxGarden) {
              boxGardenDocumentReference
                .collection("boxSensor")
                .doc(sensor.documentID)
                .delete();
            }
          });
          boxGardenDocumentReference.delete();
          this.sensors.forEach((sensor, index) => {
            if (sensor.UIDBoxGarden === boxGarden.id) {
              this.sensors.splice(index, 1);
              index -= 1;
            }
          });
          const boxGardenIndex = this.boxGardens.findIndex(
            garden => garden.id === boxGarden.id
          );
          this.boxGardens.splice(boxGardenIndex, 1);
        });
    },
    onDeleteBoxGardenSensor(boxGarden, boxGardenSensor) {
      this.$q
        .dialog({
          title: "Delete",
          message: "Confirm deletion.",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          const boxSensorDocumentReference = this.$db
            .collection("boxGarden")
            .doc(boxGarden.id)
            .collection("boxSensor")
            .doc(boxGardenSensor.documentID);
          boxSensorDocumentReference
            .delete()
            .then(() => {
              console.log("Deleted");
              const indexOfDeleted = this.sensors.findIndex(
                sensor => sensor.documentID === boxGardenSensor.documentID
              );
              this.sensors.splice(indexOfDeleted, 1);
            })
            .catch(err => console.log("Error deleting boxSensor ", err));
        });
    }
  }
};
</script>
