import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, MapPin, Briefcase, Filter, X, ChevronRight, Star, Building2, MapPinned, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { db } from '../lib/firebase';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  category: string;
  createdAt: any;
  company?: string; // Support for mock data field names
  postedAt?: string;
}

export function SearchJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'), limit(50));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      
      if (jobsData.length === 0) {
        // Fallback mock data if DB is empty
        setJobs([
          { id: '1', title: 'Senior UI Designer', companyName: 'Linear', location: 'San Francisco, CA', type: 'Full-time', salary: '$140k - $180k', description: 'Core design role.', category: 'Design', createdAt: null },
          { id: '2', title: 'Lead UX Researcher', companyName: 'Airbnb', location: 'Remote', type: 'Full-time', salary: '$160k - $210k', description: 'User research lead.', category: 'Design', createdAt: null },
          { id: '3', title: 'Backend Engineer', companyName: 'Vercel', location: 'Remote', type: 'Contract', salary: '$150k - $200k', description: 'Cloud infrastructure.', category: 'Engineering', createdAt: null },
        ]);
      } else {
        setJobs(jobsData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const cName = job.companyName || job.company || '';
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = typeFilter === 'All' || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="flex flex-col h-full bg-[#F1F5F9]">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 p-8 shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Job title, company, or skills..." 
                className="pl-12 h-14 bg-slate-100 border-none rounded-sm text-base focus-visible:ring-2 focus-visible:ring-blue-500 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Location or remote..." 
                className="pl-12 h-14 bg-slate-100 border-none rounded-sm text-base focus-visible:ring-2 focus-visible:ring-blue-500 shadow-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200">
              SEARCH
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar - Desktop */}
        <aside className="w-80 border-r border-slate-200 bg-white p-8 overflow-y-auto hidden lg:block shrink-0">
          <div className="geometric-label mb-6">Filter By Type</div>
          <div className="space-y-2">
            {['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`w-full text-left px-4 py-3 rounded-sm text-sm font-bold transition-all border ${
                  typeFilter === type 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 border-transparent hover:border-slate-100'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-10 p-6 bg-[#0F172A] rounded-sm text-white relative overflow-hidden">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-60">Candidate Spotlight</h4>
            <p className="text-sm font-medium leading-relaxed mb-6">Verified members get 3x more interview callbacks. Upgrade your profile today.</p>
            <Link to="/profile">
              <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800 text-[10px] tracking-widest uppercase">
                Enhance Profile
              </Button>
            </Link>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter text-slate-800 uppercase">
                  {loading ? 'Finding Jobs...' : `${filteredJobs.length} Positions Available`}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="lg:hidden"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter size={18} />
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-white border border-slate-200 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={job.id}
                  >
                    <Link to={`/job/${job.id}`}>
                      <Card className="hover:border-blue-600 transition-all p-6 group">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-sm text-slate-800 font-bold text-2xl shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {(job.companyName || job.company || 'C')[0]}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                              {(!job.createdAt || new Date().getTime() - job.createdAt?.toMillis() < 86400000 * 2) && (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 uppercase tracking-widest border border-blue-100">Hot</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-sm font-medium">
                              <div className="flex items-center gap-1">
                                <Building2 size={14} className="text-slate-400" />
                                {job.companyName || job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-slate-400" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase size={14} className="text-slate-400" />
                                {job.type}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-start md:items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                            <div className="text-lg font-bold text-slate-800 tracking-tight">{job.salary}</div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-600">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <SearchIcon size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">No positions found</h3>
                <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                <Button 
                  variant="link" 
                  className="mt-4 text-blue-600 font-bold uppercase tracking-widest text-xs"
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                    setTypeFilter('All');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xs bg-white h-full p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-900">
                  <X size={24} />
                </button>
              </div>

              <div className="geometric-label mb-4">Job Type</div>
              <div className="space-y-2 mb-10">
                {['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all border ${
                      typeFilter === type 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                        : 'text-slate-500 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <Button 
                className="w-full h-14 bg-blue-600 text-white rounded-sm font-bold uppercase tracking-widest"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
