/** @jsx preact.h */

import preact, { Component } from 'preact'
import classNames from 'classnames'

const backgroundColors = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'
]
const borderColors = [
  '#FF0033',
  '#008DEB',
  '#FFBC00',
  '#00C1C1',
  '#752FFF',
  '#FF9122'
]

export default class ChartComponent extends Component {
  constructor (props) {
    super(props)
    this.setCanvas = this.setCanvas.bind(this)
  }

  setCanvas (node) { this.canvas = node }

  componentDidUpdate () {
    const {labels, datasets} = getDataFromTable(this.props.table)
    this.chart.data.labels = labels
    this.chart.data.datasets = datasets
    this.chart.update()
    this.chart.resize()
  }

  componentDidMount () {
    const {labels, datasets} = getDataFromTable(this.props.table)
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        animation: {
          duration: 0,
          animateRotate: false,
          animateScale: false
        },
        scales: {
          xAxes: [{
            stacked: false
          }],
          yAxes: [{
            stacked: false,
            ticks: { beginAtZero: true }
          }]
        }
      }
    })
  }

  render () {
    return (
      <div style="width: 700px;">
        <canvas ref={this.setCanvas} width="700" height="300"></canvas>
      </div>
    )
  }
}

ChartComponent.displayName = 'ChartComponent'

function getDataFromTable (table) {
  let datasets = []
  Array.from(table.querySelectorAll('thead tr th'))
  .forEach((th, index) => {
    if (index === 0) return
    datasets.push({
      label: th.textContent,
      lineTension: 0,
      data: [],
      backgroundColor: backgroundColors.slice(index - 1, index)[0],
      borderColor: borderColors.slice(index - 1, index)[0]
    })
  })
  const tbodyRows = table.querySelectorAll('tbody tr')
  Array.from(tbodyRows).forEach((row) => {
    Array.from(row.querySelectorAll('td')).forEach((td, index) => {
      datasets[index].data.push(parseFloat(td.textContent))
    })
  })
  let labels = []
  Array.from(tbodyRows).forEach((row) => {
    const label = row.querySelector('th').textContent
    labels.push(label)
  })
  return {labels, datasets}
}
