import React, { useState, useEffect, useRef, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import html2pdf from 'html2pdf.js';
import { Camera, Loader, Pencil, Download, Trash } from 'lucide-react';
import { supabase } from './supabase';
import './index.css';

const coverFriends = ["twinsriram", "yaazhini", "Shivaani", "Ishwarya", "Mofi", "Divya", "Selin", "Shaalini", "Sandhiya G", "Sanjana", "Nivetha", "Subathra", "Sriee Mathanghi", "Yuva Shankari", "Vishnupriya", "Santhiya K", "Hemalatha"];

const getUnevenStyle = (i) => {
  const rotation = (i * 13) % 24 - 12; // -12 to +12 degrees
  const xOffset = (i * 29) % 40 - 20;  // -20px to +20px
  const yOffset = (i * 17) % 30 - 15;  // -15px to +15px
  const scale = 0.9 + ((i * 7) % 40) / 100; // 0.9 to 1.3
  
  return {
    fontFamily: 'Dancing Script', 
    fontSize: '1.4rem', 
    color: '#FFF0F5', 
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
    transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
    display: 'inline-block',
    margin: '5px'
  };
};

const CoverFrame = ({ colorTheme = 'white' }) => {
  const isPink = colorTheme === 'pink';
  const cMain = isPink ? '#FF1493' : 'rgba(255,255,255,0.8)';
  const cBorder1 = isPink ? 'rgba(255,20,147,0.6)' : 'rgba(255,255,255,0.6)';
  const cBorder2 = isPink ? 'rgba(255,20,147,0.3)' : 'rgba(255,255,255,0.3)';
  const cLeaf = isPink ? 'rgba(255,20,147,0.4)' : 'rgba(255,255,255,0.6)';

  const sprinkles = [];
  if (!isPink) {
    for (let i = 0; i < 70; i++) {
      let x = ((i * 37) % 390) + 30; 
      let y = ((i * 101) % 540) + 30;
      
      if (x > 80 && x < 370 && y > 100 && y < 500) {
        if (i % 2 === 0) x = (x % 50) + 30;
        else if (i % 3 === 0) y = (y % 50) + 30;
        else x = (x % 50) + 370;
      }

      const size = ((i * 11) % 3) + 1.5; 
      const opacity = ((i * 13) % 40 + 30) / 100;
      
      if (i % 4 === 0) sprinkles.push(<polygon key={`s${i}`} points={`${x},${y-size*2} ${x+size/1.5},${y-size/1.5} ${x+size*2},${y} ${x+size/1.5},${y+size/1.5} ${x},${y+size*2} ${x-size/1.5},${y+size/1.5} ${x-size*2},${y} ${x-size/1.5},${y-size/1.5}`} fill="white" style={{ opacity }} />);
      else sprinkles.push(<circle key={`s${i}`} cx={x} cy={y} r={size/1.5} fill="white" style={{ opacity }} />);
    }
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 450 600" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}>
      {sprinkles}
      <rect x="20" y="20" width="410" height="560" fill="none" stroke={cBorder1} strokeWidth="1.5" />
      <rect x="28" y="28" width="394" height="544" fill="none" stroke={cBorder2} strokeWidth="1" />
      
      {/* Top Left */}
      <g stroke={cMain} fill="none" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20,75 Q40,55 75,20" />
        <path d="M20,115 Q60,75 115,20" />
        <path d="M30,55 Q35,45 30,35 Q20,40 20,45 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M55,30 Q45,35 35,30 Q40,20 45,20 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M40,85 Q45,75 40,65 Q30,70 30,75 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M85,40 Q75,45 65,40 Q70,30 75,30 Z" fill={cLeaf} strokeWidth="0.5" />
      </g>
      
      {/* Top Right */}
      <g transform="translate(450, 0) scale(-1, 1)" stroke={cMain} fill="none" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20,75 Q40,55 75,20" />
        <path d="M20,115 Q60,75 115,20" />
        <path d="M30,55 Q35,45 30,35 Q20,40 20,45 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M55,30 Q45,35 35,30 Q40,20 45,20 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M40,85 Q45,75 40,65 Q30,70 30,75 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M85,40 Q75,45 65,40 Q70,30 75,30 Z" fill={cLeaf} strokeWidth="0.5" />
      </g>
  
      {/* Bottom Left */}
      <g transform="translate(0, 600) scale(1, -1)" stroke={cMain} fill="none" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20,75 Q40,55 75,20" />
        <path d="M20,115 Q60,75 115,20" />
        <path d="M30,55 Q35,45 30,35 Q20,40 20,45 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M55,30 Q45,35 35,30 Q40,20 45,20 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M40,85 Q45,75 40,65 Q30,70 30,75 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M85,40 Q75,45 65,40 Q70,30 75,30 Z" fill={cLeaf} strokeWidth="0.5" />
      </g>
  
      {/* Bottom Right */}
      <g transform="translate(450, 600) scale(-1, -1)" stroke={cMain} fill="none" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20,75 Q40,55 75,20" />
        <path d="M20,115 Q60,75 115,20" />
        <path d="M30,55 Q35,45 30,35 Q20,40 20,45 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M55,30 Q45,35 35,30 Q40,20 45,20 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M40,85 Q45,75 40,65 Q30,70 30,75 Z" fill={cLeaf} strokeWidth="0.5" />
        <path d="M85,40 Q75,45 65,40 Q70,30 75,30 Z" fill={cLeaf} strokeWidth="0.5" />
      </g>
    </svg>
  );
};

const Page = forwardRef((props, ref) => {
  return (
    <div 
      className={`page ${props.className || ''}`} 
      ref={ref} 
      onDragOver={(e) => e.preventDefault()}
      onDrop={props.onDrop}
    >
      {props.children}
      
      {props.showTree && (
        <img 
          src="/apple_tree.png" 
          alt="Apple Tree" 
          style={{ position: 'absolute', right: '15px', bottom: '60px', width: '130px', height: 'auto', opacity: 0.8, pointerEvents: 'none', zIndex: 1, mixBlendMode: 'multiply' }} 
        />
      )}

      {/* Placed Stickers for this page */}
      {props.stickers && props.stickers.map(sticker => (
        <div key={sticker.id} style={{
          position: 'absolute', left: sticker.x, top: sticker.y, 
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto', zIndex: 50,
          opacity: props.draggingId === sticker.id ? 0.3 : 1
        }}
        className="placed-sticker"
        draggable={true}
        onDragStart={(e) => {
          if (props.onStickerDragStart) props.onStickerDragStart(e, sticker);
        }}
        onDragEnd={() => {
          if (props.onStickerDragEnd) props.onStickerDragEnd();
        }}
        >
          <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', cursor: 'grab', userSelect: 'none' }}>
            {sticker.type === 'image' ? (
              <img src={sticker.content} style={{ width: '80px', height: '80px', objectFit: 'contain', pointerEvents: 'none' }} alt="sticker" draggable={false} />
            ) : (
              sticker.content || sticker
            )}
          </span>
          <button 
            className="sticker-delete-btn"
            onClick={(e) => { e.stopPropagation(); if(props.onStickerDelete) props.onStickerDelete(sticker.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            title="Remove Sticker"
          >
            ×
          </button>
        </div>
      ))}
      {props.number !== undefined && (
        <div className={`page-number ${props.number % 2 === 0 ? 'left' : 'right'}`}>
          {props.number > 0 ? props.number : ''}
        </div>
      )}
    </div>
  );
});

function WriteMemoryForm({ onSave, initialData, onCancel }) {
  const [previewImage, setPreviewImage] = useState(initialData?.imageUrl || null);
  const [saving, setSaving] = useState(false);

  const stopEventAndFocus = (e) => {
    e.stopPropagation();
    if (e.target && typeof e.target.focus === 'function') {
      e.target.focus();
    }
  };

  const triggerFileInput = (e) => {
    e.stopPropagation();
    const fileInput = e.currentTarget.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    
    const memoryData = {
      author: formData.get('author'),
      message: formData.get('message'),
      imageUrl: previewImage,
      created_at: new Date().toISOString()
    };

    await onSave(memoryData);
    
    setSaving(false);
    setPreviewImage(null);
    e.target.reset();
  };

  return (
    <form className="page-content-wrapper" onSubmit={handleSubmit}>
      <input 
        name="author" 
        type="text" 
        className="name-input" 
        placeholder="Your Name..." 
        defaultValue={initialData?.author || ''}
        onPointerDown={stopEventAndFocus}
        onMouseDown={stopEventAndFocus}
        onTouchStart={stopEventAndFocus}
        onClick={stopEventAndFocus}
        required 
      />
      
      <div className="photo-frame" onPointerDown={triggerFileInput} onMouseDown={triggerFileInput} onTouchStart={triggerFileInput} onClick={triggerFileInput}>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
        {previewImage ? (
          <img src={previewImage} alt="Preview" />
        ) : (
          <div className="photo-placeholder">
            <Camera size={24} />
            <span>Add Photo</span>
          </div>
        )}
      </div>
      
      <div className="lines-container">
        <textarea 
          name="message" 
          className="ruled-textarea" 
          placeholder="Write your message here..." 
          defaultValue={initialData?.message || ''}
          onPointerDown={stopEventAndFocus}
          onMouseDown={stopEventAndFocus}
          onTouchStart={stopEventAndFocus}
          onClick={stopEventAndFocus}
          required
        ></textarea>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', width: '100%' }}>
        <button type="submit" className="submit-btn" disabled={saving} onPointerDown={stopEventAndFocus} onMouseDown={stopEventAndFocus} onTouchStart={stopEventAndFocus} onClick={stopEventAndFocus}>
          {saving ? 'Saving...' : (initialData ? 'Update Memory' : 'Seal Memory')}
        </button>
        {onCancel && (
          <button 
            type="button" 
            className="submit-btn" 
            style={{ background: 'rgba(255,20,147,0.1)', color: 'var(--theme-main)', boxShadow: 'none' }} 
            onClick={(e) => { stopEventAndFocus(e); onCancel(); }}
            onPointerDown={stopEventAndFocus} onMouseDown={stopEventAndFocus} onTouchStart={stopEventAndFocus}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function App() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placedStickers, setPlacedStickers] = useState([]);
  const [activeSticker, setActiveSticker] = useState(null);
  const [draggingStickerId, setDraggingStickerId] = useState(null);
  const [showTray, setShowTray] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customStickers, setCustomStickers] = useState(() => {
    const saved = localStorage.getItem('slambook_custom_stickers');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalPages, setTotalPages] = useState(() => {
    const saved = localStorage.getItem('slambook_total_pages');
    return saved ? parseInt(saved, 10) : 18;
  });
  const bookRef = useRef();

  const emojiString = "🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🕷🐢🐍🦎🦖🦕🐙🦑🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🐊🐅🐆🦓🦍🦧🐘🦛🦏🐪🐫🦒🦘🐃🐂🐄🐎🐖🐏🐑🦙🐐🦌🐕🐩🦮🐕‍🦺🐈🐈‍⬛🐓🦃🦚🦜🦢🦩🕊🐇🦝🦨🦡🦦🦥🐁🐀🐿🦔🍏🍎🍐🍊🍋🍌🍉🍇🍓🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶🌽🥕🧄🧅🥔🍠🥐🥯🍞🥖🥨🧀🥚🍳🧈🥞🧇🥓🥩🍗🍖🦴🌭🍔🍟🍕🥪🥙🧆🌮🌯🥗🥘🥫🍝🍜🍲🍛🍣🍱🥟🦪🍤🍙🍚🍘🍥🥠🥮🍢🍡🍧🍨🍦🥧🧁🍰🎂🍮🍭🍬🍫🍿🍩🍪🌰🥜🍯🥛🍼☕🍵🧃🥤🍶🍺🍻🥂🍷🥃🍸🍹🧉🍾🧊🥄🍴🍽🥣🥡🥢🧂⚽🏀🏈⚾🥎🎾🏐🏉🥏🎱🪀🏓🏸🏒🏑🥍🏏🪃🥅⛳🪁🏹🎣🤿🥊🥋🎽🛹🛼🛷⛸🥌🎿⛷🏂🪂🏋️‍♀️🤼‍♀️🤸‍♀️⛹️‍♀️🤺🤾‍♀️🏌️‍♀️🏇🧘‍♀️🏄‍♀️🏊‍♀️🤽‍♀️🚣‍♀️🧗‍♀️🚵‍♀️🚴‍♀️🏆🥇🥈🥉🏅🎖🏵🎗🎫🎟🎪🤹‍♀️🎭🩰🎨🎬🎤🎧🎼🎹🥁🎷🎺🎸🪕🎻🎲🧩🎮🕹🎰💎💍💄💋🎀👗👠👡👢👛👜👝🛍👑👒🎩🎓🧢🧣🧤🌂☂🧵🧶👓🕶🥽🥼🦺👔👕👖🧣🧤🧥🧦👗👘🥻🩱🩲🩳👙👚👛👜👝🛍🎒👞👟🥾🥿👠👡👢👑👒🎩🎓🧢⛑💖💗💓💞💕💟❣💔❤️🧡💛💚💙💜🤎🖤🤍💯💢💬👁️‍🗨️🗨🗯💭💤💮♨💐🌸💮🏵🌹🥀🌺🌻🌼🌷😀😃😄😁😆😅😂🤣🥲☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾".match(/[\s\S]/gu).slice(0, 500);
  const defaultStickers = emojiString.map(e => ({ type: 'emoji', content: e, id: e }));
  const allStickers = [...customStickers, ...defaultStickers];

  const handleStickerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 150;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/png');
        
        const newCustom = { type: 'image', content: dataUrl, id: Date.now() };
        const updated = [newCustom, ...customStickers];
        setCustomStickers(updated);
        localStorage.setItem('slambook_custom_stickers', JSON.stringify(updated));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset input
  };

  const downloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('pdf-content');
    element.style.display = 'block';
    
    const opt = {
      margin:       0,
      filename:     'my_royal_slambook.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'px', format: [450, 600], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
      setIsDownloading(false);
    });
  };

  const fetchAllData = async () => {
    setLoading(true);
    const [memoriesRes, stickersRes] = await Promise.all([
      supabase.from('memories').select('*').order('id', { ascending: true }),
      supabase.from('stickers').select('*')
    ]);

    if (memoriesRes.data) setMemories(memoriesRes.data);
    if (stickersRes.data) setPlacedStickers(stickersRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDrop = async (e, pageIndex) => {
    e.preventDefault();
    if (activeSticker) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (draggingStickerId) {
        // Optimistic move
        setPlacedStickers(prev => prev.map(s => s.id === draggingStickerId ? { ...s, pageIndex, x, y } : s));
        await supabase.from('stickers').update({ pageIndex, x, y }).eq('id', draggingStickerId);
      } else {
        // Optimistic create
        const tempId = Date.now();
        const newSticker = { id: tempId, pageIndex, x, y, type: activeSticker.type || 'emoji', content: activeSticker.content || activeSticker };
        setPlacedStickers(prev => [...prev, newSticker]);
        
        const { data } = await supabase.from('stickers').insert([{ pageIndex, x, y, type: newSticker.type, content: newSticker.content }]).select();
        if (data && data.length > 0) {
          setPlacedStickers(prev => prev.map(s => s.id === tempId ? data[0] : s));
        }
      }
    }
  };

  const handleDragStart = (e, sticker) => {
    setActiveSticker(sticker);
  };

  const handleDragEnd = () => {
    setActiveSticker(null);
    setDraggingStickerId(null);
  };

  const handlePlacedStickerDragStart = (e, sticker) => {
    e.stopPropagation();
    setActiveSticker({ type: sticker.type || 'emoji', content: sticker.content || sticker });
    setDraggingStickerId(sticker.id);
  };

  const handleStickerDelete = async (id) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
    await supabase.from('stickers').delete().eq('id', id);
  };

  const saveMemory = async (memoryData) => {
    const { data } = await supabase.from('memories').insert([memoryData]).select();
    if (data) {
      await fetchAllData();
      if (bookRef.current) {
        const newIndex = memories.length + 1;
        bookRef.current.pageFlip().flip(newIndex + 2);
      }
    }
  };

  const deleteMemory = async (id) => {
    if (window.confirm('Are you sure you want to completely delete this memory?')) {
      const { error } = await supabase.from('memories').delete().eq('id', id);
      if (!error) {
        await fetchAllData();
      }
    }
  };

  const updateMemory = async (id, updatedData) => {
    const { data } = await supabase.from('memories').update(updatedData).eq('id', id).select();
    if (data) {
      await fetchAllData();
    }
    setEditingId(null);
  };

  if (loading) {
    return <div style={{ color: 'white', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Loader className="animate-spin" /> Loading Book...</div>;
  }

  const handleAddPages = () => {
    const newTotal = totalPages + 2;
    setTotalPages(newTotal);
    localStorage.setItem('slambook_total_pages', newTotal);
  };

  // Generate pages based on totalPages
  const pages = Array.from({ length: totalPages }).map((_, index) => {
    const mem = memories[index];
    const pageNum = index + 3;
    const pageStickers = placedStickers.filter(s => s.pageIndex === pageNum);
    
    return (
      <Page 
        key={mem ? mem.id : `blank-${index}`} 
        number={pageNum} 
        showTree={true}
        onDrop={(e) => handleDrop(e, pageNum)} 
        stickers={pageStickers} 
        draggingId={draggingStickerId}
        onStickerDragStart={handlePlacedStickerDragStart}
        onStickerDragEnd={handleDragEnd}
        onStickerDelete={handleStickerDelete}
      >
        <div className="ornament ornament-tl"></div>
        <div className="ornament ornament-br"></div>
        
        {mem ? (
          editingId === mem.id ? (
            <WriteMemoryForm onSave={(data) => updateMemory(mem.id, data)} initialData={mem} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="page-content-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 'calc(100% - 130px)' }}>
                  <div style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem', color: 'var(--theme-main)', borderBottom: '2px solid rgba(255, 20, 147, 0.6)', paddingBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{mem.author}</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingId(mem.id); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--theme-accent)' }}
                        title="Edit Memory"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteMemory(mem.id); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}
                        title="Delete Memory"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="photo-frame" style={{ cursor: 'default' }}>
                {mem.imageUrl ? (
                  <img src={mem.imageUrl} alt="Memory" />
                ) : (
                  <div className="photo-placeholder" style={{ opacity: 0.3 }}>
                    <Camera size={24} />
                    <span>No Photo</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lines-container">
              <div className="memory-read-text">
                {mem.message}
              </div>
            </div>
          </div>
          )
        ) : (
          <WriteMemoryForm onSave={saveMemory} />
        )}
      </Page>
    );
  });

  return (
    <div className="flipbook-container">
      
      {/* Page Management Controls */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px', zIndex: 10 }}>
        <button onClick={handleAddPages} className="submit-btn" style={{ padding: '8px 16px', fontSize: '1rem', width: 'auto', background: 'var(--theme-accent)' }}>+ Add Pages</button>
      </div>

      {/* Download PDF Button */}
      <div 
        className="sticker-fab" 
        style={{ right: 'auto', left: '40px', background: 'linear-gradient(135deg, #FFB6C1, #FF1493)' }}
        onClick={downloadPDF}
        title="Download Book as PDF"
      >
        {isDownloading ? <Loader className="animate-spin" size={24} color="white" /> : <Download size={24} color="white" />}
      </div>

      {/* Floating Sticker Button / Trash Button */}
      <div 
        className="sticker-fab" 
        onClick={() => setShowTray(!showTray)} 
        title="Open Sticker Book / Drop to Delete"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggingStickerId) {
            const updated = placedStickers.filter(s => s.id !== draggingStickerId);
            setPlacedStickers(updated);
            localStorage.setItem('slambook_stickers', JSON.stringify(updated));
          }
        }}
      >
        🎀
      </div>

      <div className={`sticker-tray ${showTray ? '' : 'closed'}`}>
        <label className="tray-sticker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,20,147,0.1)', borderRadius: '10px', height: '40px', width: '40px' }} title="Upload Custom Sticker">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleStickerUpload} />
          <span style={{ fontSize: '1.5rem', color: '#ff1493' }}>+</span>
        </label>

        {allStickers.map((sticker) => (
          <div 
            key={sticker.id} 
            className="tray-sticker"
            draggable={true}
            onDragStart={(e) => handleDragStart(e, sticker)}
            onDragEnd={handleDragEnd}
          >
            {sticker.type === 'image' ? (
              <img src={sticker.content} style={{ width: '40px', height: '40px', objectFit: 'contain', pointerEvents: 'none' }} alt="sticker" draggable={false} />
            ) : (
              sticker.content
            )}
          </div>
        ))}
      </div>

      <HTMLFlipBook 
        width={450} 
        height={600} 
        size="fixed"
        usePortrait={false}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        disableFlipByClick={true}
        className="demo-book"
        ref={bookRef}
      >
        {/* Cover Page */}
        <Page className="page-cover" number={0} onDrop={(e) => handleDrop(e, 0)} stickers={placedStickers.filter(s => s.pageIndex === 0)} draggingId={draggingStickerId} onStickerDragStart={handlePlacedStickerDragStart} onStickerDragEnd={handleDragEnd} onStickerDelete={handleStickerDelete}>
          <CoverFrame />
          <h1 className="page-cover-title" style={{ fontSize: '4.5rem', marginTop: '40px', marginBottom: '10px', zIndex: 2 }}>Shankaripriya</h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '10px 20px', padding: '0 40px', marginTop: '30px', zIndex: 2 }}>
            {coverFriends.map((f, i) => (
              <span key={f} style={getUnevenStyle(i)}>{f}</span>
            ))}
          </div>

          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: 'auto', paddingBottom: '30px', zIndex: 2 }}>(Click or drag corners to open)</p>
        </Page>

        {/* Inside Cover */}
        <Page number={1} showTree={true} onDrop={(e) => handleDrop(e, 1)} stickers={placedStickers.filter(s => s.pageIndex === 1)} draggingId={draggingStickerId} onStickerDragStart={handlePlacedStickerDragStart} onStickerDragEnd={handleDragEnd} onStickerDelete={handleStickerDelete}>
          <div className="page-content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
            <h2 className="royal-title">Dedicated to Friends</h2>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>"Good friends are like stars. You don't always see them, but you know they're always there."</p>
          </div>
        </Page>

        {/* Message Page (Page 2) */}
        <Page number={2} showTree={false} onDrop={(e) => handleDrop(e, 2)} stickers={placedStickers.filter(s => s.pageIndex === 2)} draggingId={draggingStickerId} onStickerDragStart={handlePlacedStickerDragStart} onStickerDragEnd={handleDragEnd} onStickerDelete={handleStickerDelete}>
          <CoverFrame colorTheme="pink" />
          <div className="page-content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '80px 50px', zIndex: 2, background: 'transparent' }}>
            <h2 className="royal-title" style={{ fontSize: '2rem', marginBottom: '15px' }}>A Message for You</h2>
            <p style={{ fontFamily: 'Dancing Script', fontSize: '1.05rem', lineHeight: '1.4', textAlign: 'center', color: '#4a4a4a' }}>
              Hi guys!<br/><br/>
              I’m Shankaripriya. I hope you all know me in some way and have been a part of my college journey. Twinsriram - my best partner, Yaazhini - my best friend, Shivaani - my best source of charm and positivity, and each one of you - a special part of my college life.<br/><br/>
              I’ll always cherish the best memories we created together and the lessons I’ve learned from each of you. No matter where life takes us, those memories or learnings will always stay with me. Thank you for being a part of my journey and helping me become a better version of myself. I hope we all continue to grow, and achieve our dreams.<br/><br/>
              Forever grateful for this beautiful chapter of my life.
            </p>
          </div>
        </Page>

        {/* The 18 Pages */}
        {pages}

        {/* Back Cover */}
        <Page className="page-cover" number={totalPages + 3} onDrop={(e) => handleDrop(e, totalPages + 3)} stickers={placedStickers.filter(s => s.pageIndex === totalPages + 3)} draggingId={draggingStickerId} onStickerDragStart={handlePlacedStickerDragStart} onStickerDragEnd={handleDragEnd} onStickerDelete={handleStickerDelete}>
          <h1 className="page-cover-title" style={{ marginTop: 'auto', marginBottom: 'auto' }}>The End</h1>
        </Page>

      </HTMLFlipBook>

      {/* Hidden Container for PDF Export */}
      <div id="pdf-content" style={{ display: 'none', background: 'var(--paper-bg)' }}>
        {/* Cover */}
        <div style={{ width: 450, height: 600, background: 'var(--theme-main)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <CoverFrame />
          <h1 className="page-cover-title" style={{ fontSize: '4.5rem', marginTop: '40px', marginBottom: '10px', zIndex: 2 }}>Shankaripriya</h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '10px 20px', padding: '0 40px', marginTop: '30px', zIndex: 2 }}>
            {coverFriends.map((f, i) => (
              <span key={f} style={getUnevenStyle(i)}>{f}</span>
            ))}
          </div>
          
          {placedStickers.filter(s => s.pageIndex === 0).map(s => (
            <div key={s.id} style={{ position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)', fontSize: '3rem' }}>
              {s.type === 'image' ? <img src={s.content} style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : (s.content || s)}
            </div>
          ))}
        </div>
        
        {/* Inner Cover */}
        <div style={{ width: 450, height: 600, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
          <h2 className="royal-title">Dedicated to Friends</h2>
          <p style={{ marginTop: '20px', textAlign: 'center' }}>"Good friends are like stars. You don't always see them, but you know they're always there."</p>
          <img src="/apple_tree.png" alt="Apple Tree" style={{ position: 'absolute', right: '15px', bottom: '60px', width: '130px', height: 'auto', opacity: 0.8, zIndex: 1, mixBlendMode: 'multiply' }} />
          {placedStickers.filter(s => s.pageIndex === 1).map(s => (
            <div key={s.id} style={{ position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)', fontSize: '3rem' }}>
              {s.type === 'image' ? <img src={s.content} style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : (s.content || s)}
            </div>
          ))}
        </div>

        {/* Message Page (Page 2) */}
        <div style={{ width: 450, height: 600, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
          <CoverFrame colorTheme="pink" />
          <h2 className="royal-title" style={{ fontSize: '2rem', marginBottom: '15px', zIndex: 2 }}>A Message for You</h2>
          <p style={{ fontFamily: 'Dancing Script', fontSize: '1.05rem', lineHeight: '1.4', textAlign: 'center', color: '#4a4a4a', zIndex: 2 }}>
            Hi guys!<br/><br/>
            I’m Shankaripriya. I hope you all know me in some way and have been a part of my college journey. Twinsriram - my best partner, Yaazhini - my best friend, Shivaani - my best source of charm and positivity, and each one of you - a special part of my college life.<br/><br/>
            I’ll always cherish the best memories we created together and the lessons I’ve learned from each of you. No matter where life takes us, those memories or learnings will always stay with me. Thank you for being a part of my journey and helping me become a better version of myself. I hope we all continue to grow, and achieve our dreams.<br/><br/>
            Forever grateful for this beautiful chapter of my life.
          </p>
          {placedStickers.filter(s => s.pageIndex === 2).map(s => (
            <div key={s.id} style={{ position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)', fontSize: '3rem' }}>
              {s.type === 'image' ? <img src={s.content} style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : (s.content || s)}
            </div>
          ))}
        </div>

        {/* Memory Pages */}
        {memories.map((mem, i) => {
          const pageNum = i + 3;
          const pageStickers = placedStickers.filter(s => s.pageIndex === pageNum);
          return (
            <div key={mem.id} style={{ width: 450, height: 600, position: 'relative', overflow: 'hidden' }}>
              <div className="ornament ornament-tl"></div>
              <div className="ornament ornament-br"></div>
              <div className="page-content-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 'calc(100% - 130px)' }}>
                    <div style={{ fontFamily: 'Dancing Script', fontSize: '1.5rem', color: 'var(--theme-main)', borderBottom: '2px solid rgba(255, 20, 147, 0.6)', paddingBottom: '5px' }}>
                      {mem.author}
                    </div>
                  </div>
                  <div className="photo-frame">
                    {mem.imageUrl && <img src={mem.imageUrl} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                </div>
                <div className="lines-container">
                  <div className="memory-read-text">{mem.message}</div>
                </div>
              </div>
              {pageStickers.map(s => (
                <div key={s.id} style={{ position: 'absolute', left: s.x, top: s.y, transform: 'translate(-50%, -50%)', fontSize: '3rem', zIndex: 50 }}>
                  {s.type === 'image' ? <img src={s.content} style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : (s.content || s)}
                </div>
              ))}
              <img src="/apple_tree.png" alt="Apple Tree" style={{ position: 'absolute', right: '15px', bottom: '60px', width: '130px', height: 'auto', opacity: 0.8, zIndex: 1, mixBlendMode: 'multiply' }} />
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;
