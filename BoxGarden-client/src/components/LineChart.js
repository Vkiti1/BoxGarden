import { Line } from "vue-chartjs";

export default {
  extends: Line,
  name: "LineChart",
  props: {
    chartData: {
      type: Array
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: null,
                suggestedMax: null
              }
            }
          ]
        },
        elements: {
          point: {
            backgroundColor: "rgba(125, 125, 125, 1)",
            borderColor: "rgba(125, 125, 125, 1)"
          }
        }
      },
      label: "",
      backgroundColor: "",
      borderColor: ""
    };
  },
  mounted() {
    console.log(this.chartData.data);
    if (this.chartData[0].data.unitOfMeasurement === "Celsius") {
      this.options.scales.yAxes[0].ticks.suggestedMin = 24;
      this.options.scales.yAxes[0].ticks.suggestedMax = 28;
      this.label = "degree Celsius";
      this.borderColor = "rgba(255, 90, 90, 1)";
      this.backgroundColor = "rgba(255,90,90,0.4)";
    }
    if (this.chartData[0].data.unitOfMeasurement === "lux") {
      console.log(this.options.scales.yAxes[0].ticks);
      this.options.scales.yAxes[0].ticks.suggestedMin = 390;
      this.options.scales.yAxes[0].ticks.suggestedMax = 410;
      this.label = "lux";
      this.borderColor = "rgba(255, 255, 0, 1)";
      this.backgroundColor = "rgba(255,255,114,0.3)";
    }
    if (this.chartData[0].data.unitOfMeasurement === "%") {
      this.options.scales.yAxes[0].ticks.suggestedMin = 50;
      this.options.scales.yAxes[0].ticks.suggestedMax = 59;
      this.label = "humidity %";
      this.borderColor = "rgba(121, 0, 255, 1)";
      this.backgroundColor = "rgba(121, 0, 255, 0.4)";
    }
    const values = [];
    const dates = [];
    this.chartData.forEach(measurement => {
      values.push(measurement.data.measurementValue);
      dates.push(
        `${measurement.data.measurementDateTime
          .toDate()
          .toDateString()} ${measurement.data.measurementDateTime
          .toDate()
          .getHours()}:${measurement.data.measurementDateTime
          .toDate()
          .getMinutes()}:${measurement.data.measurementDateTime
          .toDate()
          .getSeconds()}`
      );
    });
    dates.sort();
    this.renderChart(
      {
        labels: dates,
        datasets: [
          {
            label: this.label,
            data: values,
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            tension: 0.01
          }
        ]
      },
      this.options
    );
  }
};
