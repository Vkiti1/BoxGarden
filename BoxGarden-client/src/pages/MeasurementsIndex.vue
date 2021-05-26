<template>
  <div class="q-pa-lg row justify-center">
    <div class="col " style="max-width: 600px">
      <q-table
        title="Measurements"
        :data="measurements"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:top>
          <q-btn
            color="green"
            label="Add measurement"
            @click="addNewMeasurement"
          />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="props.col.name === 'actions'">
              <q-btn
                dense
                color="green"
                icon="edit"
                @click="onUpdateMeasurement(props.row)"
              />
              <q-btn
                dense
                color="green"
                icon="delete"
                @click="onDeleteMeasurement(props.row)"
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
          <div class="text-h6">Measurement</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-date
            ref="Date"
            v-model="measurementsModel.measurementDateTime"
            minimal
          />
          <q-input
            ref="Measurement value"
            :error="
              !measurementsModel.measurementValue ||
                measurementsModel.measurementValue === 0
            "
            error-message="Measurement value is required."
            label="Measurement value"
            v-model.number="measurementsModel.measurementValue"
          />
          <q-input
            ref="Unit of measurement"
            :error="
              !measurementsModel.unitOfMeasurement ||
                measurementsModel.unitOfMeasurement === 0
            "
            error-message="Unit of measurement is required."
            label="Unit of measurement"
            v-model.number="measurementsModel.unitOfMeasurement"
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
import firebase from "firebase/app";
export default {
  name: "MeasurementsIndex",
  data() {
    return {
      openDialog: false,
      measurements: [],
      measurementsModel: {
        measurementDateTime: new Date(),
        measurementValue: null,
        unitOfMeasurement: null
      },
      columns: [
        {
          name: "ID",
          label: "Measurement",
          align: "left",
          field: "id",
          sortable: true
        },
        {
          name: "measurementDateTime",
          label: "Date Time",
          align: "left",
          field: "measurementDateTime",
          sortable: true
        },
        {
          name: "measurementValue",
          label: "Value",
          align: "left",
          field: "measurementValue",
          sortable: true
        },
        {
          name: "unitOfMeasurement",
          label: "Unit",
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
      ],
      measurementID: null
    };
  },
  mounted: async function() {
    let collectionRef = this.$db.collection("measurements");
    const measurements = await collectionRef.get();
    measurements.forEach(measurement => {
      const measurementData = measurement.data();
      this.measurements.push({
        ...measurementData,
        measurementDateTime: measurementData.measurementDateTime
          .toDate()
          .toDateString(),
        id: measurement.id
      });
    });
  },
  methods: {
    addNewMeasurement() {
      this.openDialog = true;
    },
    async onOKClick() {
      if (!this.$refs["Measurement value"].hasError) {
        const boxMeasurementCollection = this.$db.collection("measurements");
        const timeStamp = new Date(this.measurementsModel.measurementDateTime);
        const newMeasurement = {
          measurementDateTime: firebase.firestore.Timestamp.fromDate(timeStamp),
          measurementValue: this.measurementsModel.measurementValue,
          unitOfMeasurement: this.measurementsModel.unitOfMeasurement
        };
        if (this.measurementID) {
          try {
            const docRef = await boxMeasurementCollection
              .doc(this.measurementID)
              .set(newMeasurement);
            newMeasurement.measurementDateTime = timeStamp.toDateString();
            const index = this.measurements.findIndex(
              measurement => measurement.id === this.measurementID
            );
            this.measurements.splice(index, 1, {
              ...newMeasurement,
              id: this.measurementID
            });
          } catch (err) {
            console.log("Failed updating document: ", err);
          }
          this.measurementID = null;
        } else {
          const docRef = await boxMeasurementCollection.add(newMeasurement);
          newMeasurement.id = docRef.id;
          newMeasurement.measurementDateTime = timeStamp.toDateString();
          this.measurements.push(newMeasurement);
        }
        this.measurementsModel = {
          measurementDateTime: new Date(),
          measurementValue: null,
          unitOfMeasurement: null
        };
        this.openDialog = false;
      }
    },
    onCancelClick() {
      this.measurementID = null;
      this.openDialog = false;
    },

    onDeleteMeasurement(measurementToDelete) {
      this.$q
        .dialog({
          title: "Delete",
          message: "Confirm deletion.",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          const measurementCollectionRef = this.$db.collection("measurements");
          measurementCollectionRef
            .doc(measurementToDelete.id)
            .delete()
            .then(() => console.log("Deleted measurement"))
            .catch(err => console.log("Failed to delete measurement: ", err));
          const index = this.measurements.findIndex(
            measurement => measurement.id === measurementToDelete.id
          );
          this.measurements.splice(index, 1);
        });
    },
    onUpdateMeasurement(measurement) {
      this.measurementsModel = { ...measurement };
      this.measurementID = measurement.id;
      this.openDialog = true;
    }
  }
};
</script>
