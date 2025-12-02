import React from 'react';
import { FinancialInputs } from '../types';

interface Props {
  inputs: FinancialInputs;
  onChange: (key: keyof FinancialInputs, value: number) => void;
}

const InputGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3 border-b border-slate-100 pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{ 
  label: string; 
  value: number; 
  type?: 'currency' | 'percent' | 'number';
  onChange: (val: number) => void 
}> = ({ label, value, type = 'number', onChange }) => {
  
  const displayValue = type === 'percent' ? Math.round(value * 100) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    if (type === 'percent') val = val / 100;
    onChange(val);
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs text-slate-500 mb-1 font-medium">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={type === 'percent' ? "1" : "1000"}
          className="w-full px-3 py-2 bg-yellow-50 border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={displayValue}
          onChange={handleChange}
        />
        <div className="absolute right-3 top-2 text-xs text-slate-400 pointer-events-none">
           {type === 'percent' ? '%' : type === 'currency' ? 'Kč' : ''}
        </div>
      </div>
    </div>
  );
};

export const InputSection: React.FC<Props> = ({ inputs, onChange }) => {
  return (
    <div className="space-y-6">
      <InputGroup title="Obchodní parametry - Prodej">
        <InputField label="Měsíční tržby (plán)" value={inputs.monthlySales} type="currency" onChange={(v) => onChange('monthlySales', v)} />
        <InputField label="Marže na zboží" value={inputs.margin} type="percent" onChange={(v) => onChange('margin', v)} />
        <InputField label="Podíl Exportu (0% DPH)" value={inputs.exportShare} type="percent" onChange={(v) => onChange('exportShare', v)} />
        <InputField label="Podíl Tuzemska (21% DPH)" value={inputs.domesticShare} type="percent" onChange={(v) => onChange('domesticShare', v)} />
      </InputGroup>

      <InputGroup title="Pohledávky (Inkaso)">
        <InputField label="Předplatba (měsíc T)" value={inputs.collectionPrepayment} type="percent" onChange={(v) => onChange('collectionPrepayment', v)} />
        <InputField label="Splatnost 14 dní (měsíc T)" value={inputs.collection14Days} type="percent" onChange={(v) => onChange('collection14Days', v)} />
        <InputField label="Splatnost 90 dní (měsíc T+3)" value={inputs.collection90Days} type="percent" onChange={(v) => onChange('collection90Days', v)} />
      </InputGroup>

      <InputGroup title="Nákupy a Sklad">
        <InputField label="Měsíční nákup (plán)" value={inputs.monthlyPurchase} type="currency" onChange={(v) => onChange('monthlyPurchase', v)} />
        <InputField label="Podíl Import (0% DPH)" value={inputs.importShare} type="percent" onChange={(v) => onChange('importShare', v)} />
        <InputField label="Podíl Tuzemsko (21% DPH)" value={inputs.domesticPurchaseShare} type="percent" onChange={(v) => onChange('domesticPurchaseShare', v)} />
      </InputGroup>

      <InputGroup title="Závazky (Platba)">
        <InputField label="Předplatba (měsíc T)" value={inputs.paymentPrepayment} type="percent" onChange={(v) => onChange('paymentPrepayment', v)} />
        <InputField label="Splatnost (měsíc T+1)" value={inputs.paymentDueNextMonth} type="percent" onChange={(v) => onChange('paymentDueNextMonth', v)} />
      </InputGroup>

      <InputGroup title="Daně a Mzdy">
        <InputField label="Sazba DPH" value={inputs.vatRate} type="percent" onChange={(v) => onChange('vatRate', v)} />
        <InputField label="Odvody firma" value={inputs.payrollTaxRate} type="percent" onChange={(v) => onChange('payrollTaxRate', v)} />
        <InputField label="Daň z příjmu PO" value={inputs.corporateTaxRate} type="percent" onChange={(v) => onChange('corporateTaxRate', v)} />
        <InputField label="Počet zaměstnanců (od dubna 26)" value={inputs.employeeCount} onChange={(v) => onChange('employeeCount', v)} />
        <InputField label="Hrubá mzda / osoba" value={inputs.grossWage} type="currency" onChange={(v) => onChange('grossWage', v)} />
      </InputGroup>
      
      <InputGroup title="Počáteční stav (Leden 2026)">
        <InputField label="Počáteční hotovost" value={inputs.initialCash} type="currency" onChange={(v) => onChange('initialCash', v)} />
        <InputField label="Počáteční zásoby" value={inputs.initialStock} type="currency" onChange={(v) => onChange('initialStock', v)} />
      </InputGroup>
    </div>
  );
};