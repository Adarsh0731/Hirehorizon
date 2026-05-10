import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Search, MapPin, Briefcase, Zap, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, `users/${user.uid}/savedJobs`));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetched.length === 0) {
           setSavedJobs([
             { id: '1', title: 'User Experience Researcher', company: 'Maze', location: 'Remote', type: 'Full-time', salary: '$140k' },
             { id: '2', title: 'Frontend Developer', company: 'Vercel', location: 'Remote', type: 'Full-time', salary: '$180k' },
           ]);
        } else {
           setSavedJobs(fetched);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  const removeSaved = async (jobId: string) => {
    try {
      if (!jobId.startsWith('j')) return; // skip mock
      await deleteDoc(doc(db, `users/${user!.uid}/savedJobs`, jobId));
      setSavedJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-4 uppercase tracking-widest">
            <Bookmark size={12} fill="currentColor" /> My Bookmarks
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic font-serif">Saved Opportunities</h1>
          <p className="text-slate-500 mt-2">Quickly access the positions you've bookmarked for later.</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((job) => (
            <motion.div 
              key={job.id} 
              className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 text-slate-400 font-serif font-bold">
                  {job.company[0]}
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                   <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-1">
                     <span className="text-slate-900">{job.company}</span>
                     <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                     <span className="flex items-center gap-1 text-emerald-600"><Zap size={12} fill="currentColor" /> {job.salary}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Link to={`/job/${job.id}`}>
                   <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                     View Position <ArrowRight size={14} className="ml-2" />
                   </Button>
                 </Link>
                 <Button 
                   onClick={() => removeSaved(job.id)}
                   variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                 >
                   <Trash2 size={18} />
                 </Button>
              </div>
            </motion.div>
          ))}

          {savedJobs.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <Bookmark size={40} className="mx-auto text-slate-200 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 italic font-serif">Your list is empty</h3>
               <p className="text-slate-500 mt-2">Browse jobs and click the bookmark icon to save them here.</p>
               <Link to="/search">
                 <Button className="mt-8 bg-indigo-600 rounded-xl">Search Jobs</Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
