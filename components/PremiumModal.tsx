
import React from 'react';
import { useLocalization } from '../App';

interface PremiumModalProps {
  onGoPremium: () => void;
  onEndCall: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onGoPremium, onEndCall }) => {
  const { t } = useLocalization();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center p-8 max-w-sm mx-auto animate-fadeIn">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-saffron-100 dark:bg-saffron-900 mb-4">
          <svg className="h-10 w-10 text-saffron-600 dark:text-saffron-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100" id="modal-title">
          {t('premiumTitle')}
        </h3>
        <div className="mt-3">
          <p className="text-md text-gray-600 dark:text-gray-300">
            {t('premiumMessage')}
          </p>
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-3 bg-saffron-500 text-base font-bold text-white hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-transform transform hover:scale-105"
            onClick={onGoPremium}
          >
            {t('premiumGoPremium')}
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-3 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deepBlue-500"
            onClick={onEndCall}
          >
            {t('premiumEndCall')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;