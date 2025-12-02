export interface FinancialInputs {
  // Taxes & Payroll
  vatRate: number; // 0.21
  payrollTaxRate: number; // 0.338
  corporateTaxRate: number; // 0.21

  // Sales
  monthlySales: number;
  margin: number; // 0.10
  exportShare: number; // 0.50
  domesticShare: number; // 0.50

  // Receivables (Inflow)
  collectionPrepayment: number; // 0.20
  collection14Days: number; // 0.50
  collection90Days: number; // 0.30

  // Purchases & Stock
  monthlyPurchase: number;
  importShare: number; // 0.90
  domesticPurchaseShare: number; // 0.10
  paymentPrepayment: number; // 0.80
  paymentDueNextMonth: number; // 0.20

  // Initial State
  initialCash: number;
  initialStock: number;

  // Employees
  employeeCount: number; // Starts April 2026
  grossWage: number;
}

export interface MonthlyData {
  monthIndex: number;
  label: string;
  
  // Employees
  empCount: number;
  totalWageCost: number; // Super gross

  // Stock
  purchaseNet: number;
  purchaseVatInput: number;
  cogs: number;
  stockBalance: number;
  paymentOutflow: number; // Cash outflow for stock

  // Sales
  salesNet: number;
  salesVatOutput: number;
  receivablesInflow: number; // Cash inflow from sales
  marginAbs: number;

  // VAT
  vatToPay: number; // Liability calc
  vatCashFlow: number; // Actual payment (delayed)

  // P&L
  ebitda: number;
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netProfit: number;

  // Cash Flow
  opCashFlow: number;
  cashBeforeFin: number;
  financingGap: number; // Need to borrow
  repayment: number; // Ability to pay back
  cashBalance: number;
  debtBalance: number; // Negative value implies debt

  // Balance Sheet
  assetsMoney: number;
  assetsAR: number;
  assetsStock: number;
  assetsTotal: number;
  
  liabEquity: number;
  liabAP: number;
  liabVAT: number;
  liabLoans: number;
  liabTotal: number;
}