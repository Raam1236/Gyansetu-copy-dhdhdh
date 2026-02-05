
import React from 'react';
import { type LoggedInUser } from '../types';
import { useLocalization } from '../App';

interface CreatePostPromptProps {
  user: LoggedInUser;
  navigateToCreate: () => void;
}

const CreatePostPrompt: React.FC<CreatePostPromptProps> = ({ user, navigateToCreate }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center mb-4">
        <img className="h-12 w-12 rounded-full object-cover" src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} loading="lazy" />
        <p className="ml-4 text-gray-600 dark:text-gray-300">{t('homeCreatePrompt', { firstName: user.firstName })}</p>
      </div>
      <div className="flex justify-around items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <button onClick={navigateToCreate} className="flex-1 text-center py-2 text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
           {t('homeCreateArticle')}
        </button>
         <button onClick={navigateToCreate} className="flex-1 text-center py-2 text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
           {t('homeCreateVideo')}
        </button>
         <button onClick={navigateToCreate} className="flex-1 text-center py-2 text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
           {t('homeCreateImage')}
        </button>
      </div>
    </div>
  );
};

export default CreatePostPrompt;