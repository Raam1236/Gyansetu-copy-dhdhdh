
import React, { useState, useEffect, useRef } from 'react';
import { type Guru, type CallType, type LoggedInUser, type CallRecord } from '../types';
import PremiumModal from '../components/PremiumModal';
import { useLocalization } from '../App';

// --- ICONS ---
const MicOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const MicOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M9 9a3 3 0 013-3v3m-3 0a3 3 0 003 3v-3m0 0l6 6" /></svg>;
const CameraOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CameraOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.678 0 3.27.397 4.674 1.107M21.542 12c-1.274 4.057-5.066 7-9.542 7-1.678 0-3.27-.397-4.674-1.107M1 1l22 22" /></svg>;
const EndCallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" stroke="none"><path d="M12 9c-1.63 0-3.14.4-4.5 1.14-.3.16-.62.29-.95.39-.21.06-.42.12-.63.17-.18.04-.36.08-.54.11a1.2 1.2 0 0 1-1.28-1.28c0-.28.06-.55.17-.81.08-.19.18-.38.29-.56.39-.63.85-1.22-1.38-1.75 1.14-1.14 2.58-2 4.36-2.45V3h2v4.13c.21.03.42.06.63.09.28.05.56.1.83.17.48.12.94.27-1.38.46.22.09.43.19.64.3.24.12.48.25.71.39.52.32 1 .7 1.41 1.14l-1.42 1.41c-.24-.24-.51-.45-.81-.62-.12-.07-.25-.13-.38-.19a6.89 6.89 0 0 0-1.02-.45c-.43-.13-.88-.22-1.35-.26V9zM3.48 4.89l1.41-1.42-1.41 1.42c-.01 0-.01 0 0 0zm17.04 17.04l1.41-1.42-1.41 1.42zM4.89 3.48L3.48 4.89l15.63 15.63 1.41-1.41L4.89 3.48zM12 15c1.63 0 3.14-.4 4.5-1.14.3-.16.62-.29.95-.39.21-.06.42.12.63-.17.18.04.36.08.54.11a1.2 1.2 0 0 0 1.28-1.28c0-.28-.06-.55-.17-.81-.08-.19-.18-.38-.29-.56-.39-.63-.85-1.22-1.38-1.75-1.14-1.14-2.58-2-4.36-2.45V3h-2v4.13c-.21.03-.42.06-.63.09-.28.05-.56.1-.83.17-.48.12-.94.27-1.38.46-.22.09-.43.19-.64.3-.24.12-.48.25-.71.39-.52.32-1-.7-1.41-1.14l1.42 1.41c.24-.24.51-.45.81-.62.12-.07.25-.13.38-.19.34-.18.69-.32 1.02-.45.43-.13.88-.22 1.35-.26V15z" transform="rotate(-135 12 12)"/></svg>;

interface CallPageProps {
  guru: Guru;
  type: CallType;
  onEndCall: () => void;
  currentUser: LoggedInUser;
}

const FREE_DURATION = 300; // 5 minutes in seconds

const CallPage: React.FC<CallPageProps> = ({ guru, type, onEndCall, currentUser }) => {
  const { t } = useLocalization();
  const [timeLeft, setTimeLeft] = useState(FREE_DURATION);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(type === 'video');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callStartTime = useRef(Date.now());

  const handleEndCall = () => {
    const duration = Math.floor((Date.now() - callStartTime.current) / 1000);
    
    const newCallRecord: CallRecord = {
        id: `call_${Date.now()}`,
        callerId: currentUser.id,
        callerName: `${currentUser.firstName} ${currentUser.lastName}`,
        callerProfilePic: currentUser.profilePictureUrl,
        receiverId: guru.id,
        receiverName: `${guru.firstName} ${guru.lastName}`,
        receiverProfilePic: guru.profilePictureUrl,
        type: type,
        timestamp: new Date().toISOString(),
        duration: duration,
    };

    try {
        const historyJson = localStorage.getItem('gyansetu-call-history');
        const history: CallRecord[] = historyJson ? JSON.parse(historyJson) : [];
        history.unshift(newCallRecord);
        localStorage.setItem('gyansetu-call-history', JSON.stringify(history));
    } catch(e) {
        console.error("Failed to save call record", e);
    }
    onEndCall();
  };

  useEffect(() => {
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowPremiumModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Get media stream
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === 'video',
          audio: true,
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert("Could not access camera/microphone. Please check permissions.");
        handleEndCall();
      }
    };
    getMedia();

    // Cleanup
    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [type]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleMute = () => {
     if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setIsMuted(prev => !prev);
     }
  };

  const toggleCamera = () => {
    if (type === 'video' && streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setIsCameraOn(prev => !prev);
    }
  };
  
  const handleGoPremium = () => {
    alert("Redirecting to premium subscription page! (Demo)");
    handleEndCall();
  };

  const NetworkIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 text-xs text-white">
      <div className="flex items-end space-x-0.5 h-4">
        <span className={`w-1 rounded-full ${networkQuality === 'good' || networkQuality === 'medium' || networkQuality === 'poor' ? 'bg-green-400' : 'bg-gray-400'}`} style={{height: '25%'}}></span>
        <span className={`w-1 rounded-full ${networkQuality === 'good' || networkQuality === 'medium' ? 'bg-green-400' : 'bg-gray-400'}`} style={{height: '50%'}}></span>
        <span className={`w-1 rounded-full ${networkQuality === 'good' ? 'bg-green-400' : 'bg-gray-400'}`} style={{height: '100%'}}></span>
      </div>
      <span>{t('networkGood')}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-deepBlue-950 text-white z-50 flex flex-col page-transition">
      {showPremiumModal && <PremiumModal onGoPremium={handleGoPremium} onEndCall={handleEndCall} />}
      
      {/* Remote party view (background) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img src={guru.profilePictureUrl} alt={`${guru.firstName} ${guru.lastName}`} className="w-full h-full object-cover opacity-30 blur-md scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Local video preview */}
      {type === 'video' && (
        <div className="absolute z-20 right-4 top-4 w-32 h-48 sm:w-40 sm:h-56 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-white/50 transition-all duration-300">
          <video ref={localVideoRef} autoPlay muted className={`w-full h-full object-cover transition-opacity ${isCameraOn ? 'opacity-100' : 'opacity-0'}`} />
          {!isCameraOn && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-gray-400">
              <CameraOffIcon />
              <span className="text-xs mt-2">{t('callCameraOff')}</span>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-between flex-grow p-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-lg font-semibold text-saffron-300">
            {t('callWith', { callType: type === 'video' ? t('callVideo') : t('callVoice') })}
          </p>
          <h1 className="text-4xl font-bold mt-1">{`${guru.firstName} ${guru.lastName}`}</h1>
          <div className="mt-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-4">
            <span className="text-xl font-mono tracking-wider">{formatTime(timeLeft)}</span>
            <span className="text-gray-400">|</span>
            <NetworkIndicator />
          </div>
        </div>
        
        {/* Guru placeholder (central area) */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
             <img src={guru.profilePictureUrl} alt={`${guru.firstName} ${guru.lastName}`} className="w-full h-full rounded-full object-cover border-4 border-white/50 shadow-lg" />
             {type === 'video' && (
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                     <p className="text-lg font-semibold">Guru's Video</p>
                 </div>
             )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center w-full space-x-6 bg-black/20 backdrop-blur-md p-4 rounded-full max-w-xs">
            <button onClick={toggleMute} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500/80 text-white' : 'bg-white/10'}`}>
                {isMuted ? <MicOffIcon /> : <MicOnIcon />}
            </button>
            {type === 'video' && (
                 <button onClick={toggleCamera} className={`p-4 rounded-full transition-colors ${!isCameraOn ? 'bg-white/20' : 'bg-white/10'}`}>
                    {isCameraOn ? <CameraOnIcon /> : <CameraOffIcon />}
                </button>
            )}
            <button onClick={handleEndCall} className="p-4 bg-red-600 rounded-full hover:bg-red-700 transform hover:scale-110 transition-transform">
                <EndCallIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;