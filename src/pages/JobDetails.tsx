import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Briefcase, Calendar, DollarSign, ChevronLeft, Share2, Bookmark, Send, ShieldCheck, Building2, Clock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Mock data fallback
          setJob({
            id: '1',
            title: 'SENIOR PRODUCT DESIGNER',
            companyName: 'LINEAR',
            location: 'Remote / San Francisco',
            type: 'FULL-TIME',
            salary: '$160,000 - $220,000',
            createdAt: null,
            description: `We are looking for a Senior Product Designer to join our core product team at Linear. Our mission is to build the world's best productivity tools. You'll be working at the intersection of design, engineering, and product strategy.

RESPONSIBILITIES
- Lead the design of complex features from initial concept to high-fidelity implementation.
- Maintain and expand our design system, focusing on precision and modularity.
- Work directly with founders and engineers to refine product workflows.
- Research and prototype new interaction models for productivity.

REQUIREMENTS
- 5+ years of experience designing digital products.
- Mastery of visual hierarchy, typography, and spacing.
- Strong technical background or experience working deeply with engineers.
- Passion for crafting tools that people use every day.`,
            benefits: ['Unlimited Vacation', 'Remote Work', 'Health & Dental', 'Stock Options', 'Learning Budget'],
            skills: ['Figma', 'Prototyping', 'Visual Design', 'Interaction Design']
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile?.role !== 'candidate') {
      alert("Only candidates can apply to jobs.");
      return;
    }

    setApplying(true);
    try {
      const employerId = job.employerId || 'mock_employer_id';
      
      // Fetch employer email
      let employerEmail = '';
      let employerName = job.companyName || job.company;
      
      try {
        const employerDoc = await getDoc(doc(db, 'users', employerId));
        if (employerDoc.exists()) {
          employerEmail = employerDoc.data().email;
          employerName = employerDoc.data().companyName || employerName;
        }
      } catch (err) {
        console.error("Failed to fetch employer email", err);
      }

      await addDoc(collection(db, 'applications'), {
        jobId: id,
        jobTitle: job.title,
        candidateId: user.uid,
        candidateName: profile?.name || user.displayName || user.email?.split('@')[0],
        candidateEmail: user.email,
        status: 'pending',
        appliedAt: serverTimestamp(),
        employerId: employerId
      });

      // Send notification if we have an email
      if (employerEmail) {
        try {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'NEW_APPLICATION',
              recipientEmail: employerEmail,
              details: {
                jobTitle: job.title,
                employerName: employerName
              }
            })
          });
        } catch (mailErr) {
          console.error("Notification failed", mailErr);
        }
      }

      alert("Application successfully submitted!");
    } catch (e) {
      console.error(e);
      alert("Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Position...</span>
      </div>
    </div>
  );

  if (!job) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-800">Job Not Found</h2>
      <Link to="/search">
        <Button variant="link" className="mt-4 text-blue-600 font-bold uppercase tracking-widest">Return to listings</Button>
      </Link>
    </div>
  );

  return (
    <div className="bg-[#F1F5F9] min-h-full">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center">
          <Link to="/search" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to listings
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                <div className="flex items-start gap-8">
                  <div className="w-24 h-24 rounded-sm bg-slate-900 flex items-center justify-center text-white text-3xl font-bold p-4 shrink-0 shadow-xl">
                    {(job.companyName || job.company || 'C')[0]}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none mb-4 uppercase">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500">
                      <span className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
                        <Building2 size={16} className="text-blue-600" /> {job.companyName || job.company}
                      </span>
                      <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium">
                        <MapPin size={16} className="text-blue-600" /> {job.location}
                      </span>
                      <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium">
                        <Clock size={16} className="text-blue-600" /> Posted Recently
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <section>
                  <div className="geometric-label mb-6">POSITION DESCRIPTION</div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                      {job.description}
                    </p>
                  </div>
                </section>

                {job.skills && job.skills.length > 0 && (
                  <section>
                    <div className="geometric-label mb-6">CORE COMPETENCIES</div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-widest border border-slate-200 rounded-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <section>
                    <div className="geometric-label mb-6">PERKS & BENEFITS</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.benefits.map((benefit: string) => (
                        <div key={benefit} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                          <div className="w-6 h-6 rounded-sm bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                            <ShieldCheck size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white p-8 rounded-sm border-2 border-blue-600 shadow-2xl sticky top-8">
              <div className="space-y-8 mb-10">
                <div>
                  <div className="geometric-label mb-4">COMPENSATION</div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tighter flex items-center gap-2">
                    <DollarSign size={28} className="text-blue-600" /> 
                    {job.salary}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 py-8 border-y border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workplace</span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{job.location.includes('Remote') ? 'Remote' : 'On-site'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-200 uppercase tracking-widest transition-all active:scale-95"
                >
                  <Send size={20} />
                  {user ? (applying ? 'SUBMITTING...' : 'APPLY TO POSITION') : 'LOGIN TO APPLY'}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-12 rounded-sm border-slate-200 uppercase text-[10px] tracking-widest font-bold">
                    <Bookmark size={16} className="mr-2" /> SAVE
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 rounded-sm border-slate-200 uppercase text-[10px] tracking-widest font-bold">
                    <Share2 size={16} className="mr-2" /> SHARE
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F172A] p-8 rounded-sm text-white overflow-hidden relative group border-t-4 border-blue-600">
              <h4 className="text-lg font-bold mb-4 uppercase tracking-tighter relative z-10">HIREHORIZON SECURE</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">
                This position has been verified by our platform security team. Your application data is encrypted and handled according to high-level privacy standards.
              </p>
              <div className="mt-6 flex items-center gap-2 relative z-10">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified Employer</span>
              </div>
              <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-blue-600/5 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
