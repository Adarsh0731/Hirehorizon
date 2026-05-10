import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Briefcase, User, Mail, ShieldCheck } from 'lucide-react';

export function Login() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // After login, if role is missing, AuthContext should handle redirection or state
      // But for now, we'll navigate to home or profile
      navigate('/');
    } catch (err: any) {
      console.error("Login component error:", err);
      // Suppress error if user closed the popup (standard behavior)
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Login failed. Please try again.');
        alert(`Login failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-200 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
            <Briefcase size={32} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-10">Sign in to your HireHorizon account to continue.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">Secure Access</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
              <div className="text-indigo-600 font-bold text-lg leading-tight italic font-serif">12k+</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Active Jobs</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
              <div className="text-emerald-600 font-bold text-lg leading-tight italic font-serif">2.5k</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Hiring Now</div>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
          By continuing, you agree to our <span className="text-slate-900 font-medium">Terms of Service</span> and <span className="text-slate-900 font-medium">Privacy Policy</span>.
        </p>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
