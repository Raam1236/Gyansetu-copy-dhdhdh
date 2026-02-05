import React, { useState, useMemo, useEffect } from 'react';
import { type Guru, type CallType, StoredUser } from '../types';
import { VideoIcon, VoiceIcon } from '../components/icons/ActionIcons';
import { useLocalization } from '../App';
import { APP_OWNER_USERNAME } from '../constants';

interface DiscoverPageProps {
  startCall: (guru: Guru, type: CallType) => void;
}

const GuruCard: React.FC<{ guru: Guru, startCall: (guru: Guru, type: CallType) => void }> = React.memo(({ guru, startCall }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col text-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <img src={guru.profilePictureUrl} alt={`${guru.firstName} ${guru.lastName}`} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-saffron-200 dark:border-saffron-700 self-center" loading="lazy" />
            <h3 className="text-lg font-bold text-deepBlue-900 dark:text-gray-100">{`${guru.firstName} ${guru.lastName}`}</h3>
            <p className="text-sm text-saffron-800 dark:text-saffron-400 font-medium mt-1">{guru.expertise}</p>
            <div className="flex items-center justify-center text-yellow-500 mt-2">
            <span>⭐ {guru.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm ml-2">({guru.reviews} reviews)</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 flex-grow h-16">{guru.bio.substring(0, 80)}...</p>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-around items-center">
                <button 
                    onClick={() => startCall(guru, 'voice')}
                    className="p-3 rounded-full hover:bg-deepBlue-100 dark:hover:bg-deepBlue-900 text-deepBlue-700 dark:text-deepBlue-300 transition-colors"
                    aria-label={`Voice call ${guru.firstName} ${guru.lastName}`}
                    >
                    <VoiceIcon className="h-6 w-6" />
                </button>
                <button className="w-1/2 bg-deepBlue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-deepBlue-800 transition-colors">
                    {t('discoverViewProfile')}
                </button>
                <button 
                    onClick={() => startCall(guru, 'video')}
                    className="p-3 rounded-full hover:bg-saffron-100 dark:hover:bg-saffron-900 text-saffron-700 dark:text-saffron-400 transition-colors"
                    aria-label={`Video call ${guru.firstName} ${guru.lastName}`}
                    >
                    <VideoIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
});

type SortByType = 'default' | 'rating' | 'expertise';

const DiscoverPage: React.FC<DiscoverPageProps> = ({ startCall }) => {
  const { t } = useLocalization();
  const [sortBy, setSortBy] = useState<SortByType>('default');
  const [gurus, setGurus] = useState<Guru[]>([]);

  useEffect(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('gyansetu-users') || '[]') as StoredUser[];
      const storedGurus = storedUsers.filter(u => u.role === 'guru' && u.username !== APP_OWNER_USERNAME) as Guru[];
      setGurus(storedGurus);
    } catch (e) {
      console.error("Failed to load gurus from storage", e);
    }
  }, []);

  const sortedGurus = useMemo(() => {
    const gurusCopy = [...gurus];
    switch (sortBy) {
      case 'rating':
        return gurusCopy.sort((a, b) => b.rating - a.rating);
      case 'expertise':
        return gurusCopy.sort((a, b) => a.expertise.localeCompare(b.expertise));
      case 'default':
      default:
        return gurus;
    }
  }, [sortBy, gurus]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('discoverTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('discoverSubtitle')}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder={t('discoverSearchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortByType)}
              className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-3 pl-4 pr-10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              aria-label="Sort gurus"
            >
              <option value="default">{t('discoverSortBy')} {t('discoverSortDefault')}</option>
              <option value="rating">{t('discoverSortRating')}</option>
              <option value="expertise">{t('discoverSortExpertise')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-200">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
      {sortedGurus.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGurus.map(guru => (
            <GuruCard key={guru.id} guru={guru} startCall={startCall} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-deepBlue-800 dark:text-gray-100">{t('discoverNoGurusTitle')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t('discoverNoGurusSubtitle')}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{t('discoverNoGurusPrompt')}</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
