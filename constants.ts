import { FinancialInputs } from './types';

export const DEFAULT_INPUTS: FinancialInputs = {
  vatRate: 0.21,
  payrollTaxRate: 0.338,
  corporateTaxRate: 0.21,
  monthlySales: 8000000,
  margin: 0.10,
  exportShare: 0.50,
  domesticShare: 0.50,
  collectionPrepayment: 0.20,
  collection14Days: 0.50,
  collection90Days: 0.30,
  monthlyPurchase: 10000000,
  importShare: 0.90,
  domesticPurchaseShare: 0.10,
  paymentPrepayment: 0.80,
  paymentDueNextMonth: 0.20,
  initialCash: 500000,
  initialStock: 0,
  employeeCount: 3,
  grossWage: 50000
};

export const MONTHS_COUNT = 24;
export const START_YEAR = 2026;
