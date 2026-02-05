import React, { useState, useEffect } from 'react';
import { type Post, type LoggedInUser, type ActivePage, type Guru, type StoredUser } from '../types';
import PostCard from '../components/PostCard';
import GuruStories from '../components/GuruStories';
import PostCardSkeleton from '../components/PostCardSkeleton';
import CreatePostPrompt from '../components/CreatePostPrompt';
import { useLocalization } from '../App';
import { APP_OWNER_USERNAME } from '../constants';

interface HomePageProps {
  currentUser: LoggedInUser;
  openDakshinaModal: (post: Post) => void;
  setActivePage: (page: ActivePage) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, openDakshinaModal, setActivePage }) => {
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);

  useEffect(() => {
    const loadData = () => {
        try {
            const postsJson = localStorage.getItem('gyansetu-posts');
            const sortedPosts = postsJson ? JSON.parse(postsJson).sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
            setPosts(sortedPosts);

            const usersJson = localStorage.getItem('gyansetu-users');
            const allUsers: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
            setGurus(allUsers.filter(u => u.role === 'guru' && u.username !== APP_OWNER_USERNAME) as Guru[]);
        } catch (e) {
            console.error("Failed to load data from storage", e);
        } finally {
             // Use a timeout to prevent skeleton flashing on fast loads
            setTimeout(() => setIsLoading(false), 500);
        }
    };
    loadData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-deepBlue-800 dark:text-gray-100">{t('homeWelcome')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t('homeCommunityStart')}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{t('homeNoWisdom')}</p>
            <button
                onClick={() => setActivePage('discover')}
                className="mt-6 bg-saffron-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-saffron-600 transition-colors"
            >
                {t('homeDiscoverGurus')}
            </button>
        </div>
      );
    }

    return posts.map(post => (
      <PostCard key={post.id} post={post} onGurudakshinaClick={openDakshinaModal} />
    ));
  };

  return (
    <div>
      {currentUser.role === 'guru' && (
        <CreatePostPrompt user={currentUser} navigateToCreate={() => setActivePage('create')} />
      )}
      <GuruStories gurus={gurus} />
      
      {renderContent()}
    </div>
  );
};

export default HomePage;
