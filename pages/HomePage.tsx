import React, { useState, useEffect } from 'react';
import { type Post, type LoggedInUser, type ActivePage, type Guru, type StoredUser, PostType } from '../types';
import PostCard from '../components/PostCard';
import GuruStories from '../components/GuruStories';
import PostCardSkeleton from '../components/PostCardSkeleton';
import CreatePostPrompt from '../components/CreatePostPrompt';
import { useLocalization } from '../App';
import { supabase } from '../lib/supabase';

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
    const loadData = async () => {
        try {
            // Fetch posts from Supabase
            const { data: postsData, error: postsError } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles:creator_id (*)
                `)
                .order('created_at', { ascending: false });

            if (postsError) throw postsError;

            const mappedPosts: Post[] = postsData.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                type: p.type as PostType,
                mediaUrl: p.media_url,
                likes: p.likes_count,
                comments: p.comments_count,
                timestamp: p.created_at,
                guru: {
                    id: p.profiles.id,
                    firstName: p.profiles.first_name,
                    lastName: p.profiles.last_name,
                    username: p.profiles.username,
                    profilePictureUrl: p.profiles.avatar_url || 'https://i.pravatar.cc/150',
                    expertise: p.profiles.expertise,
                    bio: p.profiles.bio,
                    rating: p.profiles.rating,
                    reviews: p.profiles.reviews,
                    role: 'guru',
                    upiId: p.profiles.upi_id
                } as Guru
            }));
            setPosts(mappedPosts);

            // Fetch Gurus for stories
            const { data: gurusData, error: gurusError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'guru')
                .limit(10);
            
            if (gurusError) throw gurusError;

            setGurus(gurusData.map(g => ({
                id: g.id,
                firstName: g.first_name,
                lastName: g.last_name,
                username: g.username,
                profilePictureUrl: g.avatar_url || 'https://i.pravatar.cc/150',
                expertise: g.expertise,
                bio: g.bio,
                rating: g.rating,
                reviews: g.reviews,
                role: 'guru',
                upiId: g.upi_id
            } as Guru)));

        } catch (e) {
            console.error("Failed to load data from Supabase", e);
        } finally {
            setIsLoading(false);
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
