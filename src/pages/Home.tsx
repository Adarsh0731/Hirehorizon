import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, TrendingUp, Building2, Users2, Zap, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative py-20 px-8 overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Zap size={12} fill="currentColor" />
              Direct access to top companies
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.9] mb-8 uppercase">
              Next-Gen <span className="text-blue-600">Career</span> Hub.
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-md border-l-4 border-blue-600 pl-6 py-2">
              The definitive platform for high-performance teams and the world's most ambitious talent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/search">
                <Button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-sm font-bold shadow-xl shadow-blue-600/20 tracking-widest transition-all hover:-translate-y-1">
                  FIND JOBS
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="h-14 px-10 rounded-sm text-sm font-bold border-slate-200 tracking-widest hover:bg-slate-50">
                  POST A JOB
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="w-full aspect-[4/3] bg-slate-900 rounded-sm border-8 border-white shadow-2xl relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Workspace" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
              
              <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                Employer Spotlight
              </div>
            </div>
            
            {/* Geometric accents */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/10 -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-blue-600/20 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs preview */}
      <section className="py-20 px-8 bg-[#F1F5F9]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="geometric-label mb-2">Marketplace</div>
              <h2 className="text-3xl font-bold tracking-tighter text-slate-800 uppercase">Recommended Openings</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all">Full-time</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all">Remote</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              { title: 'Senior UI Designer', company: 'Linear', location: 'San Francisco, CA', salary: '$140k - $180k', color: 'bg-orange-100 text-orange-600' },
              { title: 'Lead UX Researcher', company: 'Airbnb', location: 'Remote', salary: '$160k - $210k', color: 'bg-pink-100 text-pink-600' },
              { title: 'Backend Engineer', company: 'Vercel', location: 'Remote', salary: '$150k - $200k', color: 'bg-blue-100 text-blue-600' },
              { title: 'Product Manager', company: 'Stripe', location: 'Dublin, IE', salary: '$130k - $170k', color: 'bg-purple-100 text-purple-600' },
            ].map((job, i) => (
              <Card key={i} className="group hover:border-blue-600 transition-all p-6 bg-white overflow-hidden relative">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 ${job.color} flex items-center justify-center rounded-sm font-bold text-xl`}>
                    {job.company[0]}
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 uppercase tracking-widest">New</span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{job.company} • {job.location}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-800 tracking-tight">{job.salary}</span>
                  <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-1">
                    Save <Star size={12} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Design Theme pattern */}
      <section className="py-20 px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 bg-[#0F172A] p-8 rounded-sm text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold opacity-60 uppercase tracking-[0.2em] mb-8">Platform Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border border-slate-800 bg-slate-800/50">
                  <div className="text-3xl font-bold text-white">50k</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applied</div>
                </div>
                <div className="text-center p-4 border border-slate-800 bg-slate-800/50">
                  <div className="text-3xl font-bold text-blue-400">12k</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Views</div>
                </div>
                <div className="text-center p-4 border border-slate-800 bg-slate-800/50">
                  <div className="text-3xl font-bold text-green-400">08k</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hires</div>
                </div>
                <div className="text-center p-4 border border-slate-800 bg-slate-800/50">
                  <div className="text-3xl font-bold text-orange-400">03k</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interviews</div>
                </div>
              </div>
              <button className="w-full mt-8 py-3 border border-slate-700 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-slate-800 transition-colors">
                View Global Analytics
              </button>
            </div>
            {/* Background geometric flare */}
            <div className="absolute top-1/2 -right-20 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none" />
          </div>
          
          <div className="md:col-span-8 space-y-8">
            <div className="geometric-label">Application Tracking</div>
            <h2 className="text-4xl font-bold tracking-tighter text-slate-800 uppercase">Seamless flow from<br />application to offer.</h2>
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center space-x-6">
                <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Interview</div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} transition={{ duration: 1 }} className="h-full bg-blue-600"></motion.div>
                </div>
                <div className="text-sm font-bold text-slate-800 text-right w-12">75%</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Shortlist</div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '50%' }} transition={{ duration: 1, delay: 0.1 }} className="h-full bg-blue-500 opacity-60"></motion.div>
                </div>
                <div className="text-sm font-bold text-slate-800 text-right w-12">50%</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Applied</div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '90%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-slate-300"></motion.div>
                </div>
                <div className="text-sm font-bold text-slate-800 text-right w-12">90%</div>
              </div>
            </div>
            <p className="text-slate-500 font-medium max-w-md">Our intelligence engine tracks every touchpoint, giving you real-time visibility into your hiring pipeline or job search progress.</p>
          </div>
        </div>
      </section>

      {/* Quick Search Divider */}
      <section className="py-12 px-8 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold uppercase tracking-tighter mb-1">Ready to step into the future?</h3>
            <p className="opacity-80 text-sm font-medium">Create your profile and start applying to verified high-growth companies.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/search">
              <Button className="bg-white text-blue-600 hover:bg-slate-50 rounded-sm font-bold px-8 uppercase tracking-widest h-12 shadow-2xl">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
