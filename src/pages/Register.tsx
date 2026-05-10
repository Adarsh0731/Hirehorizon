import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, User, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

export function Register() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'candidate' | 'employer' | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!role) return;
    setLoading(true);
    try {
      // Logic would go here to sign in and then save the role
      // For this demo, we assume the user clicks google after selecting role
      await signInWithGoogle();
      // AuthContext would ideally handle the profile creation if it's new
      // But we'll add a check here too
    } catch (err: any) {
      console.error("Register component error:", err);
      // Suppress error if user closed the popup (standard behavior)
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(`Sign up failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-200">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Create your account</h1>
            <p className="text-slate-500 max-w-sm mx-auto">Choose how you want to use HireHorizon to get started with the right experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button 
              onClick={() => setRole('candidate')}
              className={`p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                role === 'candidate' 
                ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-500/10' 
                : 'border-slate-100 bg-slate-50/30 hover:border-indigo-200 hover:bg-indigo-50/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                role === 'candidate' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-400'
              }`}>
                <User size={24} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${role === 'candidate' ? 'text-indigo-900' : 'text-slate-700'}`}>I'm a Candidate</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Find amazing roles, track applications, and grow your career.</p>
              {role === 'candidate' && (
                <div className="absolute top-6 right-6 text-indigo-600">
                  <CheckCircle2 size={24} fill="currentColor" className="text-indigo-100" />
                </div>
              )}
            </button>

            <button 
              onClick={() => setRole('employer')}
              className={`p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                role === 'employer' 
                ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-500/10' 
                : 'border-slate-100 bg-slate-50/30 hover:border-indigo-200 hover:bg-indigo-50/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                role === 'employer' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-400'
              }`}>
                <Building2 size={24} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${role === 'employer' ? 'text-indigo-900' : 'text-slate-700'}`}>I'm an Employer</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Post opportunities, manage talent, and build your dream team.</p>
              {role === 'employer' && (
                <div className="absolute top-6 right-6 text-indigo-600">
                  <CheckCircle2 size={24} fill="currentColor" className="text-indigo-100" />
                </div>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center">
            <Button 
              size="lg" 
              onClick={handleRegister}
              disabled={!role || loading}
              className={`h-16 px-12 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 ${
                role ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Sign Up
              <ChevronRight size={20} />
            </Button>
            <p className="mt-8 text-sm text-slate-400">
              Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Log in</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
