/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Button from '@inovua/reactdatagrid-community/packages/Button';
import CheckBox from '@inovua/reactdatagrid-community/packages/CheckBox';
import NumericInput from '@inovua/reactdatagrid-community/packages/NumericInput';

import DataGrid from '../../../enterprise-edition';
import { getGlobal } from '@inovua/reactdatagrid-community/getGlobal';

const globalObject = getGlobal();

import people from '../people';

const gridStyle = { minHeight: '80vh' };

const times = (arr, n, fn?) => {
  const result = [];

  for (var i = 0; i < n; i++) {
    result.push(
      ...arr.map(x => {
        if (fn) {
          return fn(x, i);
        }
        return {
          ...x,
          id: `${i}-${x.id}`,
        };
      })
    );
  }

  return result;
};
const defaultGroupBy = ['country'];

const defaultCellSelection = { '0-4,id': true, '0-4,desc': true };
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);

    (this as any).COLS = 28;

    let columns = times([{ name: 'id' }], (this as any).COLS, (_, i) => {
      return {
        name: `id-${i}`,
        id: `id-${i}`,
        // defaultLocked: i < 2 ? 'start' : i > COLS - 2 ? 'end' : false,
        // colspan: () => 1,
        // render: ({ value, rowIndex }) => {
        //   // console.log(`render ${rowIndex} - ${i}`);
        //   return value;
        // },
      };
    });

    this.state = {
      rtl: false,
      columns,
      rows: 1,
      dataSource: [],
    };
  }

  componentDidMount(): void {
    this.loadDataSource(this.state.rows);
  }

  loadDataSource = n => {
    const data = times(
      [
        [...new Array((this as any).COLS)].reduce(
          (acc, _, i) => {
            acc[`id-${i}`] = i;
            return acc;
          },
          { id: 0 }
        ),
      ],
      n
    );

    this.setState({ dataSource: data });
  };

  onRowsChange = rows => {
    this.setState({ rows });
  };

  render() {
    if (!process.browser) {
      return null;
    }

    const numericProps = {
      theme: 'default-dark',
      style: { minWidth: 150 },
      value: this.state.rows,
      onChange: this.onRowsChange,
    };

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <CheckBox
            checked={this.state.rtl}
            onChange={value => this.setState({ rtl: value })}
          >
            RTL
          </CheckBox>
        </div>
        <div style={{ marginBottom: 20 }}>
          <NumericInput {...numericProps} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Button
            style={{ minWidth: 150 }}
            onClick={() => {
              this.loadDataSource(this.state.rows);
            }}
          >
            Set rows
          </Button>
        </div>
        <DataGrid
          idProperty="id"
          style={gridStyle}
          handle={x => {
            (globalObject as any).x = x;
          }}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          virtualizeColumnsThreshold={3}
          virtualizeColumns
          rtl={this.state.rtl}
          // virtualizeColumnsThreshold={10}
        />
      </div>
    );
  }
}

export default () => <App />;
