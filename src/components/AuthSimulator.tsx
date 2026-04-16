import React, { useState } from 'react';
import { Shield, ShieldCheck, Lock, Unlock, LogOut, User as UserIcon, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function AuthSimulator() {
  const { user, loading, signIn, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#9333ea] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1c1c21] border border-[#2d2d35] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#9333ea]">
          <Shield className="w-5 h-5" />
          Live Identity Manager
        </h2>
        {user && (
          <button 
            onClick={signOut}
            className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-red-500"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-black/50 p-4 rounded border border-[#2d2d35] terminal-text text-sm">
          <p className="text-[#9ca3af] mb-2">// IDENTITY SECURITY POLICY</p>
          <div className="flex items-center justify-between mb-2">
            <span>Provider: Google OAuth 2.0</span>
            <span className="text-[#22c55e]">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Session Persistence</span>
            <span className="text-[#9333ea]">ENFORCED</span>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6 w-full max-w-sm"
              >
                <div className="w-20 h-20 bg-[#9333ea]/10 rounded-full flex items-center justify-center mx-auto border border-[#9333ea]/20">
                  <Lock className="w-8 h-8 text-[#9333ea]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#f3f4f6]">Secure Access Required</h3>
                  <p className="text-sm text-[#9ca3af]">Authenticate with your Google account to access the CyberDefense Hub.</p>
                </div>
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-3 rounded-lg bg-[#9333ea] text-white font-bold hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {isSigningIn ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" referrerPolicy="no-referrer" />
                      SIGN IN WITH GOOGLE
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full space-y-6"
              >
                <div className="flex items-center gap-4 p-4 bg-black border border-[#2d2d35] rounded-xl">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-[#9333ea]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#f3f4f6] truncate">{user.displayName}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="bg-[#22c55e]/10 text-[#22c55e] p-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black/30 border border-[#2d2d35] rounded-lg">
                    <p className="text-[10px] text-[#9ca3af] uppercase mb-1">Security Status</p>
                    <p className="text-xs font-bold text-[#22c55e]">VERIFIED</p>
                  </div>
                  <div className="p-3 bg-black/30 border border-[#2d2d35] rounded-lg">
                    <p className="text-[10px] text-[#9ca3af] uppercase mb-1">Role</p>
                    <p className="text-xs font-bold text-[#9333ea]">{user.email === 'MaKennaAlicen1@gmail.com' ? 'ADMIN' : 'OPERATIVE'}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#9333ea]/5 border border-[#9333ea]/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-4 h-4 text-[#9333ea]" />
                    <span className="text-xs font-bold text-[#f3f4f6]">Access Granted</span>
                  </div>
                  <p className="text-[10px] text-[#9ca3af] leading-relaxed">
                    You are currently logged in as a verified operative. Your session is secured with industry-standard Google OAuth 2.0.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-black border border-[#2d2d35] rounded text-[10px] text-[#9ca3af] flex items-center gap-2">
        <UserIcon className="w-4 h-4 text-[#9333ea]" />
        <p>This module is now connected to <strong>Firebase Authentication</strong>. Your identity is managed securely via Google's global authentication infrastructure.</p>
      </div>
    </div>
  );
}
