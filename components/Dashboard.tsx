import React from 'react';
import { MonthlyData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const Dashboard: React.FC<{ data: MonthlyData[] }> = ({ data }) => {
  return (
    <div className="space-y-8">
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase">Celkové Tržby (24m)</h3>
           <p className="text-2xl font-bold text-slate-900 mt-2">
             {new Intl.NumberFormat('cs-CZ').format(data.reduce((acc, curr) => acc + curr.salesNet, 0))} Kč
           </p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase">Konečný stav hotovosti</h3>
           <p className={`text-2xl font-bold mt-2 ${data[data.length - 1].cashBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
             {new Intl.NumberFormat('cs-CZ').format(data[data.length - 1].cashBalance)} Kč
           </p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase">Celkový Čistý Zisk</h3>
           <p className={`text-2xl font-bold mt-2 ${data.reduce((acc, curr) => acc + curr.netProfit, 0) < 0 ? 'text-red-600' : 'text-blue-600'}`}>
             {new Intl.NumberFormat('cs-CZ').format(data.reduce((acc, curr) => acc + curr.netProfit, 0))} Kč
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cash Evolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Vývoj Cash Flow</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={12} tickMargin={10} minTickGap={30} />
                <YAxis tickFormatter={formatCurrency} fontSize={12} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('cs-CZ').format(value)} />
                <Area type="monotone" dataKey="cashBalance" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2} name="Stav hotovosti" />
                <Line type="monotone" dataKey="debtBalance" stroke="#ef4444" strokeWidth={2} name="Stav dluhu" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* P&L Composition */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Měsíční Zisk vs EBITDA</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={12} tickMargin={10} minTickGap={30} />
                <YAxis tickFormatter={formatCurrency} fontSize={12} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('cs-CZ').format(value)} />
                <Legend />
                <Bar dataKey="ebitda" fill="#3b82f6" name="EBITDA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netProfit" fill="#8b5cf6" name="Čistý zisk" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};