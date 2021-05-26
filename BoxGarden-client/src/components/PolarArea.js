import { PolarArea } from "vue-chartjs";

export default {
  extends: PolarArea,
  name: "PolarArea",
  props: {
    chartData: {
      type: Array
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    const boxGardenNames = this.chartData.map(
      boxGarden => boxGarden.data.boxGardenName
    );
    const boxSensorsCount = this.chartData.map(
      boxGarden => boxGarden.boxSensors.length
    );
    this.renderChart(
      {
        labels: boxGardenNames,
        datasets: [
          {
            label: "Box sensors",
            data: boxSensorsCount,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(54, 162, 235)"
            ]
          }
        ]
      },
      this.options
    );
  }
};
