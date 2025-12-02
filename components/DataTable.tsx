import React from 'react';

interface Props {
  headers: string[];
  rows: {
    label: string;
    data: (string | number)[];
    isBold?: boolean;
    isHeader?: boolean;
    isIndent?: boolean;
  }[];
}

export const DataTable: React.FC<Props> = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm bg-white">
      <div className="min-w-max">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left sticky left-0 bg-slate-100 border-r border-slate-200 z-20 min-w-[200px]">Položka</th>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-3 min-w-[100px] border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIndex) => (
              <tr key={rIndex} className={`${row.isBold ? 'font-bold bg-slate-50' : 'hover:bg-slate-50'} border-b border-slate-100 last:border-0`}>
                <td className={`px-4 py-2 text-left sticky left-0 border-r border-slate-200 z-10 bg-inherit
                  ${row.isIndent ? 'pl-8 text-slate-500' : 'text-slate-800'}
                `}>
                  {row.label}
                </td>
                {row.data.map((cell, cIndex) => (
                  <td key={cIndex} className={`px-3 py-2 whitespace-nowrap ${
                    typeof cell === 'number' && cell < 0 ? 'text-red-600' : 'text-slate-700'
                  }`}>
                    {typeof cell === 'number' 
                      ? new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(cell)
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};