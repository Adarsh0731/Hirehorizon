import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Users, Eye, 
  CheckCircle, XCircle, 
  MapPin, Briefcase, 
  MoreVertical, Calendar,
  BarChart3, Settings
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function EmployerDashboard() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const jobsQ = query(collection(db, 'jobs'), where('employerId', '==', user.uid));
        const jobsSnap = await getDocs(jobsQ);
        const fetchedJobs = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(fetchedJobs);

        const appsQ = query(collection(db, 'applications'), where('employerId', '==', user.uid));
        const appsSnap = await getDocs(appsQ);
        const fetchedApps = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(fetchedApps);
        
        if (fetchedJobs.length === 0) {
           // Mock data if empty
           setJobs([
             { id: '1', title: 'Senior Brand Designer', location: 'London', type: 'Full-time', status: 'active', appliedCount: 12, views: 840 },
             { id: '2', title: 'Content Strategist', location: 'Remote', type: 'Contract', status: 'active', appliedCount: 5, views: 320 }
           ]);
           setApplications([
             { id: 'a1', jobId: '1', jobTitle: 'Senior Brand Designer', candidateName: 'Alex Rivera', status: 'pending', appliedAt: '2h ago', email: 'alex@example.com' },
             { id: 'a2', jobId: '1', jobTitle: 'Senior Brand Designer', candidateName: 'Sam Chen', status: 'shortlisted', appliedAt: '1d ago', email: 'sam@example.com' },
           ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const updateAppStatus = async (appId: string, status: string) => {
    try {
      if (appId.startsWith('a')) return; // skip mock
      const appRef = doc(db, 'applications', appId);
      await updateDoc(appRef, { status });
      
      const appData = applications.find(a => a.id === appId);
      if (appData && appData.candidateEmail) {
        try {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: status === 'shortlisted' ? 'APPLICATION_SHORTLISTED' : 'STATUS_UPDATE',
              recipientEmail: appData.candidateEmail,
              details: {
                candidateName: appData.candidateName,
                jobTitle: appData.jobTitle,
                companyName: profile?.companyName || 'the employer',
                newStatus: status
              }
            })
          });
        } catch (mailErr) {
          console.error("Notification failed", mailErr);
        }
      }

      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic font-serif">Employer Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage your active postings and candidate pipeline.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Plus size={20} />
            Post New Job
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none">+12%</Badge>
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tighter">{jobs.length}</div>
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Active Jobs</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none">+54%</Badge>
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tighter">{applications.length}</div>
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Applications</div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Eye size={20} />
                </div>
                <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none">+8%</Badge>
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tighter">1.2k</div>
              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Profile Views</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl border border-slate-200 inline-flex">
            <TabsTrigger value="jobs" className="rounded-xl px-8 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">Active Jobs</TabsTrigger>
            <TabsTrigger value="candidates" className="rounded-xl px-8 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">Candidates</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-8 py-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
             <div className="grid grid-cols-1 gap-4">
               {jobs.map(job => (
                 <motion.div 
                   key={job.id} 
                   whileHover={{ y: -2 }}
                   className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
                 >
                   <div className="flex items-center gap-6 flex-1">
                     <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2">
                       <Briefcase className="text-slate-400" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                       <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-1">
                         <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                         <span className="flex items-center gap-1"><Calendar size={12} /> Created 2 days ago</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-12 text-center">
                     <div>
                        <div className="text-lg font-bold text-slate-900">{job.appliedCount || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Applied</div>
                     </div>
                     <div>
                        <div className="text-lg font-bold text-slate-900">{job.views || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Views</div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <Button variant="outline" size="sm" className="rounded-xl">Edit</Button>
                     <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical size={16} /></Button>
                   </div>
                 </motion.div>
               ))}
             </div>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Candidate</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Position</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Applied At</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 italic font-serif">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-200">
                              {app.candidateName.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                               <div className="text-sm font-bold text-slate-900 not-italic font-sans">{app.candidateName}</div>
                               <div className="text-xs text-slate-400 not-italic font-sans">{app.candidateEmail || app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600 not-italic font-sans">{app.jobTitle}</td>
                        <td className="px-8 py-6 text-sm text-slate-400 not-italic font-sans">
                          {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : app.appliedAt}
                        </td>
                        <td className="px-8 py-6">
                           <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold not-italic font-sans ${
                             app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-600' : 
                             app.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                           }`}>
                             {app.status.toUpperCase()}
                           </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <Button 
                               onClick={() => updateAppStatus(app.id, 'shortlisted')}
                               disabled={app.status === 'shortlisted'}
                               size="sm" variant="outline" className="rounded-xl border-emerald-100 hover:bg-emerald-50 text-emerald-600 h-8 px-3"
                              >
                               <CheckCircle size={14} className="mr-1" /> Shortlist
                             </Button>
                             <Button 
                               onClick={() => updateAppStatus(app.id, 'rejected')}
                               disabled={app.status === 'rejected'}
                               size="sm" variant="outline" className="rounded-xl border-rose-100 hover:bg-rose-50 text-rose-600 h-8 px-3"
                             >
                               <XCircle size={14} className="mr-1" /> Reject
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
