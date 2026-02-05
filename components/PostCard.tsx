
import React, { memo, useState } from 'react';
import { type Post, PostType } from '../types';
import { LikeIcon, CommentIcon, DownloadIcon, GurudakshinaIcon } from './icons/ActionIcons';
import { useLocalization } from '../App';

interface PostCardProps {
  post: Post;
  onGurudakshinaClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onGurudakshinaClick }) => {
  const { t } = useLocalization();
  const { guru, type, title, content, mediaUrl, likes, comments, timestamp } = post;
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(prev => !prev);
  }

  const formatTimestamp = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays <= 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const renderMedia = () => {
    if (!mediaUrl) return null;

    if (type === PostType.IMAGE) {
      return <img src={mediaUrl} alt={title} className="w-full h-auto object-cover rounded-lg mt-3" loading="lazy" />;
    }
    if (type === PostType.VIDEO) {
      return (
        <div className="relative mt-3">
          <img src={mediaUrl} alt={title} className="w-full h-auto object-cover rounded-lg" loading="lazy" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
            <div className="h-16 w-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-saffron-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">{t('postGyanShort')}</span>
        </div>
      );
    }
    return null;
  };

  const getPostTypeLabel = () => {
    switch(type) {
      case PostType.ARTICLE: return t('postAnubhavArticle');
      case PostType.IMAGE: return t('postImagePost');
      case PostType.VIDEO: return t('postGyanShort');
      default: return '';
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6 p-5">
      <div className="flex items-center">
        <img className="h-14 w-14 rounded-full object-cover" src={guru.profilePictureUrl} alt={`${guru.firstName} ${guru.lastName}`} loading="lazy" />
        <div className="ml-4">
          <p className="text-lg font-bold text-deepBlue-900 dark:text-gray-100">{`${guru.firstName} ${guru.lastName}`}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{guru.expertise} · <span className="text-xs">{formatTimestamp(timestamp)}</span></p>
        </div>
      </div>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">{getPostTypeLabel()}</span>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-1">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
          {type === PostType.ARTICLE ? `${content.substring(0, 150)}...` : content}
        </p>
        {type === PostType.ARTICLE && (
          <a href="#" className="text-saffron-600 dark:text-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300 font-semibold mt-2 inline-block">{t('postReadMore')}</a>
        )}
      </div>

      {renderMedia()}
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
        <div className="flex space-x-5">
           <button className="flex items-center space-x-1 hover:text-deepBlue-500 dark:hover:text-deepBlue-300 transition-colors" aria-label="Download post">
            <DownloadIcon className="h-6 w-6" />
          </button>
          <button 
            onClick={handleLike} 
            className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`} 
            aria-label="Like post"
          >
            <LikeIcon className="h-6 w-6" /> <span className="text-sm">{likeCount}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" aria-label="Comment on post">
            <CommentIcon className="h-6 w-6" /> <span className="text-sm">{comments}</span>
          </button>
        </div>
        <button 
          onClick={() => onGurudakshinaClick(post)}
          className="flex items-center space-x-2 bg-saffron-100 dark:bg-saffron-900/50 text-saffron-800 dark:text-saffron-200 px-4 py-2 rounded-full hover:bg-saffron-200 dark:hover:bg-saffron-900 transition-colors font-semibold">
           <GurudakshinaIcon className="text-xl"/>
           <span>{t('postGurudakshina')}</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PostCard);