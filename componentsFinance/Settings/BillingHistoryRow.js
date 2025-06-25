// componentsFinance/Settings/BillingHistoryRow.js
import { ArrowDownCircleIcon } from '@heroicons/react/24/solid';

const BillingHistoryRow = ({ invoice }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="font-semibold text-light-text dark:text-dark-text">{invoice.date}</p>
      <p className="text-sm text-light-subtle dark:text-dark-subtle">{invoice.description}</p>
    </div>
    <div className="flex items-center gap-6">
      <p className="font-semibold">{invoice.amount}</p>
      <button className="text-light-subtle dark:text-dark-subtle hover:text-blue-500"><ArrowDownCircleIcon className="h-6 w-6" /></button>
    </div>
  </div>
);
export default BillingHistoryRow;