import React from 'react';
import { useTable } from 'react-table';
import './ReactTable.css';

const ReactTableWithCheckbox = ({ columns, data, checked, setChecked }) => {
  // 체크박스를 렌더링하는 셀 컴포넌트
  const CheckboxCell = ({ row }) => (
    <input
      type="checkbox"
      checked={checked.includes(parseInt(row.id, 10))}
      onChange={() => {
        const rowId = parseInt(row.id, 10);
        setChecked(prev => 
          prev.includes(rowId)
            ? prev.filter(id => id !== rowId)
            : [...prev, rowId]
        );
      }}
    />
  );

  // 컬럼에 체크박스 컬럼 추가
  const allColumns = React.useMemo(() => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <input
          type="checkbox"
          checked={data.length > 0 && checked.length === data.length}
          onChange={() => {
            if (checked.length === data.length) {
              setChecked([]);
            } else {
              setChecked(data.map((_, index) => index));
            }
          }}
        />
      ),
      Cell: ({ row }) => <CheckboxCell row={row} />
    },
    ...columns
  ], [columns, data, checked, setChecked]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: allColumns, data });

  return (
    <table {...getTableProps()} className="react-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr className='table-header-row' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className='table-header-cell' {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="table-body" {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr className="table-body-row" {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td className="table-body-cell" {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReactTableWithCheckbox;
