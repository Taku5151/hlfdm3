import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import logo from './../images/HLFLogo.png'
import './../css/reset.css';
import './../css/App.css';

import DataSet from './../objects/dataset.js';
import DataModule from './DataModule.jsx';
import * as Util from './util.js';
// import InputManager from './inputmanager.js';

const demandDS = new DataSet("demand");
const invtxnDS = new DataSet("invrftxn");
const invlineDS = new DataSet("invrfline");
const reserveDS = new DataSet("reserve");
const receiptsDS = new DataSet("receipts");
// const input = new InputManager();

let skutextbox;
let fromtextbox;
let totextbox;

demandDS.addDim("Date", "Month", "Period");
demandDS.addDim("Date", "Quarter", "Period");
demandDS.addDim("Date", "Year", "Period");
demandDS.addDim("Item", "Sku", "StockSKU");
demandDS.addDim("Scenario", "Scenario", "Scenario");
demandDS.addValue("Qty", "Qty", "Units");
demandDS.setCurrentDimX("Month");
demandDS.setCurrentDimY("Scenario");
demandDS.setCurrentValues("Qty");
demandDS.setTitle("Demand Forecast");
demandDS.setShowTotals(false);
demandDS._compileChartdata = (data) => {
  //pure function
  const newChartData = {};

  newChartData.labels = data.dimX;
  newChartData.datasets = [];

  const currentFC = data.dimY[data.dimY.length - 2];
  const lastFC = data.dimY[data.dimY.length - 3];
  const lag3FC = data.dimY[data.dimY.length - 5];
  const lag5FC = data.dimY[data.dimY.length - 7];

  const currentFCData = [];
  const lastFCData = [];
  const lag3FCData = [];
  const lag5FCData = [];

  data.dimX.forEach((x, i) => {
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty(currentFC)) {
      currentFCData[i] = data.compiled[x][currentFC];
    }
    else if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Actual")){
      currentFCData[i] = data.compiled[x]["Actual"];
    }
    else {
      currentFCData[i] = 0;
    }

    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty(lastFC)) {
      lastFCData[i] = data.compiled[x][lastFC];
    }
    else if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Actual")){
      lastFCData[i] = data.compiled[x]["Actual"];
    }
    else {
      lastFCData[i] = 0;
    }

    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty(lag3FC)) {
      lag3FCData[i] = data.compiled[x][lag3FC];
    }
    else if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Actual")){
      lag3FCData[i] = data.compiled[x]["Actual"];
    }
    else {
      lag3FCData[i] = 0;
    }

    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty(lag5FC)) {
      lag5FCData[i] = data.compiled[x][lag5FC];
    }
    else if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Actual")){
      lag5FCData[i] = data.compiled[x]["Actual"];
    }
    else {
      lag5FCData[i] = 0;
    }
  });

  newChartData.datasets.push({
    label: currentFC,
    fill: false,
    borderColor: 'rgb(255, 30, 30)',
    data: currentFCData
  });
  newChartData.datasets.push({
    label: lastFC,
    fill: false,
    borderColor: 'rgb(255, 153, 51)',
    data: lastFCData
  });
  newChartData.datasets.push({
    label: lag3FC,
    fill: false,
    borderColor: 'rgb(0, 204, 0)',
    data: lag3FCData
  });
  newChartData.datasets.push({
    label: lag5FC,
    fill: false,
    borderColor: 'rgb(51, 51, 255)',
    data: lag5FCData
  });

  newChartData.axes = [
    {
      position: "left",
      "id": "y1",
      ticks: {
        userCallback: function(value, index, values) {
          value = value.toString();
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
          return value;
        }
      }
    }
  ];

  return newChartData;
}

invtxnDS.addDim("Date", "Month", "Period");
invtxnDS.addDim("Location", "Org", "Org");
invtxnDS.addDim("Type", "Transtype", "Transtype");
invtxnDS.addDim("Item", "Sku", "Item");
invtxnDS.addValue("Qty", "Qty", "Qty");
invtxnDS.setCurrentDimX("Month");
invtxnDS.setCurrentDimY("Transtype");
invtxnDS.setCurrentValues("Qty");
invtxnDS.setTitle("Inventory Transactions by Type");
invtxnDS._compileChartdata = (data) => {
  //pure function
  const totals = [];
  data.dimX.forEach((x) => {
    totals.push(data.XTotals[x]);
  })

  const newChartData = {};

  newChartData.labels = data.dimX;
  newChartData.datasets = [];

  newChartData.datasets.push({
    label: "Total",
    fill: false,
    borderColor: 'rgb(255, 99, 132)',
    data: totals
  });


  const poReceipt = [];
  const soIssue = [];

  data.dimX.forEach((x, i) => {
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("PO Receipt")) {
      poReceipt[i] = data.compiled[x]["PO Receipt"];
    }
    else {
      poReceipt[i] = 0;
    }
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Sales order issue")) {
      soIssue[i] = data.compiled[x]["Sales order issue"];
    }
    else {
      soIssue[i] = 0;
    }
  });

  newChartData.datasets.push({
    label: "PO Receipts",
    fill: false,
    borderColor: 'rgb(51, 51, 255)',
    data: poReceipt
  });
  newChartData.datasets.push({
    label: "SO Issues",
    fill: false,
    borderColor: 'rgb(0, 204, 0)',
    data: soIssue
  });

  newChartData.axes = [
    {
      position: "left",
      "id": "y1",
      ticks: {
        beginAtZero: true,
        userCallback: function(value, index, values) {
          value = value.toString();
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
          return value;
        }
      }
    }
  ];

  return newChartData;
}

invlineDS.addDim("Date", "Month", "Period");
invlineDS.addDim("Location", "Org", "Org");
invlineDS.addDim("Item", "Sku", "Item");
invlineDS.addValue("Qty", "Qty", "EndQty");
invlineDS.setCurrentDimX("Month");
invlineDS.setCurrentDimY("Org");
invlineDS.setCurrentValues("Qty");
invlineDS.setTitle("Ending Inventory by Org");

reserveDS.addDim("Date", "Month", "Period");
reserveDS.addDim("Item", "Sku", "Item");
reserveDS.addDim("Type", "Type", "Type");
reserveDS.addValue("Dollar", "Dollar", "Dollar");
reserveDS.setCurrentDimX("Month");
reserveDS.setCurrentDimY("Type");
reserveDS.setCurrentValues("Dollar");
reserveDS.setTitle("Reserve Data");
reserveDS.setShowTotals(false);
reserveDS._generateSQL = (dimx, dimy, value, table, filters) => {
  //pure function
  let sql = "";
  const typeList = ["Inventory","UsageDollars","Scrap","SlowReserve","ExpiredReserve","SpecificReserve","FinalReserve","PLImpact"];

  typeList.forEach((o, i) => {
    if(i !== 0)
    sql+= " UNION ";
    sql += `SELECT ${dimx.field}, '${o}' as Type, SUM(${o}) as 'Dollar' FROM ${table}`;
    for (let i = 0; i < filters.length; i++) {
      if(i === 0)
      sql += " WHERE ";
      else
      sql += " AND ";
      sql += `${filters[i].dimKey.field} ${filters[i].criteria}`;
    }
    sql += ` GROUP BY ${dimx.field}, ${dimy.field}`;
  });
  sql += ` ORDER BY ${dimx.field};`;
  return sql;
}
reserveDS._sortDimensionY = (array) => {
  const typeList = ["Inventory","UsageDollars","Scrap","SlowReserve","ExpiredReserve","SpecificReserve","FinalReserve","PLImpact"];
  return array.sort((a,b) => {
    return (typeList.indexOf(a) - typeList.indexOf(b));
  })
}
reserveDS._compileChartdata = (data) => {
  //pure function
  const inventory = [];
  const finalReserve = [];
  const usageDollars = [];

  data.dimX.forEach((x, i) => {
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("Inventory")) {
      inventory[i] = data.compiled[x]["Inventory"];
    }
    else {
      inventory[i] = 0;
    }
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("FinalReserve")) {
      finalReserve[i] = data.compiled[x]["FinalReserve"];
    }
    else {
      finalReserve[i] = 0;
    }
    if(data.compiled.hasOwnProperty(x) && data.compiled[x].hasOwnProperty("UsageDollars")) {
      usageDollars[i] = data.compiled[x]["UsageDollars"];
    }
    else {
      usageDollars[i] = 0;
    }
  });

  const newChartData = {};

  newChartData.labels = data.dimX;
  newChartData.datasets = [];

  newChartData.datasets.push({
    label: "Inventory",
    yAxisID: "y1",
    fill: false,
    borderColor: 'rgb(255, 99, 132)',
    data: inventory
  });
  newChartData.datasets.push({
    label: "Final Reserve",
    yAxisID: "y1",
    fill: false,
    borderColor: 'rgb(51, 51, 255)',
    data: finalReserve
  });
  newChartData.datasets.push({
    label: "Usage Dollars",
    yAxisID: "y2",
    fill: false,
    borderColor: 'rgb(0, 204, 0)',
    data: usageDollars
  });

  newChartData.axes = [
    {
      position: "left",
      "id": "y1",
      ticks: {
        beginAtZero: true,
        userCallback: function(value, index, values) {
          value = value.toString();
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
          return value;
        }
      }
    },
    {
      position: "right",
      "id": "y2",
      ticks: {
        beginAtZero: true,
        userCallback: function(value, index, values) {
          value = value.toString();
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
          return value;
        }
      }
    }
  ];

  return newChartData;
}

receiptsDS.addDim("Date", "Month", "TxnDate");
receiptsDS.addDim("Item", "Sku", "Item");
receiptsDS.addDim("Type", "Type", "SourcePrice")
receiptsDS.addValue("Qty", "Qty", "Quantity");
receiptsDS.setCurrentDimX("Month");
receiptsDS.setCurrentDimY("Type");
receiptsDS.setCurrentValues("Qty");
receiptsDS.setTitle("Receipt Data");
receiptsDS._generateSQL = (dimx, dimy, value, table, filters) => {
  //pure function
  let sql = `SELECT DATE_FORMAT(txndate, "%Y-%m") as ${dimx.field}, CONCAT(source, '-', CurrencyCode, '-', ROUND(price, 2)) as ${dimy.field}, SUM(if(txntype='Return to Supplier', -Quantity, Quantity)) as ${value.field} FROM ${table}`;
  for (let i = 0; i < filters.length; i++) {
    if(i === 0)
    sql += " WHERE ";
    else
    sql += " AND ";
    sql += `${filters[i].dimKey.field} ${filters[i].criteria}`;
  }
  sql += ` GROUP BY DATE_FORMAT(txndate, "%Y-%m"), CONCAT(source, '-', CurrencyCode, '-', ROUND(price, 2)) ORDER BY ${dimx.field}, ${dimy.field};`;
  return sql;
}

function onLoad() {
  demandDS.setDOMElement("demandDS");
  invtxnDS.setDOMElement("invtxnDS");
  invlineDS.setDOMElement("invlineDS");
  reserveDS.setDOMElement("reserveDS");
  receiptsDS.setDOMElement("receiptsDS");
  resetInput();
}

function resetInput() {
  // const now = new Date();
  // const firstOfyear = new Date(now.getFullYear(), 0, 1);
  // const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  fromtextbox = document.querySelector("input[name='fromtextbox']");
  totextbox = document.querySelector("input[name='totextbox']");
  skutextbox = document.querySelector("input[name='skutextbox']");

  // fromtextbox.value = Util.UtilGetSQLDate(firstOfyear);
  // totextbox.value = Util.UtilGetSQLDate(lastMonth);
  // skutextbox.focus();
}

function executequery() {
  const fromDate = new Date(fromtextbox.value + " 00:00:00");
  const toDate = new Date(totextbox.value + " 00:00:00");

  demandDS.clearFilter();
  demandDS.addFilter("Month", `>='${fromtextbox.value}'`);
  demandDS.addFilter("Month", `<='${Util.UtilGetSQLDate(new Date(toDate.getFullYear(), toDate.getMonth() + 6, toDate.getDate()))}'`);
  demandDS.addFilter("Sku", `='${skutextbox.value}'`)  ;
  demandDS.refreshData();

  invtxnDS.clearFilter();
  invtxnDS.addFilter("Month", `>='${fromtextbox.value}'`);
  invtxnDS.addFilter("Month", `<='${totextbox.value}'`);
  invtxnDS.addFilter("Sku", `='${skutextbox.value}'`);
  invtxnDS.refreshData();

  invlineDS.clearFilter();
  invlineDS.addFilter("Month", `>='${Util.UtilGetSQLDate(new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate()))}'`);
  invlineDS.addFilter("Month", `<='${totextbox.value}'`);
  invlineDS.addFilter("Sku", `='${skutextbox.value}'`);
  invlineDS.refreshData();

  reserveDS.clearFilter();
  reserveDS.addFilter("Month", `>='${fromtextbox.value}'`);
  reserveDS.addFilter("Month", `<='${totextbox.value}'`);
  reserveDS.addFilter("Sku", `='${skutextbox.value}'`);
  reserveDS.refreshData();

  receiptsDS.clearFilter();
  receiptsDS.addFilter("Month", `>='${fromtextbox.value}'`);
  receiptsDS.addFilter("Month", `<='${Util.UtilGetSQLDate(new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0))}'`);
  receiptsDS.addFilter("Sku", `='${skutextbox.value}'`);
  receiptsDS.refreshData();

}





























export default class App extends Component {
  constructor(props) {
    super(props);

    const now = new Date();
    const firstOfyear = new Date(now.getFullYear(), 0, 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    this.state = {
      skuValue: '',
      fromValue: Util.UtilGetSQLDate(firstOfyear),
      toValue: Util.UtilGetSQLDate(lastMonth),
    }
  }

  changeHandler = (e) => {
    switch(e.target.name) {
      case "skutextbox":
      this.setState({ skuValue: e.target.value })
      break;
      case "fromtextbox":
      this.setState({ fromValue: e.target.value })
      break;
      case "totextbox":
      this.setState({ toValue: e.target.value })
      break;
      default:
      break;

    }
  }

  resetInput = () => {

  }
  //
  // submitHandler = (e) => {
  //     e.preventDefault()
  //
  //     this.props.addTodo(this.state.value)
  //
  //     this.setState({ value: '', })
  // }

  render() {
    return (
      <section>
        <header>
          <img src={logo} alt=""/>
          <h1>HLFDM</h1>
          <div>
            <label>SKU:</label>
            <input type="text" name="skutextbox" value={this.state.skuValue} onChange={this.changeHandler} />
            <label>From:</label>
            <input type="date" name="fromtextbox" value={this.state.fromValue} onChange={this.changeHandler} />
            <label>To:</label>
            <input type="date" name="totextbox" value={this.state.toValue} onChange={this.changeHandler} />
            <button name="skusubmit" onClick={executequery}>Search</button>
          </div>
        </header>
        <main>
          <div className="container" id="reserveDS">

          </div>
          <div className="container" id="invtxnDS">

          </div>
          <div className="container demandContainer" id="demandDS">

          </div>
          <div className="container" id="invlineDS">

          </div>
          <div className="container" id="receiptsDS">

          </div>
        </main>
      </section>
    )
  }

  componentDidMount() {
    onLoad();
  }
}
