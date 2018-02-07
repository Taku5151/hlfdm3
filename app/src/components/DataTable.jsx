import React from 'react'
import PropTypes from 'prop-types'
//
// export default class DataTable extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       dimX: [],
//       dimY: [],
//       data: [],
//       totals: true
//     }
//   }
//   render() {
//     return (
//       <table className='DSTable'>
//
//       </table>
//     )
//   }
// }

function DataTable(props) {
  return (
    <table className='DSTable'>
      <colgroup>
        <col className='DSTableColHeader' />
        {this.props.dimCol.map(() =>
          <col className='DSTableColHeader' />
        )}
        {!this.props.showTotalsRow && (
          <col className='DSTableColHeader' />
        )}
      </colgroup>
      <thead>
        <tr>
          <th></th>
          {this.props.dimCol.map((dim) =>
            <th>{dim}</th>
          )}
          {!this.props.showTotalsRow && (
            <th>Total</th>
          )}
        </tr>
      </thead>
      <tbody>
        {this.props.dataMatrix.map((row, i) =>
          <tr>
            <th>{this.props.dimRow[i]}</th>
            {row.map((data) =>
              <td>{data}</td>
            )}
            {!this.props.showTotalsRow && (
              <th>{this.props.totalsRow[i]}</th>
            )}
          </tr>
        )}
        {!this.props.showTotalsCol && (
          <tr>
            <th>Total</th>
            {this.props.totalsCol.map((total) =>
              <td>{total}</td>
            )}
            {!this.props.showTotalsRow && (
              <td>{this.props.grandTotal}</td>
            )}
          </tr>
        )}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  dimCol: PropTypes.array,
  dimRow: PropTypes.array,
  dataMatrix: PropTypes.array,
  showTotalsCol: PropTypes.bool,
  showTotalsRow: PropTypes.bool,
  totalsCol: PropTypes.array,
  totalsRow: PropTypes.array,
  grandTotal: PropTypes.number
}

DataTable.defaultProps = {
  dimCol: [],
  dimRow: [],
  dataMatrix: [[]],
  showTotalsCol: true,
  showTotalsRow: true,
  totalsCol: [],
  totalsRow: [],
  grandTotal: 0.0
}

export default DataTable;
