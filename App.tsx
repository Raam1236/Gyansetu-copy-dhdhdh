
import React, { useState, Suspense, useEffect, createContext, useContext, useMemo } from 'react';
import { type ActivePage, type LoggedInUser, type Guru, type Post, type Theme, type BankDetails } from './types';
import BottomNav from './components/BottomNav';
import Spinner from './components/Spinner';
import { APP_OWNER_USERNAME } from './constants';

// --- LOCALIZATION SETUP ---

const baseTranslations = {
  appName: 'GyanSetu',
  close: 'Close',
  cancel: 'Cancel',
  submit: 'Submit',
  headerTitleHindi: 'ज्ञानसेतु',
  headerTitle: 'GyanSetu',
  openMenu: 'Open navigation menu',
  menuTitle: 'GyanSetu Menu',
  language: 'Language',
  support: 'Support',
  contactUs: 'Contact Us',
  copyright: 'Copyright',
  ownerDashboard: 'Owner Dashboard',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  appCopyrightDesc: '📜 App Copyright Description',
  copyrightLine1: '© 2025 GYAN SETU. All Rights Reserved.',
  copyrightLine2: 'This application and its contents are the intellectual property of RG Creation.',
  copyrightLine3: 'Unauthorized copying is strictly prohibited.',
  copyrightLine4: 'Protected under copyright laws.',
  copyrightLine5: 'All trademarks belong to their respective owners.',
  copyrightExample: 'Example:',
  copyrightExampleText: '© 2025 GyanSetu. All Rights Reserved.',
  appFeedback: 'App Feedback',
  feedbackPlaceholder: 'Tell us what you think...',
  ownerDashboardWelcome: 'Welcome, App Owner.',
  authWelcome: 'Welcome Back',
  authLoginPrompt: 'Login to continue your journey.',
  authIdentifierPlaceholder: 'Email, Username or Mobile',
  authPasswordPlaceholder: 'Password',
  authLoginButton: 'Login',
  authLoggingInButton: 'Logging in...',
  authForgotPasswordLink: 'Forgot Password?',
  authNoAccountPrompt: "Don't have an account?",
  authSignUpLink: 'Sign Up',
  authJoinTitle: 'Join GyanSetu',
  authChoosePath: 'Choose your path.',
  authRoleGuru: 'I am a Guru',
  authRoleGuruDesc: 'Share your wisdom.',
  authRoleShishya: 'I am a Shishya',
  authRoleShishyaDesc: 'Seek knowledge.',
  authNextButton: 'Next',
  authHaveAccountPrompt: 'Already have an account?',
  authCreateAccountTitle: 'Create Your Account',
  authFirstNamePlaceholder: 'First Name',
  authLastNamePlaceholder: 'Last Name',
  authEmailPlaceholder: 'Email',
  authUsernamePlaceholder: 'Username',
  authMobilePlaceholder: 'Mobile Number',
  authConfirmPasswordPlaceholder: 'Confirm Password',
  authCreateAccountButton: 'Create Account',
  authCreatingAccountButton: 'Creating...',
  authForgotPasswordTitle: 'Forgot Password',
  authForgotPasswordPrompt: 'Enter your email or mobile.',
  authSendOTPButton: 'Send OTP',
  authSendingOTPButton: 'Sending...',
  authResetPasswordTitle: 'Reset Password',
  authOTPSentPrompt: 'OTP sent to {identifier}.',
  authOTPPlaceholder: 'Enter 6-digit OTP',
  authNewPasswordPlaceholder: 'New Password',
  authResetPasswordButton: 'Reset Password',
  authResettingPasswordButton: 'Resetting...',
  errorInvalidCredentials: 'Invalid credentials.',
  errorPasswordsNoMatch: 'Passwords do not match.',
  errorPasswordTooShort: 'Password too short.',
  errorEmailExists: 'Email already exists.',
  errorUsernameExists: 'Username taken.',
  errorMobileExists: 'Mobile exists.',
  errorSelectRole: 'Select a role.',
  navHome: 'Home',
  navSearch: 'Discover',
  navCreate: 'Create',
  navProfile: 'Profile',
  homeWelcome: 'Welcome to GyanSetu!',
  homeCommunityStart: 'Community starting.',
  homeNoWisdom: 'No wisdom yet.',
  homeDiscoverGurus: 'Discover Gurus',
  homeFeaturedGurus: 'Featured Gurus',
  homeCreatePrompt: '{firstName}, share today?',
  homeCreateArticle: 'Article',
  homeCreateVideo: 'Video',
  homeCreateImage: 'Image',
  postGyanShort: 'Gyan Short',
  postAnubhavArticle: 'Anubhav Article',
  postImagePost: 'Image Post',
  postReadMore: 'Read More...',
  postGurudakshina: 'Gurudakshina',
  discoverTitle: 'Find your Guru',
  discoverSubtitle: 'Connect for wisdom.',
  discoverSearchPlaceholder: 'Search experts...',
  discoverSortBy: 'Sort by:',
  discoverSortDefault: 'Default',
  discoverSortRating: 'Rating',
  discoverSortExpertise: 'Expertise',
  discoverViewProfile: 'View Profile',
  discoverNoGurusTitle: 'No Gurus Found',
  discoverNoGurusSubtitle: 'Growing soon.',
  discoverNoGurusPrompt: 'Check back later.',
  createTitle: 'Share your Gyan',
  createSubtitle: 'Wisdom today?',
  createTypeArticle: '✍️ Article',
  createTypeVideo: '🎬 Video',
  createTypeImage: '🖼️ Image',
  createFieldTitle: 'Title',
  createFieldTitlePlaceholder: 'Catchy title...',
  createFieldContent: 'Content',
  createFieldContentPlaceholder: 'Write here...',
  createFieldMediaUpload: 'Upload {mediaType}',
  createFieldMediaImage: 'Image',
  createFieldMediaVideo: 'Video',
  createFieldMediaUploadFile: 'Upload file',
  createFieldMediaDragDrop: 'or drag drop',
  createFieldMediaFileType: 'PNG/JPG/MP4',
  createFieldCaption: 'Caption',
  createFieldCaptionPlaceholder: 'Describe it...',
  createPostButton: 'Share Gyan',
  profileRecommendedGurus: 'Recommended',
  profileFollow: 'Follow',
  profileEditProfile: 'Edit Profile',
  profileFirstName: 'First Name',
  profileLastName: 'Last Name',
  profileUsername: 'Username',
  profileExpertise: 'Expertise',
  profileBio: 'Bio',
  profileSaveChanges: 'Save',
  callVideo: 'Video',
  callVoice: 'Voice',
  profileBankDetailsTitle: 'Bank Details',
  profileBankDetailsEdit: 'Edit',
  profileBankDetailsPrompt: 'Add bank for Dakshina.',
  profileBankDetailsAdd: 'Add',
  profileMyGyan: 'My Gyan',
  profileMyActivity: 'Activity',
  profileCallHistory: 'Calls',
  profileNoPosts: 'No posts yet.',
  profileNoCalls: 'No history.',
  profileActivityPlaceholder: 'Activity here.',
  profileLogout: 'Logout',
  bankAccountHolder: 'Holder Name',
  bankAccountHolderPlaceholder: 'Name',
  bankAccountNumber: 'Account Number',
  bankAccountNumberPlaceholder: 'Number',
  bankIFSC: 'IFSC',
  bankIFSCPlaceholder: 'IFSC',
  bankUPI: 'UPI ID',
  bankUPIPlaceholder: 'UPI',
  bankSaveButton: 'Save',
  dakshinaTitle: 'Dakshina for',
  dakshinaAmountPrompt: 'Select amount (₹)',
  dakshinaCustomAmountPlaceholder: 'Custom amount',
  dakshinaPayButton: 'Pay UPI',
  dakshinaOr: 'OR',
  dakshinaScanPrompt: 'Scan QR',
  dakshinaQRGeneration: 'Enter amount for QR',
  callWith: '{callType} with',
  premiumTitle: 'Free over!',
  premiumMessage: 'Go Premium!',
  premiumGoPremium: 'Upgrade',
  premiumEndCall: 'End',
  callCameraOff: 'Off',
  networkGood: 'Good',
  callDuration: 'Duration',
};

const translations: Record<string, Record<string, string>> = {
  en: baseTranslations,
  hi: { ...baseTranslations, headerTitleHindi: 'ज्ञानसेतु' },
  kn: { ...baseTranslations },
  es: { ...baseTranslations },
  ta: { ...baseTranslations },
  te: { ...baseTranslations },
  bn: { ...baseTranslations },
};

export type TranslationKey = keyof typeof baseTranslations;

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('Localization provider not found');
  return context;
};

// --- LAZY COMPONENTS ---
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage'));
const CreatePage = React.lazy(() => import('./pages/CreatePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CallPage = React.lazy(() => import('./pages/CallPage'));
const GurudakshinaModal = React.lazy(() => import('./components/GurudakshinaModal'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));

const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const App: React.FC = () => {
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('gyansetu-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('gyansetu-lang', language);
  }, [language]);

  const t = useMemo(() => (key: TranslationKey, replacements?: Record<string, string | number>) => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key as string] || translations.en[key as string] || (key as string);
    
    if (replacements) {
        Object.keys(replacements).forEach(k => {
            text = text.replace(`{${k}}`, String(replacements[k]));
        });
    }
    return text;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      <AppContent />
    </LocalizationContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { t } = useLocalization();
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [callInfo, setCallInfo] = useState<any>(null);
  const [dakshinaTarget, setDakshinaTarget] = useState<any>(null);
  const [theme] = useState<Theme>(() => (localStorage.getItem('gyansetu-theme') as Theme) || 'system');

  useEffect(() => {
    const saved = localStorage.getItem('gyansetu-session');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('gyansetu-session');
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (isAuthLoading) return <Spinner />;

  if (!currentUser) {
    return (
      <Suspense fallback={<Spinner />}>
        <AuthPage onAuthSuccess={u => { setCurrentUser(u); setActivePage('home'); }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-deepBlue-950 font-sans">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-deepBlue-900 dark:text-gray-100">
            {t('headerTitleHindi')} <span className="text-saffron-600 dark:text-saffron-400">{t('headerTitle')}</span>
          </h1>
          <button className="p-2 rounded-full text-deepBlue-800 dark:text-gray-200"><MenuIcon className="h-6 w-6" /></button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 pb-24 page-transition">
        <Suspense fallback={<Spinner />}>
          {activePage === 'home' && <HomePage currentUser={currentUser} openDakshinaModal={setDakshinaTarget} setActivePage={setActivePage} />}
          {activePage === 'discover' && <DiscoverPage startCall={(guru, type) => setCallInfo({guru, type})} />}
          {activePage === 'create' && currentUser.role === 'guru' && <CreatePage currentUser={currentUser as Guru} />}
          {activePage === 'profile' && <ProfilePage currentUser={currentUser} startCall={(guru, type) => setCallInfo({guru, type})} openDakshinaModal={setDakshinaTarget} onLogout={() => { localStorage.removeItem('gyansetu-session'); setCurrentUser(null); }} />}
        </Suspense>
      </main>
      {callInfo && (
        <Suspense fallback={<Spinner />}>
          <CallPage guru={callInfo.guru} type={callInfo.type} onEndCall={() => setCallInfo(null)} currentUser={currentUser} />
        </Suspense>
      )}
      {dakshinaTarget && (
        <Suspense fallback={<Spinner />}>
          <GurudakshinaModal 
            guru={dakshinaTarget.guru || dakshinaTarget} 
            post={dakshinaTarget.post || dakshinaTarget} 
            onClose={() => setDakshinaTarget(null)} 
            currentUser={currentUser} 
          />
        </Suspense>
      )}
      <BottomNav activePage={activePage} setActivePage={setActivePage} userRole={currentUser.role} />
    </div>
  );
};

export default App;
