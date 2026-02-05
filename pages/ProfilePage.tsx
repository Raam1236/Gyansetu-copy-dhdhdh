import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { type LoggedInUser, type Guru, type CallType, type Post, type BankDetails, type StoredUser, type CallRecord } from '../types';
import { VideoIcon, VoiceIcon } from '../components/icons/ActionIcons';
import BankDetailsModal from '../components/BankDetailsModal';
import { useLocalization } from '../App';
import { APP_OWNER_USERNAME } from '../constants';

// --- HELPER ICONS ---
const EditIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
    </svg>
);
const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// --- RECOMMENDED GURUS COMPONENT ---
const RecommendedGurus: React.FC<{ gurus: Guru[] }> = ({ gurus }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('profileRecommendedGurus')}</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
                {gurus.map(guru => (
                    <div key={guru.id} className="flex flex-col items-center flex-shrink-0 w-32 text-center">
                        <img src={guru.profilePictureUrl} alt={guru.firstName} className="w-20 h-20 rounded-full object-cover border-2 border-saffron-200" />
                        <p className="font-semibold mt-2 text-deepBlue-900 dark:text-gray-200 truncate w-full">{`${guru.firstName} ${guru.lastName}`}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{guru.expertise}</p>
                        <button className="mt-2 text-sm bg-deepBlue-100 dark:bg-deepBlue-900 text-deepBlue-800 dark:text-deepBlue-200 px-3 py-1 rounded-full hover:bg-deepBlue-200 dark:hover:bg-deepBlue-800">{t('profileFollow')}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CALL HISTORY COMPONENT ---
const CallHistory: React.FC<{ calls: CallRecord[], currentUserId: string }> = ({ calls, currentUserId }) => {
    const { t } = useLocalization();

    if (calls.length === 0) {
        return <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">{t('profileNoCalls')}</div>;
    }
    
    return (
        <div className="space-y-4">
            {calls.map(call => {
                const isOutgoing = call.callerId === currentUserId;
                const otherPartyName = isOutgoing ? call.receiverName : call.callerName;
                const otherPartyPic = isOutgoing ? call.receiverProfilePic : call.callerProfilePic;

                return (
                    <div key={call.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={otherPartyPic} alt={otherPartyName} className="w-12 h-12 rounded-full object-cover"/>
                            <div className="ml-4">
                                <p className="font-bold text-deepBlue-900 dark:text-gray-100">{otherPartyName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    {call.type === 'video' ? <VideoIcon className="h-4 w-4"/> : <VoiceIcon className="h-4 w-4"/>}
                                    <span>{new Date(call.timestamp).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('callDuration')}</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{Math.floor(call.duration / 60)}m {call.duration % 60}s</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// --- EDIT PROFILE MODAL ---
interface EditProfileModalProps {
    user: LoggedInUser;
    onSave: (updatedUser: LoggedInUser) => void;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
    const { t } = useLocalization();
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        bio: 'bio' in user ? user.bio : '',
        expertise: 'expertise' in user ? user.expertise : '',
    });
    const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = { ...user, ...formData };
        onSave(updatedUser);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn relative">
                <h2 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100 mb-4">{t('profileEditProfile')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileFirstName')}</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileLastName')}</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileUsername')}</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={inputStyle} />
                    </div>
                    {user.role === 'guru' && (
                        <>
                            <div>
                                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileExpertise')}</label>
                                <input type="text" id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileBio')}</label>
                                <textarea id="bio" name="bio" rows={3} value={formData.bio} onChange={handleChange} className={inputStyle} />
                            </div>
                        </>
                    )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">{t('cancel')}</button>
                        <button type="submit" className="px-6 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-semibold">{t('profileSaveChanges')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN PROFILE PAGE ---
interface ProfilePageProps {
  currentUser: LoggedInUser;
  startCall: (guru: Guru, type: CallType) => void;
  openDakshinaModal: (post: Post) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, startCall, openDakshinaModal, onLogout }) => {
    const { t } = useLocalization();
    const [user, setUser] = useState(currentUser);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [allGurus, setAllGurus] = useState<Guru[]>([]);
    const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'posts' | 'activity' | 'history'>(
        currentUser.role === 'guru' ? 'posts' : 'activity'
    );
    
    // Type guard to check if user is a Guru
    const isGuru = (user: LoggedInUser): user is Guru => user.role === 'guru';
    
    useEffect(() => {
        try {
            const allUsersJson = localStorage.getItem('gyansetu-users');
            const allUsers: StoredUser[] = allUsersJson ? JSON.parse(allUsersJson) : [];
            setAllGurus(allUsers.filter(u => u.role === 'guru') as Guru[]);

            if (isGuru(user)) {
                const allPostsJson = localStorage.getItem('gyansetu-posts');
                const allPosts: Post[] = allPostsJson ? JSON.parse(allPostsJson) : [];
                setUserPosts(allPosts.filter(post => post.guru.id === user.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }

            const historyJson = localStorage.getItem('gyansetu-call-history');
            const allCalls: CallRecord[] = historyJson ? JSON.parse(historyJson) : [];
            const userCalls = allCalls.filter(c => c.callerId === user.id || c.receiverId === user.id);
            setCallHistory(userCalls);
        } catch(e) {
            console.error("Failed to load data", e);
        }
    }, [user]);

    const handleSaveProfile = (updatedUser: LoggedInUser) => {
        setUser(updatedUser);
        let users: StoredUser[] = [];
        try {
            const usersJson = localStorage.getItem('gyansetu-users');
            users = usersJson ? JSON.parse(usersJson) : [];
        } catch (e) {
            console.error("Failed to parse users from localStorage", e);
            users = [];
        }
        
        const userIndex = users.findIndex(u => u.id === updatedUser.id);
        if (userIndex > -1) {
            users[userIndex] = updatedUser as StoredUser;
            localStorage.setItem('gyansetu-users', JSON.stringify(users));
            localStorage.setItem('gyansetu-session', JSON.stringify(updatedUser));
        }
        setIsEditModalOpen(false);
    };

    const handleSaveBankDetails = (details: BankDetails) => {
        setBankDetails(details);
        setIsBankModalOpen(false);
        if (isGuru(user) && user.upiId !== details.upiId) {
            handleSaveProfile({ ...user, upiId: details.upiId });
        }
    };

    const handleProfilePictureChange = () => {
        const newPicUrl = `https://picsum.photos/seed/${Math.random()}/200`;
        const updatedUser = { ...user, profilePictureUrl: newPicUrl };
        handleSaveProfile(updatedUser);
    }

    const maskAccountNumber = (num: string) => `XXXX XXXX ${num.slice(-4)}`;
    
    const TabButton: React.FC<{label: string, tabName: typeof activeTab, children: React.ReactNode}> = ({label, tabName, children}) => (
        <button onClick={() => setActiveTab(tabName)} className={`${activeTab === tabName ? 'border-saffron-500 text-saffron-600 dark:text-saffron-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            {children}
        </button>
    );

    return (
        <div className="space-y-8">
            {isEditModalOpen && <EditProfileModal user={user} onSave={handleSaveProfile} onClose={() => setIsEditModalOpen(false)} />}
            {isBankModalOpen && isGuru(user) && (
                <BankDetailsModal 
                    initialDetails={bankDetails}
                    onSave={handleSaveBankDetails}
                    onClose={() => setIsBankModalOpen(false)}
                />
            )}

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center relative">
                <button onClick={() => setIsEditModalOpen(true)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300">
                    <EditIcon className="w-6 h-6"/>
                </button>
                <div className="relative w-32 h-32 mx-auto">
                    <img src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-saffron-300 dark:border-saffron-600" loading="lazy" />
                    <button onClick={handleProfilePictureChange} className="absolute bottom-1 right-1 bg-white dark:bg-gray-600 p-2 rounded-full shadow-md text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-gray-500">
                        <CameraIcon className="w-5 h-5"/>
                    </button>
                </div>
                <h2 className="text-3xl font-bold text-deepBlue-900 dark:text-gray-100">{`${user.firstName} ${user.lastName}`}</h2>
                <p className="text-md text-gray-500 dark:text-gray-400">@{user.username}</p>
                
                {isGuru(user) && (
                  <>
                    <p className="text-md text-saffron-800 dark:text-saffron-400 font-semibold mt-1">{user.expertise}</p>
                    <div className="flex items-center justify-center text-yellow-500 mt-2">
                        <span>⭐ {user.rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm ml-2">({user.reviews} reviews)</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-xl mx-auto">{user.bio}</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
                        <button 
                            onClick={() => startCall(user, 'video')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-saffron-500 text-white font-bold py-2 px-6 rounded-full hover:bg-saffron-600 transition-colors">
                            <VideoIcon className="h-5 w-5" />
                            <span>{t('callVideo')} Call</span>
                        </button>
                        <button 
                            onClick={() => startCall(user, 'voice')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-deepBlue-700 text-white font-bold py-2 px-6 rounded-full hover:bg-deepBlue-800 transition-colors">
                            <VoiceIcon className="h-5 w-5" />
                            <span>{t('callVoice')} Call</span>
                        </button>
                    </div>
                  </>
                )}
            </div>
            
            {/* Bank Details for Guru */}
            {isGuru(user) && user.username !== APP_OWNER_USERNAME && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('profileBankDetailsTitle')}</h3>
                    {bankDetails ? (
                       <div className="text-left space-y-3 text-gray-700 dark:text-gray-300">
                          <div><strong className="font-semibold text-gray-800 dark:text-gray-200">{t('bankAccountHolder')}:</strong> {bankDetails.accountHolder}</div>
                          <div><strong className="font-semibold text-gray-800 dark:text-gray-200">{t('bankAccountNumber')}:</strong> {maskAccountNumber(bankDetails.accountNumber)}</div>
                          <div><strong className="font-semibold text-gray-800 dark:text-gray-200">{t('bankIFSC')}:</strong> {bankDetails.ifsc}</div>
                          <div><strong className="font-semibold text-gray-800 dark:text-gray-200">{t('bankUPI')}:</strong> {bankDetails.upiId}</div>
                          <button
                            onClick={() => setIsBankModalOpen(true)}
                            className="mt-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            {t('profileBankDetailsEdit')}
                          </button>
                       </div>
                    ) : (
                      <div className="text-center py-4">
                         <p className="text-gray-500 dark:text-gray-400 mb-4">{t('profileBankDetailsPrompt')}</p>
                         <button
                            onClick={() => setIsBankModalOpen(true)}
                            className="bg-deepBlue-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-deepBlue-800 transition-colors"
                         >
                            {t('profileBankDetailsAdd')}
                        </button>
                      </div>
                    )}
                </div>
            )}
            
            {/* Tabs & Content */}
            <div>
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {isGuru(user) ? (
                            <>
                                <TabButton tabName='posts'>{t('profileMyGyan')}</TabButton>
                                <TabButton tabName='history'>{t('profileCallHistory')}</TabButton>
                            </>
                        ) : (
                            <>
                                <TabButton tabName='activity'>{t('profileMyActivity')}</TabButton>
                                <TabButton tabName='history'>{t('profileCallHistory')}</TabButton>
                            </>
                        )}
                    </nav>
                </div>
                <div>
                    {activeTab === 'posts' && isGuru(user) && (
                        userPosts.length > 0 ? (
                            userPosts.map(post => <PostCard key={post.id} post={post} onGurudakshinaClick={openDakshinaModal} />)
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">{t('profileNoPosts')}</div>
                        )
                    )}
                     {activeTab === 'activity' && !isGuru(user) && (
                        <div className="space-y-6">
                            <RecommendedGurus gurus={allGurus.filter(g => g.id !== user.id && g.username !== APP_OWNER_USERNAME)} />
                        </div>
                    )}
                    {activeTab === 'history' && <CallHistory calls={callHistory} currentUserId={user.id} />}
                </div>
            </div>

            {/* Logout Button */}
            <div className="text-center pt-4 border-t dark:border-gray-700">
                <button 
                    onClick={onLogout}
                    className="w-full sm:w-auto bg-red-500 text-white font-bold py-2 px-8 rounded-full hover:bg-red-600 transition-colors">
                    {t('profileLogout')}
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
