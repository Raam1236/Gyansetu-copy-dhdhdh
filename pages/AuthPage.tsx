
import React, { useState, FC, ChangeEvent, FormEvent, useEffect } from 'react';
import { LoggedInUser, UserRole, StoredUser } from '../types';
import { useLocalization } from '../App';
import { supabase } from '../lib/supabase';

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

// Define AuthPageProps interface to fix missing type error on line 45
interface AuthPageProps {
  onAuthSuccess: (user: LoggedInUser) => void;
}

const AuthPage: FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const { t } = useLocalization();
    const [view, setView] = useState<'login' | 'signupRole' | 'signupDetails' | 'forgot' | 'otp'>('login');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Auth State
    const [identifier, setIdentifier] = useState(''); // Email
    const [password, setPassword] = useState('');
    const [signupRole, setSignupRole] = useState<UserRole | null>(null);
    const [signupData, setSignupData] = useState({
        firstName: '', lastName: '', email: '', username: '', mobile: '', password: '', confirmPassword: ''
    });

    useEffect(() => {
        document.body.classList.add('auth-background');
        return () => document.body.classList.remove('auth-background');
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: identifier,
            password: password,
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Fetch profile data from 'profiles' table
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            const loggedInUser = { ...profile, email: data.user.email } as LoggedInUser;
            localStorage.setItem('gyansetu-session', JSON.stringify(loggedInUser));
            onAuthSuccess(loggedInUser);
        }
        setIsLoading(false);
    };

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (signupData.password !== signupData.confirmPassword) {
            setError(t('errorPasswordsNoMatch'));
            return;
        }

        setIsLoading(true);

        const { data, error: authError } = await supabase.auth.signUp({
            email: signupData.email,
            password: signupData.password,
            options: {
                data: {
                    first_name: signupData.firstName,
                    last_name: signupData.lastName,
                    username: signupData.username,
                    role: signupRole,
                }
            }
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Create record in profiles table
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                first_name: signupData.firstName,
                last_name: signupData.lastName,
                username: signupData.username,
                role: signupRole,
                avatar_url: `https://picsum.photos/seed/${signupData.username}/200`
            });

            if (profileError) {
                setError(profileError.message);
                setIsLoading(false);
                return;
            }

            const newUser = {
                id: data.user.id,
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                username: signupData.username,
                role: signupRole!,
                email: signupData.email,
                profilePictureUrl: `https://picsum.photos/seed/${signupData.username}/200`
            } as LoggedInUser;

            localStorage.setItem('gyansetu-session', JSON.stringify(newUser));
            onAuthSuccess(newUser);
        }
        setIsLoading(false);
    };

    const renderLogin = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">{t('authWelcome')}</h1>
                <p className="text-gray-300">{t('authLoginPrompt')}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <InputField name="email" placeholder={t('authEmailPlaceholder')} type="email" value={identifier} onChange={e => setIdentifier(e.target.value)} icon={<EmailIcon className="h-5 w-5"/>} />
                <InputField name="password" type="password" placeholder={t('authPasswordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="h-5 w-5"/>} />
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-saffron-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-saffron-700 disabled:opacity-50">
                    {isLoading ? t('authLoggingInButton') : t('authLoginButton')}
                </button>
            </form>
            <p className="text-center text-sm text-gray-300">
                {t('authNoAccountPrompt')}{' '}
                <button type="button" onClick={() => setView('signupRole')} className="text-saffron-400 font-bold">{t('authSignUpLink')}</button>
            </p>
        </div>
    );

    const renderSignupRole = () => (
        <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-white">{t('authJoinTitle')}</h1>
            <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setSignupRole('guru')} className={`p-4 rounded-lg border-2 cursor-pointer transition ${signupRole === 'guru' ? 'border-saffron-500 bg-saffron-500/20' : 'border-gray-600'}`}>
                    <h3 className="font-bold text-white">{t('authRoleGuru')}</h3>
                </div>
                <div onClick={() => setSignupRole('shishya')} className={`p-4 rounded-lg border-2 cursor-pointer transition ${signupRole === 'shishya' ? 'border-saffron-500 bg-saffron-500/20' : 'border-gray-600'}`}>
                    <h3 className="font-bold text-white">{t('authRoleShishya')}</h3>
                </div>
            </div>
            <button onClick={() => signupRole && setView('signupDetails')} className="w-full bg-saffron-600 text-white py-3 rounded-lg font-bold">Next</button>
        </div>
    );

    const renderSignupDetails = () => (
        <form onSubmit={handleSignup} className="space-y-3">
            <h1 className="text-2xl font-bold text-white mb-4">Account Details</h1>
            <InputField name="firstName" placeholder="First Name" value={signupData.firstName} onChange={e => setSignupData({...signupData, firstName: e.target.value})} />
            <InputField name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={e => setSignupData({...signupData, lastName: e.target.value})} />
            <InputField name="email" type="email" placeholder="Email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} />
            <InputField name="username" placeholder="Username" value={signupData.username} onChange={e => setSignupData({...signupData, username: e.target.value})} />
            <InputField name="password" type="password" placeholder="Password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} />
            <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})} />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-saffron-600 text-white py-3 rounded-lg font-bold">
                {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                {view === 'login' ? renderLogin() : view === 'signupRole' ? renderSignupRole() : renderSignupDetails()}
            </div>
        </div>
    );
};

export default AuthPage;
