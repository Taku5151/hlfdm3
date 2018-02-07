import React, { Component } from 'react'
import DataTable from './DataTable.jsx'

export default class DataModule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dimKeys: [
        {}
      ],
      valueKeys: [],
      current: {
        x: null,
        y: null,
        value: null
      },
      data: {
        raw: null,
        dimX: [],
        dimY: [],
        XTotals: {},
        YTotals: {},
        GrandTotal: 0.0,
        compiled: {}
      },
      chart: {
        labels: [],
        datasets: [],
        axes: []
      },
      table: "",
      filters: [],
      domElement: null,
      chartElement: null,
      title: "",
      showTotals: true
    }
  }
  render() {
    return (
      <div className="container">
        <DataTable />
      </div>
    )
  }
}
