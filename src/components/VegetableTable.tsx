import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import { vegetableSupplyData } from '../mock/vegetable-supply-data';
import type { Vegetable } from '../mock/vegetable-supply-data';

const columnHelper = createColumnHelper<Vegetable>();

const columns = [
  columnHelper.accessor('name', {
    header: '채소 이름',
    cell: info => info.getValue(),
    footer: () => null,
  }),
  columnHelper.accessor('grade', {
    header: '등급',
    cell: info => info.getValue(),
    footer: () => null,
  }),
  columnHelper.accessor('quantity', {
    header: '수량',
    cell: info => `${info.getValue()}kg`,
    footer: () => null,
  }),
  columnHelper.accessor('center', {
    header: '집하장',
    cell: info => info.getValue(),
    footer: () => null,
  }),
  columnHelper.accessor('date', {
    header: '날짜',
    cell: info => info.getValue(),
    footer: () => null,
  }),
  columnHelper.accessor('provider', {
    header: '제공자',
    cell: info => info.getValue(),
    footer: () => null,
  }),
];

const VegetableTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: vegetableSupplyData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🥦 채소 납품 데이터 테이블</h2>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-green-100 text-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border-b font-medium cursor-pointer text-left"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
            {/* 🔍 필드별 필터 입력창 */}
            <tr className="bg-white">
              {table.getHeaderGroups()[0].headers.map(header => {
                const column = header.column;
                return (
                  <th key={header.id} className="px-4 py-2 border-b">
                    {column.getCanFilter() ? (
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="검색"
                        value={(column.getFilterValue() ?? '') as string}
                        onChange={e => column.setFilterValue(e.target.value)}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 페이지네이션 */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ◀ 이전
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음 ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default VegetableTable;