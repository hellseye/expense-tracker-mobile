// The payment methods the expense form offers. The controller validates against
// the same list, so the two can never drift apart.
export const PAYMENT_METHODS = [
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
  'UPI',
  'OTHER',
];

export const PAYMENT_METHOD_LABELS = {
  CASH: 'Cash',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  OTHER: 'Other',
};