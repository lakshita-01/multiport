import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, X, MapPin, Briefcase, GraduationCap, User, RefreshCw, ChevronRight } from 'lucide-react';

const calcAge = dob => {
  const t=new Date(), b=new Date(dob);
  let a=t.getFullYear()-b.getFullYear();
  if(t.getMonth()<b.getMonth()||(t.getMonth()===b.getMonth()&&t.getDate()<b.getDate())) a--;
  return a;
};

const BrowseProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipe, setSwipe] = useState(null); // 'left' | 'right'
  const [liked, setLiked] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef(null);

  useEffect(() => { if(user) fetchProfiles(); }, [user]);

  const fetchProfiles = async () => {
    try { setLoading(true); const{data}=await api.get('/api/matrimonial/profiles'); setProfiles(data||[]); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };

  const handleSwipe = async dir => {
    if(idx>=profiles.length) return;
    setSwipe(dir);
    if(dir==='right'){
      setLiked(true);
      setTimeout(()=>setLiked(false),1500);
      try { await api.post('/api/matrimonial/choices',{liked_profile_id:profiles[idx].id||profiles[idx]._id}); }
      catch(e){console.error(e);}
    }
    setTimeout(()=>{ setIdx(i=>i+1); setSwipe(null); setDragX(0); },350);
  };

  // Drag support
  const onMouseDown = e => { dragStart.current=e.clientX; };
  const onMouseMove = e => { if(dragStart.current!==null) setDragX(e.clientX-dragStart.current); };
  const onMouseUp = () => {
    if(dragStart.current===null) return;
    if(dragX>80) handleSwipe('right');
    else if(dragX<-80) handleSwipe('left');
    else setDragX(0);
    dragStart.current=null;
  };

  if(loading) return (
    <div className="min-h-screen dots-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-600 font-medium">Loading profiles...</p>
      </div>
    </div>
  );

  if(profiles.length===0) return (
    <div className="min-h-screen dots-bg flex items-center justify-center px-4">
      <div className="card p-12 text-center max-w-md w-full animate-scale-in">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No Profiles Yet</h2>
        <p className="text-gray-500">Check back soon — new profiles are added daily!</p>
      </div>
    </div>
  );

  if(idx>=profiles.length) return (
    <div className="min-h-screen dots-bg flex items-center justify-center px-4">
      <div className="card p-12 text-center max-w-md w-full animate-bounce-in">
        <div className="text-6xl mb-4 animate-heartbeat">💝</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">You've seen everyone!</h2>
        <p className="text-gray-500 mb-6">Want to browse again from the start?</p>
        <button onClick={()=>{setIdx(0);fetchProfiles();}} className="btn btn-pink w-full py-3 rounded-xl">
          <RefreshCw className="w-4 h-4"/>Start Over
        </button>
      </div>
    </div>
  );

  const p = profiles[idx];
  const rotation = (dragX/20);
  const opacity = Math.max(0, 1 - Math.abs(dragX)/300);

  return (
    <div className="min-h-screen dots-bg pb-16" style={{background:'linear-gradient(135deg,#fff0f6 0%,#fdf2f8 50%,#f8fafc 100%)'}}>
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-4">
        <h1 className="text-3xl font-black text-gray-900 mb-1">Find Your Match 💍</h1>
        <p className="text-gray-500">Profile {idx+1} of {profiles.length}</p>
        {/* Progress bar */}
        <div className="max-w-xs mx-auto mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
            style={{width:`${((idx+1)/profiles.length)*100}%`}}/>
        </div>
      </div>

      {/* Liked notification */}
      {liked && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white"/>Added to My Choices!
          </div>
        </div>
      )}

      {/* Card stack */}
      <div className="relative flex justify-center px-4">
        {/* Background card peek */}
        {profiles[idx+1] && (
          <div className="absolute top-2 w-full max-w-sm rounded-3xl overflow-hidden shadow-lg opacity-40 scale-95 pointer-events-none"
            style={{maxWidth:'360px'}}>
            <div className="h-[480px] bg-gradient-to-br from-pink-200 to-rose-200"/>
          </div>
        )}

        {/* Main card */}
        <div
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
          style={{
            maxWidth:'360px', height:'520px',
            transform: swipe==='left' ? 'translateX(-120%) rotate(-20deg)' :
                       swipe==='right' ? 'translateX(120%) rotate(20deg)' :
                       `translateX(${dragX}px) rotate(${rotation}deg)`,
            opacity: swipe ? 0 : opacity,
            transition: swipe ? 'transform .35s ease, opacity .35s ease' : dragStart.current ? 'none' : 'transform .2s ease',
          }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>

          {/* Like / Nope overlays */}
          {dragX>30 && <div className="absolute top-8 left-6 z-20 rotate-[-20deg] border-4 border-green-400 text-green-400 text-2xl font-black px-4 py-2 rounded-2xl">LIKE ❤️</div>}
          {dragX<-30 && <div className="absolute top-8 right-6 z-20 rotate-[20deg] border-4 border-red-400 text-red-400 text-2xl font-black px-4 py-2 rounded-2xl">NOPE ✕</div>}

          {/* Image */}
          <div className="relative h-3/5">
            {p.profile_image_url ? (
              <img src={p.profile_image_url} alt={p.full_name} className="w-full h-full object-cover pointer-events-none"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{background:`linear-gradient(135deg,#${Math.floor(Math.random()*0x555555+0x888888).toString(16)},#ec4899)`}}>
                <User className="w-24 h-24 text-white/60"/>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-2xl font-black text-white">{p.full_name}</h2>
              <p className="text-white/80 text-sm">{calcAge(p.date_of_birth)} yrs • {p.gender}</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white h-2/5 p-5 space-y-2.5 overflow-hidden">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0"/>
              <span className="truncate">{p.city}, {p.state}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-pink-400 flex-shrink-0"/>
              <span className="truncate">{p.education}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-pink-400 flex-shrink-0"/>
              <span className="truncate">{p.occupation}</span>
            </div>
            {p.religion && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="tag tag-pink">{p.religion}</span>
                {p.height && <span className="tag tag-indigo">{p.height}</span>}
                {p.annual_income && <span className="tag tag-green">{p.annual_income}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button onClick={()=>handleSwipe('left')} disabled={!!swipe}
          className="w-16 h-16 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-2 border-red-100 hover:border-red-300 group">
          <X className="w-8 h-8 text-red-400 group-hover:text-red-500"/>
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">Drag or tap</p>
        </div>
        <button onClick={()=>handleSwipe('right')} disabled={!!swipe}
          className="w-16 h-16 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 border-2 border-pink-100 hover:border-pink-300 group animate-pulse-glow">
          <Heart className="w-8 h-8 text-pink-400 group-hover:text-pink-500 group-hover:fill-pink-400"/>
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-400">
        ← Swipe left to skip &nbsp;|&nbsp; Swipe right to like ❤️ →
      </div>
    </div>
  );
};

export default BrowseProfiles;
