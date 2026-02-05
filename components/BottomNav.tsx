
import React from 'react';
import { type ActivePage, type UserRole } from '../types';
import HomeIcon from './icons/HomeIcon';
import DiscoverIcon from './icons/DiscoverIcon';
import CreateIcon from './icons/CreateIcon';
import ProfileIcon from './icons/ProfileIcon';
import { useLocalization } from '../App';

interface BottomNavProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  userRole: UserRole;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-saffron-600 dark:text-saffron-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-saffron-500 dark:hover:text-saffron-400';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
      aria-label={`Navigate to ${label}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, userRole }) => {
  const { t } = useLocalization();
  const iconSize = "h-6 w-6";

  const shishyaNav = (
    <>
      <NavButton
        label={t('navHome')}
        icon={<HomeIcon className={iconSize} />}
        isActive={activePage === 'home'}
        onClick={() => setActivePage('home')}
      />
      <NavButton
        label={t('navSearch')}
        icon={<DiscoverIcon className={iconSize} />}
        isActive={activePage === 'discover'}
        onClick={() => setActivePage('discover')}
      />
      <NavButton
        label={t('navProfile')}
        icon={<ProfileIcon className={iconSize} />}
        isActive={activePage === 'profile'}
        onClick={() => setActivePage('profile')}
      />
    </>
  );

  const guruNav = (
     <div className="flex justify-around w-full">
        <NavButton
          label={t('navHome')}
          icon={<HomeIcon className={iconSize} />}
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
        />
        
        <div className="w-1/4 flex justify-center">
            <button 
                onClick={() => setActivePage('create')} 
                className="absolute bottom-4 flex items-center justify-center h-16 w-16 bg-saffron-500 rounded-full text-white shadow-lg hover:bg-saffron-600 transition-transform duration-200 ease-in-out transform hover:scale-110"
                aria-label={t('navCreate')}
            >
                <CreateIcon className="h-8 w-8" />
            </button>
        </div>

        <NavButton
          label={t('navProfile')}
          icon={<ProfileIcon className={iconSize} />}
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
        />
     </div>
  );
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.2)] z-20 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto flex justify-around">
        {userRole === 'guru' ? guruNav : shishyaNav}
      </div>
    </nav>
  );
};

export default BottomNav;