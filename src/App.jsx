import React, { useState, useEffect } from 'react';
import { 
  Github, ExternalLink, Mail, Phone, ChevronRight, Menu, X, 
  Cpu, Globe, Layers, Zap, ArrowRight, Send, Code2, CheckCircle2, Lock, Trash2
} from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// --- Firebase Configuration (Your Real Keys) ---
const firebaseConfig = {
  apiKey: "AIzaSyB4JHbNefMogVYr8fOatfY9ItP3kvWin50",
  authDomain: "pratheekenterprises-fdc41.firebaseapp.com",
  projectId: "pratheekenterprises-fdc41",
  storageBucket: "pratheekenterprises-fdc41.firebasestorage.app",
  messagingSenderId: "152349229052",
  appId: "1:152349229052:web:923a9498085f0d666cfc79",
  measurementId: "G-F3YQ5S1B9D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- MAIN PORTFOLIO COMPONENT ---
function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      console.error(error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 font-sans selection:bg-indigo-100">
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Code2 size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Thrishan.</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#home" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Home</a>
            <a href="#contact" className="px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg">Let's Talk</a>
          </div>
        </div>
      </nav>

      <section id="home" className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} /> Available for projects
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Designing the <span className="text-indigo-600">future</span> through code.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
              I'm Thrishan Poojary, an Engineering Student at MITE crafting digital experiences that balance aesthetics with high-performance functionality.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-black mb-6">Let's build something epic.</h2>
          {formStatus === 'success' ? (
            <div className="py-10 animate-bounce">
              <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={50}/> 
              <p className="text-xl font-bold">Message Launched!</p>
            </div>
          ) : (
            <form className="space-y-4 max-w-md mx-auto" onSubmit={handleLaunchMessage}>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-4 rounded-xl bg-white/10 border border-white/5 focus:border-indigo-500 outline-none transition-all" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required
              />
              <textarea 
                placeholder="What project do you have in mind?" 
                className="w-full p-4 rounded-xl bg-white/10 border border-white/5 focus:border-indigo-500 outline-none transition-all" 
                rows="4" 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
              <button 
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? 'Transmitting...' : 'Launch Message'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Thrishan Poojary • Crafted by Pratheek Designs
      </footer>
    </div>
  );
}

// --- ADMIN PAGE COMPONENT ---
function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.toUpperCase() === 'THRISHAN' && pass.toUpperCase() === 'THRISHAN') {
      setIsLoggedIn(true);
      fetchMessages();
    } else {
      alert("Invalid Credentials");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    if(window.confirm("Delete this entry?")) {
      await deleteDoc(doc(db, 'contacts', id));
      fetchMessages();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg shadow-indigo-100">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-black mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" onChange={(e) => setUser(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" onChange={(e) => setPass(e.target.value)} />
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Authorize</button>
          </form>
          <Link to="/" className="inline-block mt-8 text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest">← Return to site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Inbox</h1>
            <p className="text-slate-500 font-medium">Monitoring all portfolio transmissions</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">TERMINATE SESSION</button>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-400 font-bold uppercase text-xs tracking-widest">Accessing Database...</div>
        ) : (
          <div className="grid gap-6">
            {messages.map((m) => (
              <div key={m.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-start group hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {m.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-none mb-1">{m.name}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {m.timestamp?.toDate().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">{m.message}</p>
                </div>
                <button onClick={() => deleteMessage(m.id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {messages.length === 0 && <p className="text-center py-20 text-slate-300 font-bold uppercase text-xs tracking-[0.3em]">No signals received</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// --- APP ROUTING ---
export default function App() {
  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error(err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
