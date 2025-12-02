import React, { useState, useMemo } from 'react';
import { DEFAULT_INPUTS } from './constants';
import { FinancialInputs } from './types';
import { calculateModel } from './services/engine';
import { InputSection } from './components/InputSection';
import { DataTable } from './components/DataTable';
import { Dashboard } from './components/Dashboard';
import { AuthGate } from './components/AuthGate';
import { Calculator, BarChart3, Receipt, Landmark, Wallet } from 'lucide-react';

function App() {
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'inputs' | 'dashboard' | 'pnl' | 'cashflow' | 'balance'>('inputs');

  const results = useMemo(() => calculateModel(inputs), [inputs]);

  const handleInputChange = (key: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const headers = results.map(r => r.label);

  // --- Data Preparation for Tables ---
  const pnlRows = [
    { label: "Tržby (Prodej)", data: results.map(r => r.salesNet) },
    { label: "Náklady na prodané zboží (COGS)", data: results.map(r => -r.cogs) },
    { label: "Hrubá Marže", data: results.map(r => r.salesNet - r.cogs), isBold: true },
    { label: "Osobní náklady", data: results.map(r => -r.totalWageCost) },
    { label: "EBITDA", data: results.map(r => r.ebitda), isBold: true },
    { label: "Úroky", data: results.map(r => r.interest) },
    { label: "EBT (Zisk před zdaněním)", data: results.map(r => r.ebt), isBold: true },
    { label: "Daň z příjmu", data: results.map(r => -r.tax) },
    { label: "Čistý zisk", data: results.map(r => r.netProfit), isBold: true, isHeader: true },
  ];

  const cfRows = [
    { label: "Počáteční stav peněz", data: results.map((r, i) => i === 0 ? inputs.initialCash : results[i-1].cashBalance), isBold: true },
    { label: "Příjem z prodeje", data: results.map(r => r.receivablesInflow) },
    { label: "Výdaj za zboží", data: results.map(r => -r.paymentOutflow) },
    { label: "Výdaj na mzdy", data: results.map(r => -r.totalWageCost) },
    { label: "Platba/Vratka DPH", data: results.map(r => -r.vatCashFlow) },
    { label: "Provozní CF", data: results.map(r => r.opCashFlow), isBold: true },
    { label: "Potřeba financování (Čerpání)", data: results.map(r => r.financingGap), isIndent: true },
    { label: "Splátka dluhu", data: results.map(r => -r.repayment), isIndent: true },
    { label: "Zaplacené úroky", data: results.map(r => r.interest), isIndent: true },
    { label: "Konečný stav peněz", data: results.map(r => r.cashBalance), isBold: true },
    { label: "Kumulovaný dluh (Kontokorent)", data: results.map(r => r.debtBalance) },
  ];

  const bsRows = [
    { label: "AKTIVA CELKEM", data: results.map(r => r.assetsTotal), isBold: true },
    { label: "Peníze", data: results.map(r => r.assetsMoney), isIndent: true },
    { label: "Pohledávky", data: results.map(r => r.assetsAR), isIndent: true },
    { label: "Zásoby", data: results.map(r => r.assetsStock), isIndent: true },
    { label: "PASIVA CELKEM", data: results.map(r => r.liabTotal), isBold: true },
    { label: "Vlastní kapitál", data: results.map(r => r.liabEquity), isIndent: true },
    { label: "Závazky", data: results.map(r => r.liabAP), isIndent: true },
    { label: "DPH závazek", data: results.map(r => r.liabVAT), isIndent: true },
    { label: "Bankovní úvěry", data: results.map(r => r.liabLoans), isIndent: true },
    { label: "Kontrola (A - P)", data: results.map(r => r.assetsTotal - r.liabTotal), isBold: true },
  ];

  const tabs = [
    { id: 'inputs', label: 'Vstupy', icon: Calculator },
    { id: 'dashboard', label: 'Přehled', icon: BarChart3 },
    { id: 'pnl', label: 'Výkaz Zisku a Ztráty', icon: Receipt },
    { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
    { id: 'balance', label: 'Rozvaha', icon: Landmark },
  ] as const;

  return (
    <AuthGate>
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-6 pb-20 px-6 shadow-lg">
        <div className="w-full">
          <h1 className="text-2xl font-bold tracking-tight">Simulace Finančního Plánu</h1>
          <p className="text-slate-400 mt-1">Nástroj pro finanční modelování 2026 - 2027</p>
        </div>
      </header>

      <main className="flex-1 w-full px-4 md:px-6 -mt-12 mb-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] border border-slate-200">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'inputs' && (
              <InputSection inputs={inputs} onChange={handleInputChange} />
            )}
            
            {activeTab === 'dashboard' && (
              <Dashboard data={results} />
            )}

            {activeTab === 'pnl' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Výkaz Zisku a Ztráty</h2>
                <DataTable headers={headers} rows={pnlRows} />
              </div>
            )}

            {activeTab === 'cashflow' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Přehled Cash Flow</h2>
                <DataTable headers={headers} rows={cfRows} />
              </div>
            )}

            {activeTab === 'balance' && (
               <div className="space-y-4">
               <h2 className="text-xl font-bold text-slate-800">Rozvaha</h2>
               <DataTable headers={headers} rows={bsRows} />
             </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-900 text-slate-500 py-6 text-center text-sm">
        <p>&copy; 2024 Finanční Plánovač. Logika portována z Python modelu.</p>
      </footer>
    </div>
    </AuthGate>
  );
}

export default App;
