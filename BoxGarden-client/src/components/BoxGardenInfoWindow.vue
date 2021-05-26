<template>
  <q-card>
    <q-card-section>
      <p class="garden-p">
        <strong class="strong-gardens">Name:</strong>
        {{ boxGarden.data.boxGardenName }}
      </p>
      <p class="garden-p">
        <strong class="strong-gardens">Location:</strong>
        {{ boxGarden.data.location }}
      </p>
      <p class="garden-p">
        <strong class="strong-gardens">Address:</strong>
        {{ boxGarden.data.address }}
      </p>
      <q-card>
        <div class="text-h6" style="padding-left: 5px; font-size: 1rem">
          Sensors:
        </div>
        <q-card-section
          :key="index"
          v-for="(sensor, index) in boxGarden.boxSensors"
        >
          <div
            style="border: 2px solid gray; border-radius: 5px; padding: 5px 5px; box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.1)"
          >
            <div class="row">
              <strong class="strong-sensors">{{ index + 1 }}. sensor:</strong>
            </div>
            <q-separator size="10px" color="transparent" />
            <div class="row sensor-div">
              <p>
                <strong class="strong-sensors">Sensor name: </strong>
                {{ sensor.data.sensorName }}
              </p>
            </div>
            <div class="row sensor-div">
              <p>
                <strong class="strong-sensors">Sensor type: </strong>
                {{ sensor.data.type }}
              </p>
            </div>
            <div class="row sensor-div">
              <p>
                <strong class="strong-sensors">Unit of measurement: </strong>
                {{ sensor.data.unitOfMeasurement }}
              </p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: "BoxGardenInfoWindow",
  props: {
    boxGarden: {
      type: Object,
      required: true
    }
  }
};
</script>
