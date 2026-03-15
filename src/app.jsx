import React, { useState, useEffect } from 'react';
import { 
  Github, ExternalLink, Mail, Phone, ChevronRight, Menu, X, 
  Cpu, Globe, Layers, Zap, ArrowRight, Send, Code2, CheckCircle2 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Firebase Configuration ---
// REPLACE the placeholders below with your actual keys from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth failed", err));
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLaunchMessage = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setFormStatus('loading');
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        message: formData.message,
        timestamp: serverTimestamp()
      });
      setFormStatus('success');
      setFormData({ name: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Code2 size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter">THRISHAN.</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#home" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Home</a>
            <a href="#about" className="text-sm font-semibold hover:text-indigo-600 transition-colors">About</a>
            <a href="#projects" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Work</a>
            <a href="#contact" className="px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all">Let's Talk</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className
