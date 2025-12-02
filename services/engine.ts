import { FinancialInputs, MonthlyData } from '../types';
import { MONTHS_COUNT, START_YEAR } from '../constants';

export const calculateModel = (inputs: FinancialInputs): MonthlyData[] => {
  const results: MonthlyData[] = [];
  
  // Rolling accumulators
  let prevStock = inputs.initialStock;
  let prevCash = inputs.initialCash;
  let prevDebt = 0; // Negative number represents debt amount
  let prevEquity = 0; // Starts at 0 profit
  let prevAR = 0; // Receivables
  let prevAP = 0; // Payables

  // Loop 24 months
  for (let i = 0; i < MONTHS_COUNT; i++) {
    const year = START_YEAR + Math.floor(i / 12);
    const month = (i % 12) + 1;
    const label = `${month}/${year}`;

    // --- 1. Employees ---
    // Logic: 3 employees from month 4 (April 2026) onwards (index 3)
    const activeEmpCount = i >= 3 ? inputs.employeeCount : 0;
    const grossWages = activeEmpCount * inputs.grossWage;
    const empLevy = grossWages * inputs.payrollTaxRate;
    const totalWageCost = grossWages + empLevy;

    // --- 2. Stock & Purchases ---
    const purchaseNet = inputs.monthlyPurchase;
    const purchaseVatInput = purchaseNet * inputs.domesticPurchaseShare * inputs.vatRate;
    const totalPurchaseLiability = purchaseNet + purchaseVatInput;

    // Payment Outflow (Cash Flow)
    // Prepayment (current month) + Postpayment (prev month)
    const payCurrent = totalPurchaseLiability * inputs.paymentPrepayment;
    
    // Previous month liability part calculation
    let payPrev = 0;
    if (i > 0) {
      // Re-calculate prev month liability to be safe or store it. 
      // Since purchase is constant in this model, it's simple:
      const prevPurchaseNet = inputs.monthlyPurchase;
      const prevPurchaseVat = prevPurchaseNet * inputs.domesticPurchaseShare * inputs.vatRate;
      payPrev = (prevPurchaseNet + prevPurchaseVat) * inputs.paymentDueNextMonth;
    }
    const paymentOutflow = payCurrent + payPrev;

    // Stock Balance logic
    const cogs = inputs.monthlySales * (1 - inputs.margin);
    const stockBalance = prevStock + purchaseNet - cogs;

    // --- 3. Sales & Receivables ---
    const salesNet = inputs.monthlySales;
    const salesVatOutput = salesNet * inputs.domesticShare * inputs.vatRate;
    const totalInvoiced = salesNet + salesVatOutput;

    // Collection Inflow (Cash Flow)
    // 20% Prepay (T) + 50% 14 Days (T) + 30% 90 Days (T-3)
    const collectCurrent = totalInvoiced * (inputs.collectionPrepayment + inputs.collection14Days);
    let collectLag3 = 0;
    if (i >= 3) {
      // Assuming constant sales for simplicity based on model, 
      // but strictly we should look back. In this constant model:
      const prevInvoiced = totalInvoiced; 
      collectLag3 = prevInvoiced * inputs.collection90Days;
    }
    const receivablesInflow = collectCurrent + collectLag3;
    const marginAbs = salesNet * inputs.margin;

    // --- 4. VAT ---
    const vatLiabilityDiff = salesVatOutput - purchaseVatInput; // + to pay, - refund
    // Cash flow delay 1 month
    let vatCashFlow = 0;
    if (i > 0) {
      // Use previous month's liability
      const prevSalesVat = inputs.monthlySales * inputs.domesticShare * inputs.vatRate;
      const prevPurchaseVat = inputs.monthlyPurchase * inputs.domesticPurchaseShare * inputs.vatRate;
      vatCashFlow = prevSalesVat - prevPurchaseVat;
    }

    // --- 5. P&L ---
    const ebitda = marginAbs - totalWageCost;
    const interest = prevDebt * 0.10 / 12; // 10% p.a. on previous debt balance
    const ebit = ebitda; // No depreciation in this model
    const ebt = ebit + interest; // Interest is usually negative
    
    let tax = 0;
    if (ebt > 0) {
      tax = ebt * inputs.corporateTaxRate;
    }
    const netProfit = ebt - tax;

    // --- 6. Cash Flow Analysis ---
    // OpCF = SalesIn - PurchaseOut - Wages - VAT
    const opCashFlow = receivablesInflow - paymentOutflow - totalWageCost - vatCashFlow;
    
    // Tentative Cash before financing operations
    const cashBeforeFin = prevCash + opCashFlow + interest;

    // Financing Logic
    // If < 0, we need to borrow (increase debt, positive cash flow from financing)
    // If > 0 and we have debt, we repay (decrease debt, negative cash flow from financing)
    let financingGap = 0; // Borrowing
    let repayment = 0; // Repaying

    if (cashBeforeFin < 0) {
      financingGap = -cashBeforeFin;
    } else if (prevDebt < 0) {
       // We have cash and we have debt. Repay up to available cash or full debt
       const availableCash = cashBeforeFin;
       const debtPrincipal = -prevDebt;
       repayment = Math.min(availableCash, debtPrincipal);
    }

    const cashBalance = cashBeforeFin + financingGap - repayment;
    const debtBalance = prevDebt - financingGap + repayment; // Debt accumulates negatively

    // --- 7. Balance Sheet ---
    
    // AR
    const currentAR = prevAR + totalInvoiced - receivablesInflow;
    
    // AP
    const currentAP = prevAP + totalPurchaseLiability - paymentOutflow;

    // Equity (Accumulated Profit)
    const currentEquity = prevEquity + netProfit;

    const assetsMoney = cashBalance;
    const assetsAR = currentAR;
    const assetsStock = stockBalance;
    const assetsTotal = assetsMoney + assetsAR + assetsStock;

    const liabEquity = currentEquity;
    const liabAP = currentAP;
    const liabVAT = vatLiabilityDiff; // Current month accrued
    const liabLoans = -debtBalance; // Show as positive number on liability side
    const liabTotal = liabEquity + liabAP + liabVAT + liabLoans;

    // Store Result
    results.push({
      monthIndex: i,
      label,
      empCount: activeEmpCount,
      totalWageCost,
      purchaseNet,
      purchaseVatInput,
      cogs,
      stockBalance,
      paymentOutflow,
      salesNet,
      salesVatOutput,
      receivablesInflow,
      marginAbs,
      vatToPay: vatLiabilityDiff,
      vatCashFlow,
      ebitda,
      ebit,
      interest,
      ebt,
      tax,
      netProfit,
      opCashFlow,
      cashBeforeFin,
      financingGap,
      repayment,
      cashBalance,
      debtBalance,
      assetsMoney,
      assetsAR,
      assetsStock,
      assetsTotal,
      liabEquity,
      liabAP,
      liabVAT,
      liabLoans,
      liabTotal
    });

    // Update accumulators for next iteration
    prevStock = stockBalance;
    prevCash = cashBalance;
    prevDebt = debtBalance;
    prevEquity = currentEquity;
    prevAR = currentAR;
    prevAP = currentAP;
  }

  return results;
};
