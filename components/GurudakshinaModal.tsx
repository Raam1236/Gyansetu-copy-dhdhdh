
import React, { useState, useMemo } from 'react';
import { type Guru, type Post, type LoggedInUser, type CommissionRecord } from '../types';
import { useLocalization } from '../App';

interface GurudakshinaModalProps {
  guru: Guru;
  post: Post;
  onClose: () => void;
  currentUser: LoggedInUser;
}

const GurudakshinaModal: React.FC<GurudakshinaModalProps> = ({ guru, post, onClose, currentUser }) => {
  const { t } = useLocalization();
  const [amount, setAmount] = useState(51);
  const [customAmount, setCustomAmount] = useState('');
  
  const presetAmounts = [11, 21, 51, 101];

  const finalAmount = useMemo(() => {
    const custom = parseFloat(customAmount);
    return custom > 0 ? custom : amount;
  }, [amount, customAmount]);

  const handlePay = () => {
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    // Simulate the 10% commission for the app owner
    const commission = finalAmount * 0.10;
    const guruAmount = finalAmount - commission;
    console.log(`Gurudakshina initiated for: ₹${finalAmount.toFixed(2)}`);
    console.log(`App Owner Commission (10%): ₹${commission.toFixed(2)}`);
    console.log(`Amount to be credited to Guru: ₹${guruAmount.toFixed(2)}`);
    
    const newCommissionRecord: CommissionRecord = {
        id: `comm_${Date.now()}`,
        postId: post.id,
        guruName: `${guru.firstName} ${guru.lastName}`,
        shishyaName: `${currentUser.firstName} ${currentUser.lastName}`,
        totalAmount: finalAmount,
        commissionAmount: commission,
        timestamp: new Date().toISOString()
    };
    try {
        const commissionsJson = localStorage.getItem('gyansetu-commissions');
        const commissions: CommissionRecord[] = commissionsJson ? JSON.parse(commissionsJson) : [];
        commissions.unshift(newCommissionRecord);
        localStorage.setItem('gyansetu-commissions', JSON.stringify(commissions));
    } catch (e) {
        console.error("Failed to save commission record", e);
    }

    // The user-facing UPI link still contains the full amount.
    const upiLink = `upi://pay?pa=${guru.upiId}&pn=${encodeURIComponent(`${guru.firstName} ${guru.lastName}`)}&am=${finalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`For: ${post.title}`)}`;
    window.location.href = upiLink;
    onClose();
  };

  const qrCodeUrl = useMemo(() => {
      if (isNaN(finalAmount) || finalAmount <= 0) return '';
      const upiLinkForQr = `upi://pay?pa=${guru.upiId}&pn=${encodeURIComponent(`${guru.firstName} ${guru.lastName}`)}&am=${finalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`For: ${post.title}`)}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLinkForQr)}`;
  }, [finalAmount, guru, post]);


  return (
     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm mx-auto animate-fadeIn w-full relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold sticky top-0 bg-white dark:bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center z-10">&times;</button>
        <div className="text-center pt-2">
            <img src={guru.profilePictureUrl} alt={`${guru.firstName} ${guru.lastName}`} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-saffron-200 dark:border-saffron-700" />
            <h3 className="text-xl font-bold text-deepBlue-900 dark:text-gray-100">{t('dakshinaTitle')}</h3>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{`${guru.firstName} ${guru.lastName}`}</p>
        </div>
        
        <div className="my-6">
            <p className="font-semibold text-gray-600 dark:text-gray-300 mb-3 text-center">{t('dakshinaAmountPrompt')}</p>
            <div className="flex justify-center space-x-2">
                {presetAmounts.map(preset => (
                    <button key={preset} onClick={() => { setAmount(preset); setCustomAmount(''); }} className={`px-4 py-2 rounded-full font-bold transition-colors ${amount === preset && !customAmount ? 'bg-saffron-500 text-white' : 'bg-saffron-100 dark:bg-saffron-900/50 text-saffron-800 dark:text-saffron-200'}`}>
                        {preset}
                    </button>
                ))}
            </div>
            <div className="mt-4 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">₹</span>
                <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                    placeholder={t('dakshinaCustomAmountPlaceholder')}
                    className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded-full text-center focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
            </div>
        </div>

        <div className="flex flex-col items-center space-y-4 pb-4">
             <button
                onClick={handlePay}
                className="w-full bg-deepBlue-700 text-white font-bold py-3 px-6 rounded-full hover:bg-deepBlue-800 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!finalAmount || finalAmount <= 0}
            >
                {t('dakshinaPayButton')}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dakshinaOr')}</p>
            <p className="font-semibold text-gray-600 dark:text-gray-300">{t('dakshinaScanPrompt')}</p>
            <div className="p-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 h-[196px] w-[196px] flex items-center justify-center flex-shrink-0">
               <div className="bg-white p-2 rounded-md">
                {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="UPI QR Code" width="164" height="164" />
                ) : (
                    <p className="text-xs text-gray-500 p-4 text-center">{t('dakshinaQRGeneration')}</p>
                )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GurudakshinaModal;
