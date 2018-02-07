import Chart from 'chart.js';

export default class DataSet {
  constructor(sqlTable) {
    this.dimKeys = [];
    this.valueKeys = [];
    this.current = {
      x: null,
      y: null,
      value: null
    };
    this.data = {
      raw: null,
      dimX: [],
      dimY: [],
      XTotals: {},
      YTotals: {},
      GrandTotal: 0.0,
      compiled: {}
    };
    this.chart = {
      labels: [],
      datasets: [],
      axes: []
    };
    this.table = sqlTable;
    this.filters = [];
    this.domElement = null;
    this.chartElement = null;
    this.title = "";
    this.showTotals = true;
  }

  addDim(group, name, field) {
    const newDim = {group, name, field};
    this.dimKeys.push(newDim);
  }

  addValue(group, name, field) {
    const newDim = {group, name, field};
    this.valueKeys.push(newDim);
  }

  setCurrentDimX(name) {
    const dimKey = this._getKeyFromName(name, this.dimKeys);
    if(this.current.y === dimKey) {
      this.current.y = this.current.x;
    }
    this.current.x = dimKey;
  }

  setShowTotals(bool) {
    this.showTotals = bool;
  }

  setCurrentDimY(name) {
    const dimKey = this._getKeyFromName(name, this.dimKeys);
    if(this.current.x === dimKey) {
      this.current.x = this.current.y;
    }
    this.current.y = dimKey;
  }

  setCurrentValues(name) {
    this.current.value = this._getKeyFromName(name, this.valueKeys);
  }

  setDOMElement(id) {
    this.domElement = document.querySelector(`#${id}`);
  }

  setTitle(string) {
    this.title = string;
  }
  addFilter(name, criteria) {
    const dimKey = this._getKeyFromName(name, this.dimKeys);
    this.filters.push({dimKey, criteria});
  }

  clearFilter() {
    this.filters = [];
  }

  _getTableHTML() {
    let html = "<table class='DSTable'><colgroup><col class='DSTableColHeader'>";
    for (let i = 0; i < this.data.dimX.length; i++) {
      html += "<col class='DSTableColData'>";
    }
    if(this.showTotals) {
      html += "<col class='DSTableColData'>";
    }
    html += "</colgroup><tr><th></th>";
    for (let i = 0; i < this.data.dimX.length; i++) {
      html += `<th>${this.data.dimX[i]}</th>`;
    }
    if(this.showTotals) {
      html += `<th>Total</th>`;
    }
    for (let i = 0; i < this.data.dimY.length; i++) {
      html += `<tr><th>${this.data.dimY[i]}</th>`;
      for (let j = 0; j < this.data.dimX.length; j++) {
        html += "<td>";
        if(this.data.compiled[this.data.dimX[j]].hasOwnProperty([this.data.dimY[i]])) {
          html += this.data.compiled[this.data.dimX[j]][this.data.dimY[i]].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
          html += "0";
        }
        html += "</td>";
      }
      if(this.showTotals) {
        html += "<td>";
        html += this.data.YTotals[this.data.dimY[i]].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        html += "</td>";
      }
      html += "</tr>";
    }

    if(this.showTotals) {
      html += `<tr><th>Total</th>`;
      for (let j = 0; j < this.data.dimX.length; j++) {
        html += "<td>";
        html += this.data.XTotals[this.data.dimX[j]].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        html += "</td>";
      }
      html += `<td>${this.data.GrandTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>`;
    }

    html += "</table>";
    return html;
  }

  _renderChart() {
    const chart = new Chart(this.chartElement, {
      type: 'line',
      data: {
        labels: this.chart.labels,
        datasets: this.chart.datasets
      },
      options: {
        responsive: false,
        scales: {
          yAxes: this.chart.axes
        }
      }
    });
  }

  _compileChartdata(data) {
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

  _render() {
    let html = `<h2>${this.title}</h2><canvas></canvas>`;
    html += this._getTableHTML();
    this.domElement.innerHTML = html;
    this.chartElement = this.domElement.childNodes[1].getContext('2d');
    this._renderChart();
  }

  refreshData() {
    this._ajaxGetData(this._generateSQL(this.current.x, this.current.y, this.current.value, this.table, this.filters), (this._updateData).bind(this));
  }

  _updateData(data) {
    this.data = this._compileData(data);
    this.chart = this._compileChartdata(this.data);
    this._render();
  }

  _compileData(data) {
    //pure function
    if(data.length < 1)
    return null;

    const newData = {};
    newData.dimX = [];
    newData.dimY = [];
    newData.compiled = {};
    newData.raw = data;
    newData.XTotals = {};
    newData.YTotals = {};
    newData.GrandTotal = 0.0;

    const dimXName = data[0][0]["name"];
    const dimYName = data[0][1]["name"];
    const dimValue = data[0][2]["name"];

    data.forEach((row, i) => {
      if(i === 0)
      return;
      if(!newData.dimX.includes(row[dimXName])) {
        newData.dimX.push(row[dimXName]);
        newData.compiled[row[dimXName]] = {};
        newData.XTotals[row[dimXName]] = 0.0;
      }
      if(!newData.dimY.includes(row[dimYName])) {
        newData.dimY.push(row[dimYName]);
        newData.YTotals[row[dimYName]] = 0.0;
      }
      newData.XTotals[row[dimXName]] += row[dimValue];
      newData.YTotals[row[dimYName]] += row[dimValue];
      newData.GrandTotal += row[dimValue];
      newData.compiled[row[dimXName]][row[dimYName]] = row[dimValue];
    });
    newData.dimX = this._sortDimensionX(newData.dimX);
    newData.dimY = this._sortDimensionY(newData.dimY);
    return newData;
  }

  _sortDimensionX(array) {
    return array.sort();
  }

  _sortDimensionY(array) {
    return array.sort();
  }

  _generateSQL(dimx, dimy, value, table, filters) {
    //pure function
    let sql = `SELECT ${dimx.field}, ${dimy.field}, SUM(${value.field}) as ${value.field} FROM ${table}`;
    for (let i = 0; i < filters.length; i++) {
      if(i === 0)
      sql += " WHERE ";
      else
      sql += " AND ";
      sql += `${filters[i].dimKey.field} ${filters[i].criteria}`;
    }
    sql += ` GROUP BY ${dimx.field}, ${dimy.field} ORDER BY ${dimx.field}, ${dimy.field};`;
    return sql;
  }

  _getKeyFromName(name, keys) {
    //pure function
    for (let i = 0; i < keys.length; i++) {
      if(keys[i].name === name) {
        return keys[i];
      }
    }
    return null;
  }

  _ajaxGetData(sql, callback) {
    fetch("/data/", {
      method: 'POST',
      body: JSON.stringify({sql}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((response) => {
      return response.json()
    }).then((data) => {
      callback(data)
    });
  }
}
