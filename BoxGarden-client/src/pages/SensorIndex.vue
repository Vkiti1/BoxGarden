<template>
  <div class="q-pa-lg row justify-center">
    <div class="col" style="max-width: 500px">
      <q-table
        v-if="isMounted"
        title="Sensors"
        :data="sensors"
        :columns="columns"
        row-key="UIDSensor"
        flat
      >
        <template v-slot:top>
          <q-btn color="green" label="Add sensor" @click="onNewRow" />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="props.col.name === 'actions'">
              <q-btn
                dense
                color="green"
                icon="edit"
                @click="onUpdateRow(props.row)"
              />
              <q-btn
                dense
                color="green"
                icon="delete"
                @click="onDeleteRow(props.row)"
              />
            </div>
            <div v-else>
              {{ props.row[props.col.field] }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-if="openDialog" v-model="openDialog">
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Sensor</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            ref="Type"
            :error="!sensor.type || sensor.type.length === 0"
            error-message="Type is required."
            label="Type"
            v-model="sensor.type"
          />
          <q-input
            ref="Unit Of Measure"
            :error="
              !sensor.unitOfMeasurement || sensor.type.unitOfMeasurement === 0
            "
            error-message="Unit of measure is required."
            label="Unit Of Measure"
            v-model="sensor.unitOfMeasurement"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="green" label="OK" @click="onOKClick" />
          <q-btn color="green" label="Cancel" @click="onCancelClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "SensorsIndex",
  data() {
    return {
      openDialog: false,
      sensor: null,
      sensorModel: {
        UIDSensor: null,
        type: null,
        unitOfMeasurement: null
      },
      isMounted: false,
      sensors: [],
      columns: [
        {
          name: "type",
          label: "Type",
          align: "left",
          field: "type",
          sortable: true
        },
        {
          name: "unitOfMeasurement",
          label: "Unit of Measure",
          align: "left",
          field: "unitOfMeasurement",
          sortable: true
        },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          field: null,
          sortable: false
        }
      ]
    };
  },
  mounted: function() {
    let collectionRef = this.$db.collection("sensor");
    collectionRef.get().then(rows => {
      rows.forEach(row => {
        this.sensors.push(row.data());
      });
      this.isMounted = true;
    });
  },
  methods: {
    onNewRow() {
      this.sensor = JSON.parse(JSON.stringify(this.sensorModel));
      this.openDialog = true;
    },
    onOKClick() {
      if (
        !this.$refs["Type"].hasError &&
        !this.$refs["Unit Of Measure"].hasError
      ) {
        let collectionRef = this.$db.collection("sensor");
        if (this.sensor.UIDSensor === null) {
          collectionRef
            .add(this.sensor)
            .then(doc => {
              this.sensor.UIDSensor = doc.id;
              var docRef = this.$db.collection("sensor").doc(doc.id);
              docRef
                .update({ UIDSensor: doc.id })
                .then(response => {
                  this.sensor.UIDSensor = doc.id;
                  this.sensors.push(this.sensor);
                  this.openDialog = false;
                })
                .catch(function(error) {
                  console.error("Error adding document: ", error);
                });
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        } else {
          var docRef = this.$db.collection("sensor").doc(this.sensor.UIDSensor);
          docRef
            .set(this.sensor)
            .then(response => {
              let sensor = this.sensors.find(
                sensor => sensor.UIDSensor === this.sensor.UIDSensor
              );
              if (sensor) {
                for (const attributeName in this.sensor) {
                  sensor[attributeName] = JSON.parse(
                    JSON.stringify(this.sensor[attributeName])
                  );
                }
              }
              this.openDialog = false;
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      }
    },
    onCancelClick() {
      this.openDialog = false;
    },
    onUpdateRow(sensor) {
      this.sensor = JSON.parse(JSON.stringify(this.sensorModel));
      for (const attributeName in this.sensor) {
        this.sensor[attributeName] = JSON.parse(
          JSON.stringify(sensor[attributeName])
        );
      }
      this.openDialog = true;
    },
    onDeleteRow(row) {
      this.$q
        .dialog({
          title: "Delete",
          message: "Confirm deletion.",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          let docRef = this.$db.collection("sensor").doc(row.UIDSensor);
          docRef
            .delete()
            .then(() => {
              let index = this.sensors.findIndex(
                sensor => sensor.UIDSensor === row.UIDSensor
              );
              if (index >= 0) {
                this.sensors.splice(index, 1);
              }
            })
            .catch(error => {
              console.error("Error removing document: ", error);
            });
        });
    }
  }
};
</script>
