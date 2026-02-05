
import React, { useState, FC, ChangeEvent, FormEvent, useEffect } from 'react';
import { LoggedInUser, UserRole, StoredUser } from '../types';
import { useLocalization } from '../App';

// --- TYPE DEFINITIONS ---
interface AuthPageProps {
  onAuthSuccess: (user: LoggedInUser) => void;
}
type AuthView = 'login' | 'signupRole' | 'signupDetails' | 'forgot' | 'otp';

// --- SVG ICONS ---
const UserIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const EmailIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
);
const PhoneIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const LockIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const ArrowLeftIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);


// --- UTILITY FUNCTIONS ---
const getUsersFromStorage = (): StoredUser[] => {
    try {
        const usersJson = localStorage.getItem('gyansetu-users');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return [];
    }
};

const InputField: FC<{ name: string; label?: string; type?: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; icon?: React.ReactNode }> = 
    ({ name, label, type = 'text', value, onChange, required = true, placeholder, icon }) => (
    <div>
        {label && <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">{label}</label>}
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {icon}
            </span>
            <input 
              type={type} 
              id={name} 
              name={name} 
              value={value} 
              onChange={onChange} 
              className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 sm:text-sm placeholder-gray-400" 
              required={required} 
              placeholder={placeholder} 
            />
        </div>
    </div>
);


// --- MAIN AUTH PAGE COMPONENT ---
const AuthPage: FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const { t } = useLocalization();
    const [view, setView] = useState<AuthView>('login');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Login State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Signup State
    const [signupRole, setSignupRole] = useState<UserRole | null>(null);
    const [signupData, setSignupData] = useState({
        firstName: '', lastName: '', email: '', username: '', mobile: '', password: '', confirmPassword: ''
    });

    // Forgot Password State
    const [resetIdentifier, setResetIdentifier] = useState('');

    useEffect(() => {
        document.body.classList.add('auth-background');
        return () => {
            document.body.classList.remove('auth-background');
        }
    }, []);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const users = getUsersFromStorage();
            const lowerIdentifier = loginIdentifier.toLowerCase().trim();
            const user = users.find(u => 
                u.email.toLowerCase() === lowerIdentifier || 
                u.username.toLowerCase() === lowerIdentifier ||
                u.mobile === lowerIdentifier
            );

            if (user && user.password === loginPassword) {
                localStorage.setItem('gyansetu-session', JSON.stringify(user));
                onAuthSuccess(user);
            } else {
                setError(t('errorInvalidCredentials'));
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (signupData.password !== signupData.confirmPassword) {
            setError(t('errorPasswordsNoMatch'));
            return;
        }
        if (signupData.password.length < 6) {
            setError(t('errorPasswordTooShort'));
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const users = getUsersFromStorage();
            if (users.some(u => u.email.toLowerCase() === signupData.email.toLowerCase().trim())) {
                setError(t('errorEmailExists'));
                return setIsLoading(false);
            }
            if (users.some(u => u.username.toLowerCase() === signupData.username.toLowerCase().trim())) {
                setError(t('errorUsernameExists'));
                return setIsLoading(false);
            }
             if (users.some(u => u.mobile.trim() === signupData.mobile.trim())) {
                setError(t('errorMobileExists'));
                return setIsLoading(false);
            }
            
            const newUser: StoredUser = {
                id: `user_${Date.now()}`,
                role: signupRole!,
                firstName: signupData.firstName.trim(),
                lastName: signupData.lastName.trim(),
                email: signupData.email.trim().toLowerCase(),
                username: signupData.username.trim().toLowerCase(),
                mobile: signupData.mobile.trim(),
                password: signupData.password,
                profilePictureUrl: `https://picsum.photos/seed/${signupData.username}/200`,
                ...(signupRole === 'guru' && {
                    age: 0, expertise: '', bio: '', rating: 0, reviews: 0, upiId: ''
                })
            };

            users.push(newUser);
            localStorage.setItem('gyansetu-users', JSON.stringify(users));
            localStorage.setItem('gyansetu-session', JSON.stringify(newUser));
            onAuthSuccess(newUser);

        }, 1500);
    };

    const handleForgotPassword = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            alert(`Password reset OTP sent to ${resetIdentifier}. (Simulation)`);
            setIsLoading(false);
            setView('otp');
        }, 1000);
    }
    
    const handleResetPassword = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            alert(`Password has been successfully reset. Please login with your new password. (Simulation)`);
            setIsLoading(false);
            setView('login');
        }, 1000);
    }

    const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSignupData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const renderLogin = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">{t('authWelcome')}</h1>
                <p className="text-gray-300">{t('authLoginPrompt')}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <InputField name="identifier" placeholder={t('authIdentifierPlaceholder')} value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} icon={<UserIcon className="h-5 w-5"/>} />
                <InputField name="password" type="password" placeholder={t('authPasswordPlaceholder')} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} icon={<LockIcon className="h-5 w-5"/>} />
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full flex justify-center bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 transition-colors disabled:bg-saffron-800 disabled:cursor-not-allowed">
                    {isLoading ? t('authLoggingInButton') : t('authLoginButton')}
                </button>
                 <div className="text-center">
                    <button type="button" onClick={() => setView('forgot')} className="font-medium text-sm text-gray-300 hover:text-white">{t('authForgotPasswordLink')}</button>
                </div>
            </form>
            <p className="text-center text-sm text-gray-300">
                {t('authNoAccountPrompt')}{' '}
                <button type="button" onClick={() => { setView('signupRole'); setError(''); }} className="font-medium text-saffron-400 hover:text-saffron-300">{t('authSignUpLink')}</button>
            </p>
        </div>
    );
    
    const renderSignupRole = () => {
        const guruImgUrl = 'https://i.imgur.com/P559n2m.jpg';
        const shishyaImgUrl = 'https://i.imgur.com/hYy1p5g.png';

        return (
            <div className="space-y-6 text-center">
                 <div>
                    <h1 className="text-4xl font-bold text-white">{t('authJoinTitle')}</h1>
                    <p className="text-gray-300">{t('authChoosePath')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => setSignupRole('guru')} className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${signupRole === 'guru' ? 'ring-4 ring-saffron-500 scale-105' : 'ring-2 ring-gray-600'}`}>
                        <img src={guruImgUrl} className="w-full h-48 object-cover bg-saffron-100" alt="Guru"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-3 text-white text-left">
                            <h3 className="font-bold text-lg">{t('authRoleGuru')}</h3>
                            <p className="text-xs">{t('authRoleGuruDesc')}</p>
                        </div>
                    </div>
                    <div onClick={() => setSignupRole('shishya')} className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${signupRole === 'shishya' ? 'ring-4 ring-saffron-500 scale-105' : 'ring-2 ring-gray-600'}`}>
                        <img src={shishyaImgUrl} className="w-full h-48 object-cover bg-deepBlue-100" alt="Shishya"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 p-3 text-white text-left">
                            <h3 className="font-bold text-lg">{t('authRoleShishya')}</h3>
                            <p className="text-xs">{t('authRoleShishyaDesc')}</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => { if(signupRole) setView('signupDetails'); else setError(t('errorSelectRole')); }} className="w-full bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 transition-colors disabled:bg-gray-500">{t('authNextButton')}</button>
                <p className="text-center text-sm text-gray-300">
                    {t('authHaveAccountPrompt')}{' '}
                    <button type="button" onClick={() => { setView('login'); setError(''); }} className="font-medium text-saffron-400 hover:text-saffron-300">{t('authLoginButton')}</button>
                </p>
            </div>
        );
    };
    
    const renderSignupDetails = () => (
       <div className="space-y-4">
            <div className="flex items-center gap-4">
                 <button onClick={() => setView('signupRole')} className="text-gray-300 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">{t('authCreateAccountTitle')}</h1>
            </div>
            <form onSubmit={handleSignup} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <InputField name="firstName" placeholder={t('authFirstNamePlaceholder')} value={signupData.firstName} onChange={handleSignupChange} icon={<UserIcon className="h-5 w-5"/>} />
                    <InputField name="lastName" placeholder={t('authLastNamePlaceholder')} value={signupData.lastName} onChange={handleSignupChange} icon={<UserIcon className="h-5 w-5"/>} />
                </div>
                <InputField name="email" placeholder={t('authEmailPlaceholder')} type="email" value={signupData.email} onChange={handleSignupChange} icon={<EmailIcon className="h-5 w-5"/>} />
                <InputField name="username" placeholder={t('authUsernamePlaceholder')} value={signupData.username} onChange={handleSignupChange} icon={<UserIcon className="h-5 w-5"/>} />
                <InputField name="mobile" placeholder={t('authMobilePlaceholder')} type="tel" value={signupData.mobile} onChange={handleSignupChange} icon={<PhoneIcon className="h-5 w-5"/>} />
                <InputField name="password" placeholder={t('authPasswordPlaceholder')} type="password" value={signupData.password} onChange={handleSignupChange} icon={<LockIcon className="h-5 w-5"/>} />
                <InputField name="confirmPassword" placeholder={t('authConfirmPasswordPlaceholder')} type="password" value={signupData.confirmPassword} onChange={handleSignupChange} icon={<LockIcon className="h-5 w-5"/>} />
                
                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}
                
                <button type="submit" disabled={isLoading} className="w-full bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 transition-colors disabled:bg-saffron-800 disabled:cursor-not-allowed">
                    {isLoading ? t('authCreatingAccountButton') : t('authCreateAccountButton')}
                </button>
            </form>
       </div>
    );

    const renderForgotPassword = () => (
        <div className="space-y-4">
             <div className="flex items-center gap-4">
                 <button onClick={() => setView('login')} className="text-gray-300 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">{t('authForgotPasswordTitle')}</h1>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-gray-300 text-center">{t('authForgotPasswordPrompt')}</p>
                <InputField name="resetIdentifier" placeholder={t('authIdentifierPlaceholder')} value={resetIdentifier} onChange={(e) => setResetIdentifier(e.target.value)} icon={<EmailIcon className="h-5 w-5"/>} />
                <button disabled={isLoading} className="w-full flex justify-center bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 transition-colors disabled:bg-saffron-800">
                    {isLoading ? t('authSendingOTPButton') : t('authSendOTPButton')}
                </button>
            </form>
        </div>
    );

     const renderOTP = () => (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                 <button onClick={() => setView('forgot')} className="text-gray-300 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-white">{t('authResetPasswordTitle')}</h1>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-gray-300 text-center">{t('authOTPSentPrompt', {identifier: resetIdentifier})}</p>
                <InputField name="otp" placeholder={t('authOTPPlaceholder')} value={''} onChange={() => {}} icon={<LockIcon className="h-5 w-5"/>} />
                <InputField name="newPassword" type="password" placeholder={t('authNewPasswordPlaceholder')} value={''} onChange={() => {}} icon={<LockIcon className="h-5 w-5"/>} />
                <button disabled={isLoading} className="w-full flex justify-center bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 transition-colors disabled:bg-saffron-800">
                    {isLoading ? t('authResettingPasswordButton') : t('authResetPasswordButton')}
                </button>
            </form>
        </div>
    );
    
    const renderContent = () => {
        switch(view) {
            case 'login': return renderLogin();
            case 'signupRole': return renderSignupRole();
            case 'signupDetails': return renderSignupDetails();
            case 'forgot': return renderForgotPassword();
            case 'otp': return renderOTP();
            default: return renderLogin();
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center font-sans p-4">
            <style>{`
                .auth-background {
                    background: linear-gradient(135deg, #1e3a8a, #422006, #a16207);
                    background-size: 400% 400%;
                    animation: gradient 15s ease infinite;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .page-transition {
                  animation: authFadeIn 0.5s ease-in-out;
                }
                @keyframes authFadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 page-transition" key={view}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AuthPage;
