import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, Mail, FileText, Camera, Save, CheckCircle, Building2, MapPin, Phone, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function Profile() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: 'candidate',
    companyName: '',
    skills: '',
    resumeUrl: '',
    education: '',
    graduationYear: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        role: profile.role || 'candidate',
        companyName: profile.companyName || '',
        skills: profile.skills?.join(', ') || '',
        resumeUrl: profile.resumeUrl || '',
        education: profile.education || '',
        graduationYear: profile.graduationYear || '',
        phone: profile.phone || '',
        location: profile.location || ''
      });
    } else if (user) {
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const updatedProfile = {
        ...formData,
        uid: user.uid,
        email: user.email,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setFormData(prev => ({ ...prev, resumeUrl: url }));
      
      // Optionally update profile immediately
      await setDoc(doc(db, 'users', user.uid), { resumeUrl: url }, { merge: true });
      
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload resume. Please check your storage bucket permissions.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
           <h1 className="text-4xl font-bold text-slate-900 tracking-tight italic font-serif">Account Profile</h1>
           <p className="text-slate-500 mt-2">Manage your student profile and professional details.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
           <Card className="rounded-[2.5rem] border-slate-200 shadow-sm overflow-hidden bg-white">
             <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-10 py-8">
               <div className="flex items-center gap-6">
                 <div className="relative group">
                   <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-600/20 overflow-hidden border-4 border-white">
                     {user?.photoURL ? (
                       <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       formData.name ? formData.name[0] : <User size={40} />
                     )}
                   </div>
                   <button type="button" className="absolute bottom-0 right-0 bg-white p-2 rounded-xl shadow-md border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                     <Camera size={16} />
                   </button>
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900">{formData.name || 'Your Name'}</h2>
                   <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mt-1">
                     <Mail size={14} /> {user?.email}
                   </div>
                 </div>
               </div>
             </CardHeader>
             
             <CardContent className="p-10 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Full Name</Label>
                   <Input 
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                    />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Account Role</Label>
                   <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
                     <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, role: 'candidate' }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.role === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       <User size={14} className="inline mr-2" /> Candidate
                     </button>
                     <button 
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, role: 'employer' }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.role === 'employer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                       <Building2 size={14} className="inline mr-2" /> Employer
                     </button>
                   </div>
                 </div>
               </div>

               {formData.role === 'employer' && (
                 <div className="space-y-2">
                    <Label htmlFor="company" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Company Name</Label>
                    <Input 
                      id="company"
                      value={formData.companyName}
                      onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                      placeholder="e.g. Acme Corp"
                    />
                 </div>
               )}

               <div className="space-y-2">
                 <Label htmlFor="bio" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Bio / About</Label>
                 <Textarea 
                   id="bio"
                   value={formData.bio}
                   onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                   className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none py-4 px-5"
                   placeholder="Tell us about yourself or your company..."
                 />
               </div>

               {formData.role === 'candidate' && (
                 <div className="space-y-6 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <GraduationCap size={16} /> Academic Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="education" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">University / College</Label>
                        <Input 
                          id="education"
                          value={formData.education}
                          onChange={e => setFormData(p => ({ ...p, education: e.target.value }))}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                          placeholder="e.g. Stanford University"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Graduation Year</Label>
                        <Input 
                          id="graduationYear"
                          value={formData.graduationYear}
                          onChange={e => setFormData(p => ({ ...p, graduationYear: e.target.value }))}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                          placeholder="e.g. 2025"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Phone Number</Label>
                        <Input 
                          id="phone"
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Current Location</Label>
                        <Input 
                          id="location"
                          value={formData.location}
                          onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Skills (Comma separated)</Label>
                      <Input 
                         id="skills"
                         value={formData.skills}
                         onChange={e => setFormData(p => ({ ...p, skills: e.target.value }))}
                         className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                         placeholder="React, TypeScript, UI/UX..."
                       />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pl-1">Resume Portfolio Link</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <Input 
                            id="resume"
                            value={formData.resumeUrl}
                            onChange={e => setFormData(p => ({ ...p, resumeUrl: e.target.value }))}
                            className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none"
                            placeholder="https://your-portfolio-or-resume.com"
                          />
                          <div className="h-12 px-5 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500">
                            <FileText size={18} />
                          </div>
                        </div>

                        <div className="relative">
                          <input 
                            type="file" 
                            id="resume-upload" 
                            className="hidden" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            disabled={uploading}
                          />
                          <label 
                            htmlFor="resume-upload"
                            className={`w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                              uploading ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-indigo-50/30 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50'
                            }`}
                          >
                            <FileText className={`text-indigo-600 ${uploading ? 'animate-pulse' : ''}`} size={24} />
                            <span className="text-xs font-bold text-indigo-600">
                              {uploading ? 'Uploading...' : 'Quick Upload PDF/Word (Max 5MB)'}
                            </span>
                          </label>
                        </div>

                        {formData.resumeUrl && formData.resumeUrl.startsWith('http') && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="text-emerald-500" size={18} />
                              <span className="text-xs font-medium text-emerald-700">Resume connected successfully</span>
                            </div>
                            <a 
                              href={formData.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-emerald-600 hover:underline"
                            >
                              VIEW CURRENT
                            </a>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 pl-1 italic">Make sure your resume is accessible to employers.</p>
                    </div>
                 </div>
               )}
             </CardContent>
           </Card>

           <div className="flex justify-end gap-3 pb-12">
             <Button 
                type="submit" 
                disabled={loading}
                className={`h-14 px-10 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                  saved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
                }`}
             >
               {saved ? <CheckCircle size={20} /> : <Save size={20} />}
               {loading ? 'Saving...' : (saved ? 'Profile Saved' : 'Save Details')}
             </Button>
           </div>
        </form>
      </div>
    </div>
  );
}
