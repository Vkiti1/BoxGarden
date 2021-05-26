<template>
  <q-page>
    <div v-if="showMap">
      <GmapMap
        :center="{ lat: 45, lng: 15 }"
        :zoom="7"
        map-type-id="terrain"
        style="width: 100%; height: calc(100vh - 50px)"
      >
        <GmapMarker
          :key="index"
          v-for="(boxGarden, index) in boxGardens"
          :position="boxGarden.marker"
          :clickable="true"
          :title="boxGarden.data.boxGardenName"
          :label="boxGarden.data.boxGardenName"
          @click="boxGarden.isOpened = !boxGarden.isOpened"
        >
          <GmapInfoWindow :opened="boxGarden.isOpened">
            <box-garden-info-window :boxGarden="boxGarden" />
          </GmapInfoWindow>
        </GmapMarker>
      </GmapMap>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
      <q-btn
        size="1.5rem"
        flat
        round
        @click="showMap = !showMap"
        icon="map"
      ></q-btn>
      <q-btn
        size="1.5rem"
        flat
        round
        icon="insights"
        @click="showCharts = !showCharts"
      ></q-btn>
    </div>
    <div
      v-if="showCharts"
      style="width: 100%; display: flex; flex-wrap: wrap; justify-content: center"
    >
      <div style="width: 80%;">
        <line-chart
          v-if="loaded"
          :chartData="temperatureMeasurements"
        ></line-chart>
      </div>
      <div style="width: 80%;">
        <line-chart v-if="loaded" :chartData="lightMeasurements"></line-chart>
      </div>
      <div style="width: 80%;">
        <line-chart
          v-if="loaded"
          :chartData="moistureMeasurements"
        ></line-chart>
      </div>
      <div style="width: 50%; padding-left: 50px;">
        <polar-area v-if="loaded" :chartData="boxGardens"> </polar-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import BoxGardenInfoWindow from "../components/BoxGardenInfoWindow";
import LineChart from "../components/LineChart";
import PolarArea from "../components/PolarArea";
export default {
  name: "WelcomePageIndex",
  components: { BoxGardenInfoWindow, LineChart, PolarArea },
  data() {
    return {
      loaded: false,
      boxGardens: [],
      measurements: [],
      temperatureMeasurements: [],
      moistureMeasurements: [],
      lightMeasurements: [],
      showMap: true,
      showCharts: false
    };
  },
  async mounted() {
    const boxGardenCollectionReference = this.$db.collection("boxGarden");
    const measurementsCollectionReference = this.$db.collection("measurements");
    try {
      const measurementsObserver = await measurementsCollectionReference.onSnapshot(
        querySnapshot => {
          querySnapshot.forEach(doc => {
            const measurementData = doc.data();
            if (measurementData.unitOfMeasurement === "Celsius") {
              this.temperatureMeasurements.push({
                data: measurementData,
                id: doc.id
              });
            }
            if (measurementData.unitOfMeasurement === "lux") {
              this.lightMeasurements.push({
                data: measurementData,
                id: doc.id
              });
            }
            if (measurementData.unitOfMeasurement === "%") {
              this.moistureMeasurements.push({
                data: measurementData,
                id: doc.id
              });
            }
            this.measurements.push({
              data: measurementData,
              id: doc.id
            });
          });
        },
        err => {
          console.log("Measurements query error: ", err);
        }
      );
      const boxGardenObserver = await boxGardenCollectionReference.onSnapshot(
        querySnapshot => {
          querySnapshot.docChanges().forEach(async docChange => {
            if (docChange.type === "added") {
              const boxSensorCollectionReference = boxGardenCollectionReference
                .doc(docChange.doc.id)
                .collection("boxSensor");
              const boxSensorArray = [];
              const boxSensorObserver = await boxSensorCollectionReference.onSnapshot(
                querySnapshot => {
                  querySnapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                      boxSensorArray.push({
                        data: change.doc.data(),
                        id: change.doc.id
                      });
                    }
                    if (change.type === "modified") {
                      const boxGardenIndex = this.boxGardens.findIndex(
                        boxGarden => boxGarden.id === docChange.doc.id
                      );
                      const boxSensorIndex = this.boxGardens[
                        boxGardenIndex
                      ].boxSensors.findIndex(
                        boxSensor => boxSensor.id === change.doc.id
                      );
                      this.boxGardens[boxGardenIndex].boxSensors.splice(
                        boxSensorIndex,
                        1,
                        {
                          data: change.doc.data(),
                          id: change.doc.id
                        }
                      );
                    }
                    if (change.type === "removed") {
                      const boxGardenIndex = this.boxGardens.findIndex(
                        boxGarden => boxGarden.id === docChange.doc.id
                      );
                      const boxSensorIndex = this.boxGardens[
                        boxGardenIndex
                      ].boxSensors.findIndex(
                        boxSensor => boxSensor.id === change.doc.id
                      );
                      this.boxGardens[boxGardenIndex].boxSensors.splice(
                        boxSensorIndex,
                        1
                      );
                    }
                  });
                },
                err => {
                  console.log("Box Sensor query error: ", err);
                }
              );
              this.boxGardens.push({
                data: docChange.doc.data(),
                id: docChange.doc.id,
                marker: {
                  lat: docChange.doc.data().geoPoint.latitude,
                  lng: docChange.doc.data().geoPoint.longitude
                },
                isOpened: false,
                boxSensors: boxSensorArray
              });
            }
            if (docChange.type === "modified") {
              const index = this.boxGardens.findIndex(
                boxGarden => boxGarden.id === docChange.doc.id
              );
              this.boxGardens.splice(index, 1, {
                ...this.boxGardens[index],
                data: docChange.doc.data(),
                id: docChange.doc.id,
                marker: {
                  lat: docChange.doc.data().geoPoint.latitude,
                  lng: docChange.doc.data().geoPoint.longitude
                },
                isOpened: false
              });
            }
            if (docChange.type === "removed") {
              const index = this.boxGardens.findIndex(
                boxGarden => boxGarden.id === docChange.doc.id
              );
              this.boxGardens.splice(index, 1);
            }
          });
        },
        err => {
          console.log("Box garden query error: ", err);
        }
      );
      this.loaded = true;
    } catch (err) {
      console.error(err);
    }
  }
};
</script>
