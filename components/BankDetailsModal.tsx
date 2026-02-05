
import React, { useState } from 'react';
import { type BankDetails } from '../types';
import { useLocalization } from '../App';

interface BankDetailsModalProps {
  initialDetails: BankDetails | null;
  onSave: (details: BankDetails) => void;
  onClose: () => void;
}

const BankDetailsModal: React.FC<BankDetailsModalProps> = ({ initialDetails, onSave, onClose }) => {
  const { t } = useLocalization();
  const [details, setDetails] = useState<BankDetails>(
    initialDetails || { accountHolder: '', accountNumber: '', ifsc: '', upiId: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.accountHolder && details.accountNumber && details.ifsc && details.upiId) {
      onSave(details);
    } else {
      alert('Please fill all the fields.');
    }
  };
  
  const InputField: React.FC<{name: keyof BankDetails, label: string, placeholder: string, type?: string}> = ({name, label, placeholder, type = 'text'}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={details[name]}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
            placeholder={placeholder}
            required
        />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn relative">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100">{t('profileBankDetailsTitle')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="accountHolder" label={t('bankAccountHolder')} placeholder={t('bankAccountHolderPlaceholder')}/>
            <InputField name="accountNumber" label={t('bankAccountNumber')} placeholder={t('bankAccountNumberPlaceholder')} type="number"/>
            <InputField name="ifsc" label={t('bankIFSC')} placeholder={t('bankIFSCPlaceholder')}/>
            <InputField name="upiId" label={t('bankUPI')} placeholder={t('bankUPIPlaceholder')}/>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-semibold"
            >
              {t('bankSaveButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsModal;
