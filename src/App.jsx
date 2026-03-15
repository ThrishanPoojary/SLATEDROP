import React, { useState, useEffect } from 'react';
import { 
  Github, ExternalLink, Mail, Phone, ChevronRight, Menu, X, 
  Cpu, Globe, Layers, Zap, ArrowRight, Send, Code2, CheckCircle2, Lock, Trash2
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// --- Firebase Configuration ---
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

// --- MAIN PORTFOLIO COMPONENT ---
function Portfolio() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

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
    <div className="min-h-screen bg-[#fafbff]">
       {/* (Keep all your existing Nav and Hero HTML here - omitted for brevity) */}
       <section id="contact" className="py-24 px-6">
         <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white text-center">
            <h2 className="text-4xl font-black mb-6">Let's build something epic.</h2>
            {formStatus === 'success' ? (
                <div className="py-10"><CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={50}/> <p>Sent!</p></div>
            ) : (
                <form className="space-y-4 max-w-md mx-auto" onSubmit={handleLaunchMessage}>
                    <input type="text" placeholder="Name" className="w-full p-4 rounded-xl bg-white/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <textarea placeholder="Message" className="w-full p-4 rounded-xl bg-white/10" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl">{formStatus === 'loading' ? 'Sending...' : 'Launch Message'}</button>
                </form>
            )}
         </div>
       </section>
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
    const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(msgs);
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    if(window.confirm("Delete this message?")) {
        await deleteDoc(doc(db, 'contacts', id));
        fetchMessages();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
            <Lock />
          </div>
          <h1 className="text-2xl font-black text-center mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl" onChange={(e) => setUser(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl" onChange={(e) => setPass(e.target.value)} />
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Enter Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">Message Dashboard</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-slate-500 font-bold">Logout</button>
        </div>

        {loading ? <p>Loading messages...</p> : (
          <div className="grid gap-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-indigo-600 mb-1">{m.name}</h3>
                  <p className="text-slate-700">{m.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {m.timestamp?.toDate().toLocaleString()}
                  </span>
                </div>
                <button onClick={() => deleteMessage(m.id)} className="text-slate-300 hover:text-red-500 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {messages.length === 0 && <p className="text-center py-20 text-slate-400">No messages yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// --- APP ROUTING ---
export default function App() {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
