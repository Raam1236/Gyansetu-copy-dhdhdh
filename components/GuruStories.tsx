
import React from 'react';
import type { Guru } from '../types';
import { useLocalization } from '../App';

const GuruStory: React.FC<{ guru: Guru }> = ({ guru }) => (
  <div className="flex flex-col items-center flex-shrink-0 w-20 cursor-pointer">
    <div className="relative p-1 border-2 border-saffron-500 rounded-full">
      <img
        src={guru.profilePictureUrl}
        alt={`${guru.firstName} ${guru.lastName}`}
        className="w-16 h-16 rounded-full object-cover"
        loading="lazy"
      />
    </div>
    <p className="text-xs mt-2 text-center text-gray-700 dark:text-gray-300 truncate w-full">{guru.firstName}</p>
  </div>
);

const GuruStories: React.FC<{ gurus: Guru[] }> = ({ gurus }) => {
  const { t } = useLocalization();
  if (gurus.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-deepBlue-900 dark:text-gray-100 mb-3">{t('homeFeaturedGurus')}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
        {gurus.map(guru => (
          <GuruStory key={guru.id} guru={guru} />
        ))}
      </div>
    </section>
  );
};

export default GuruStories;