
import React, { useState, useEffect } from 'react';
import { Guru, Post, PostType } from '../types';
import { useLocalization } from '../App';

interface CreatePageProps {
  currentUser: Guru;
}

const CreatePage: React.FC<CreatePageProps> = ({ currentUser }) => {
  const { t } = useLocalization();
  const [contentType, setContentType] = useState<PostType>(PostType.ARTICLE);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // For articles
  const [caption, setCaption] = useState(''); // For media
  const [file, setFile] = useState<File | null>(null);

  // Reset fields when content type changes
  useEffect(() => {
    setTitle('');
    setContent('');
    setCaption('');
    setFile(null);
  }, [contentType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePost = () => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      guru: currentUser,
      type: contentType,
      title: title,
      content: contentType === PostType.ARTICLE ? content : caption,
      mediaUrl: file ? `https://picsum.photos/seed/${Math.random()}/600/400` : undefined,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
    };

    try {
        const postsJson = localStorage.getItem('gyansetu-posts');
        const posts: Post[] = postsJson ? JSON.parse(postsJson) : [];
        posts.unshift(newPost); // Add new post to the beginning
        localStorage.setItem('gyansetu-posts', JSON.stringify(posts));
        
        alert('Your Gyan has been successfully shared!');
        
        // Reset form state after successful "post"
        setTitle('');
        setContent('');
        setCaption('');
        setFile(null);

    } catch (e) {
        console.error("Failed to save post", e);
        alert("There was an error sharing your Gyan. Please try again.");
    }
  };

  const isButtonDisabled = () => {
    if (!title.trim()) return true;
    if (contentType === PostType.ARTICLE) {
      return !content.trim();
    }
    if (contentType === PostType.IMAGE || contentType === PostType.VIDEO) {
      return !caption.trim() || !file;
    }
    return true;
  };

  const TypeButton: React.FC<{ type: PostType, label: string }> = ({ type, label }) => (
    <button
      onClick={() => setContentType(type)}
      className={`px-4 py-2 rounded-full font-semibold transition-colors ${
        contentType === type 
          ? 'bg-saffron-500 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('createTitle')}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{t('createSubtitle')}</p>
      
      <div className="flex space-x-4 mb-6">
        <TypeButton type={PostType.ARTICLE} label={t('createTypeArticle')} />
        <TypeButton type={PostType.VIDEO} label={t('createTypeVideo')} />
        <TypeButton type={PostType.IMAGE} label={t('createTypeImage')} />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300">{t('createFieldTitle')}</label>
          <input 
            type="text" 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" placeholder={t('createFieldTitlePlaceholder')} />
        </div>

        {contentType === PostType.ARTICLE && (
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 dark:text-gray-300">{t('createFieldContent')}</label>
            <textarea 
              id="content" 
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" placeholder={t('createFieldContentPlaceholder')}></textarea>
          </div>
        )}

        {(contentType === PostType.IMAGE || contentType === PostType.VIDEO) && (
          <div>
            <label htmlFor="media" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              {t('createFieldMediaUpload', { mediaType: contentType === 'IMAGE' ? t('createFieldMediaImage') : t('createFieldMediaVideo') })}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                 {file ? (
                   <p className="text-sm text-green-600 font-medium">File selected: {file.name}</p>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-saffron-600 dark:text-saffron-400 hover:text-saffron-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-saffron-500">
                        <span>{t('createFieldMediaUploadFile')}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" />
                      </label>
                      <p className="pl-1">{t('createFieldMediaDragDrop')}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{t('createFieldMediaFileType')}</p>
                  </>
                )}
              </div>
            </div>
            <label htmlFor="caption" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-4">{t('createFieldCaption')}</label>
            <textarea 
              id="caption" 
              rows={3} 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm" placeholder={t('createFieldCaptionPlaceholder')}></textarea>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handlePost}
            className="bg-deepBlue-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-deepBlue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isButtonDisabled()}
          >
            {t('createPostButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;