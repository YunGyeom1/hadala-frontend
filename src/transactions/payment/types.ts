export interface PaymentSummary {
  unpaid_receivables: number;  // 미수금 (받아야 할 돈)
  overdue_payables: number;    // 연체 지급금 (내야 할 돈 중 연체)
  prepaid_income: number;      // 선수금 (미리 받은 돈)
  prepaid_expense: number;     // 선지급금 (미리 낸 돈)
  total_income: number;        // 총 수입 (실제 받은 돈)
  total_expense: number;       // 총 지출 (실제 낸 돈)
}

export interface ContractPaymentInfo {
  contract_name: string;
  counterparty: string;
  income: number;
  expense: number;
  status: string;
  pending_amount: number;
  is_overdue: boolean;
}

export interface UpcomingPayment {
  id: string;
  title: string;
  counterparty: string;
  amount: number;
  due_date: string;
  type: string;  // "receivable" (받을 돈) 또는 "payable" (낼 돈)
  days_until_due: number;
}

export interface PaymentReport {
  summary: PaymentSummary;
  contracts: ContractPaymentInfo[];
  upcoming_receivables: UpcomingPayment[];  // 7일 내 받을 돈
  upcoming_payables: UpcomingPayment[];     // 7일 내 낼 돈
}

export interface OverdueContract {
  id: string;
  title: string;
  total_price: number;
  payment_due_date: string;
  days_overdue: number;
} 