import React, { useState, useEffect } from 'react';
import { X, Gift, Users, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface EnhancedReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedReferralModal: React.FC<EnhancedReferralModalProps> = ({ isOpen, onClose }) => {
  const { userData, applyReferralCodeToExistingUser } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    applied?: boolean;
  } | null>(null);

  const handleVerifyAndApply = async () => {
    if (!referralCode.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await applyReferralCodeToExistingUser(referralCode.trim().toUpperCase());
      
      setVerificationResult({
        success: result.success,
        message: result.message,
        applied: result.success
      });

      if (result.success) {
        toast.success(result.message, { duration: 5000 });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      // logger.error('Error applying referral:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      setVerificationResult({
        success: false,
        message: 'An error occurred while applying the referral code',
        applied: false
      });
      toast.error('An error occurred while applying the referral code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setReferralCode('');
    setVerificationResult(null);
    onClose();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save original styles
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore original style
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-2xl border border-slate-700 max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Use Referral Code</h2>
                  <p className="text-slate-400 text-sm">Apply a friend's referral code to get rewards</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Check if user already has referral */}
            {userData?.referredBy ? (
              <div className="text-center py-8">
                <div className="p-4 bg-green-500/20 rounded-xl mb-4 inline-block">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Already Referred!</h3>
                <p className="text-slate-400 mb-4">
                  You've already used referral code: <span className="text-green-400 font-mono">{userData.referredBy}</span>
                </p>
                <p className="text-sm text-slate-500">
                  Each user can only use one referral code per account.
                </p>
              </div>
            ) : (
              <>
                {/* Information */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Gift className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 mb-1">Referral Rewards</h3>
                      <ul className="text-sm text-slate-400 space-y-1">
                        <li>• <span className="text-purple-400">200 Investigation Points</span> for you</li>
                        <li>• <span className="text-blue-400">1 Bonus Hint</span> to help solve cases</li>
                        <li>• <span className="text-amber-400">100 Points + 1 Hint</span> for your friend</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Friend's Referral Code
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="Enter referral code (e.g., ABC123)"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-center text-lg tracking-wider"
                      maxLength={6}
                      disabled={isVerifying}
                    />
                  </div>

                  {/* Verification Result */}
                  {verificationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        verificationResult.success
                          ? 'bg-green-500/10 border-green-500/30 text-green-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {verificationResult.success ? (
                          <CheckCircle className="w-5 h-5 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">
                            {verificationResult.success ? 'Success!' : 'Error'}
                          </p>
                          <p className="text-sm opacity-90">{verificationResult.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Apply Button */}
                  <motion.button
                    onClick={handleVerifyAndApply}
                    disabled={!referralCode.trim() || isVerifying || verificationResult?.applied}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : verificationResult?.applied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Applied Successfully!</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        <span>Verify & Apply Code</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 bg-slate-800/50">
            <p className="text-xs text-slate-500 text-center">
              💡 Tip: Ask your friend for their referral code from their profile page!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
