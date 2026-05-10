import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, MapPin, 
  Clock, CheckCircle, 
  XCircle, Filter, 
  Search, ChevronRight,
  TrendingUp, Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'applications'), where('candidateId', '==', user.uid));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetched.length === 0) {
          // Mock data
          setApplications([
            { id: '1', jobTitle: 'Product Designer', company: 'Figma', location: 'Remote', status: 'shortlisted', appliedAt: '2 days ago' },
            { id: '2', jobTitle: 'Staff Engineer', company: 'Stripe', location: 'Dublin', status: 'pending', appliedAt: '5 days ago' },
            { id: '3', jobTitle: 'Design Lead', company: 'Metalab', location: 'Vancouver', status: 'rejected', appliedAt: '1 week ago' },
          ]);
        } else {
          setApplications(fetched);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
  };

  return (
    <div className="bg-slate-50/50 min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic font-serif">My Applications</h1>
          <p className="text-slate-500 mt-2">Track your application status across all your saved opportunities.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
             <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sent</div>
               <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
               <Briefcase size={22} />
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
             <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending</div>
               <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
               <Clock size={22} />
             </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
             <div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shortlisted</div>
               <div className="text-3xl font-bold text-slate-900 text-emerald-600">{stats.shortlisted}</div>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
               <CheckCircle size={22} />
             </div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Applications</h3>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-500"><Filter size={14} className="mr-1" /> Filter</Button>
            </div>
          </div>

          {applications.map((app, i) => (
            <motion.div 
              key={app.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-2 pl-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6 flex-1 py-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 italic font-serif text-slate-400">
                  {app.company[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{app.jobTitle}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-0.5">
                    <span className="text-slate-900">{app.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {app.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Applied {app.appliedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pr-4">
                <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider ${
                  app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  'bg-slate-50 text-slate-400 border border-slate-100'
                }`}>
                  {app.status === 'shortlisted' && <CheckCircle size={14} />}
                  {app.status === 'rejected' && <XCircle size={14} />}
                  {app.status === 'pending' && <Clock size={14} />}
                  {app.status}
                </div>
                <Link to={`/job/${app.jobId}`}>
                   <Button variant="ghost" size="icon" className="text-slate-300 group-hover:text-slate-900 transition-colors">
                     <ChevronRight size={20} />
                   </Button>
                </Link>
              </div>
            </motion.div>
          ))}

          {applications.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 italic font-serif">No applications yet</h3>
               <p className="text-slate-500 mt-2 max-w-xs mx-auto">Start your journey today by exploring the latest openings in your field.</p>
               <Link to="/search">
                 <Button className="mt-8 bg-indigo-600 rounded-xl">Explore Jobs</Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
