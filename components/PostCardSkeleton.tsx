import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6 p-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center">
        <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-gray-700"></div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      
      {/* Media Skeleton */}
      <div className="mt-4 h-48 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
};

export default PostCardSkeleton;