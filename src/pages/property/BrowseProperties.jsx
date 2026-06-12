import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Search, MapPin, Home, Maximize2, Filter, X, Phone, Mail, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const typeEmoji = { Apartment:'🏢', Villa:'🏡', Plot:'🌿', Commercial:'🏪', 'Farm House':'🌾', Penthouse:'🏙️' };
const typeColor = {
  Apartment:'tag-blue', Villa:'tag-green', Plot:'tag-amber',
  Commercial:'tag-indigo', 'Farm House':'tag-green', Penthouse:'tag-pink',
};

const Skeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-52 rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-8 w-1/3" />
    </div>
  </div>
);

const BrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selected, setSelected] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);

  const types = ['All','Apartment','Villa','Plot','Commercial','Farm House','Penthouse'];

  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try { setLoading(true); const { data } = await api.get('/api/property/properties'); setProperties(data||[]); }
    catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const filtered = properties.filter(p => {
    const s = `${p.location} ${p.property_type}`.toLowerCase().includes(search.toLowerCase());
    const t = !filterType || filterType==='All' || p.property_type===filterType;
    return s && t;
  });

  const open = (p) => { setSelected(p); setImgIdx(0); };

  return (
    <div className="min-h-screen dots-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search city, area, property type..."
                className="field pl-11 py-3 w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map(t=>(
                <button key={t} onClick={()=>setFilterType(t==='All'?'':t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    (t==='All'&&!filterType)||filterType===t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  }`}>
                  {typeEmoji[t]||'🏠'} {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Browse Properties</h1>
            <p className="text-gray-500 mt-1">{loading ? 'Loading...' : `${filtered.length} properties found`}</p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i)=><Skeleton key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p,i)=>(
              <div key={p.id||i} onClick={()=>open(p)}
                className="card card-glow cursor-pointer overflow-hidden group animate-slide-up"
                style={{animationDelay:`${i*0.06}s`}}>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {p.image_urls?.[0] ? (
                    <img src={p.image_urls[0]} alt={p.property_type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center"
                      style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                      <Home className="w-14 h-14 text-white/60" />
                      <span className="text-white/60 text-sm mt-2">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`tag ${typeColor[p.property_type]||'tag-indigo'}`}>
                      {typeEmoji[p.property_type]||'🏠'} {p.property_type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="price-tag text-sm">₹{parseInt(p.selling_price).toLocaleString()}</span>
                  </div>
                </div>
                {/* Body */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                    {p.property_type} in {p.location}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{p.location}</span>
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5"/>{p.area_size} sq.ft</span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{p.description}</p>
                  <button className="btn btn-primary w-full py-2.5 text-sm rounded-xl">
                    <Eye className="w-4 h-4"/> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:'rgba(15,12,41,.7)', backdropFilter:'blur(8px)'}}
          onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
            onClick={e=>e.stopPropagation()}>
            {/* Image Carousel */}
            {selected.image_urls?.length > 0 && (
              <div className="relative h-72 overflow-hidden rounded-t-3xl">
                <img src={selected.image_urls[imgIdx]} alt="Property"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {selected.image_urls.length > 1 && (
                  <>
                    <button onClick={()=>setImgIdx(i=>(i-1+selected.image_urls.length)%selected.image_urls.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-full flex items-center justify-center text-white">
                      <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <button onClick={()=>setImgIdx(i=>(i+1)%selected.image_urls.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 glass w-9 h-9 rounded-full flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5"/>
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {selected.image_urls.map((_,i)=>(
                        <button key={i} onClick={()=>setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i===imgIdx?'bg-white w-6':'bg-white/50'}`}/>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={()=>setSelected(null)}
                  className="absolute top-4 right-4 glass w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/30">
                  <X className="w-5 h-5"/>
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="price-tag">₹{parseInt(selected.selling_price).toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="p-7">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selected.property_type} in {selected.location}</h2>
                  <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-indigo-400"/>{selected.location}</span>
                    <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4 text-indigo-400"/>{selected.area_size} sq.ft</span>
                  </div>
                </div>
                {!selected.image_urls?.length && (
                  <button onClick={()=>setSelected(null)} className="btn btn-ghost py-2 px-3 rounded-xl"><X className="w-4 h-4"/></button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {label:'Type', value:selected.property_type, icon:'🏠'},
                  {label:'Area', value:`${selected.area_size} sq.ft`, icon:'📐'},
                  {label:'Status', value:'Available', icon:'✅'},
                ].map((s,i)=>(
                  <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-bold text-gray-900 text-sm">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>
              </div>

              {selected.video_urls?.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-bold text-gray-900 mb-3">Property Videos</h3>
                  {selected.video_urls.map((u,i)=>(
                    <video key={i} controls className="w-full rounded-2xl mb-2"><source src={u} type="video/mp4"/></video>
                  ))}
                </div>
              )}

              {/* Seller */}
              <div className="gradient-border p-5 mt-5 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500"/> Seller Contact
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-700"><span className="font-semibold">👤</span>{selected.seller_name}</p>
                  <p className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-indigo-500"/>{selected.seller_phone}</p>
                  <p className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-indigo-500"/>{selected.seller_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProperties;
