import { useState, useEffect, useRef } from "react";
import { 
  getChatRooms, 
  getChatMessages, 
  sendChatMessage, 
  saveChatRooms,
  saveChatMessages,
  type ChatRoom, 
  type ChatMessage,
  isSubscriptionActive,
  markRoomMessagesAsRead,
  getUsers
} from "@/lib/storage";
import { MessageSquare, Send, User as UserIcon, Clock, ChevronLeft, ShieldCheck, Zap, CheckCheck, Check, X, Mail, Globe, Linkedin, Instagram, Facebook, Youtube, AtSign, Briefcase, Phone, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface ChatCoreProps {
  initialRoomId?: string;
  onClose?: () => void;
}

export default function ChatCore({ initialRoomId, onClose }: ChatCoreProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(initialRoomId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showUserProfile, setShowUserProfile] = useState<any | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const loadRooms = () => {
      const allUsers = getUsers();
      const allRooms = getChatRooms().filter(r => {
        if (!r.participantIds.includes(user.id)) return false;
        const otherId = r.participantIds.find(id => id !== user.id);
        return allUsers.some(u => u.id === otherId);
      });
      setRooms(allRooms);
      
      const allMsgs = getChatMessages();
      const counts: Record<string, number> = {};
      allRooms.forEach(r => {
         counts[r.id] = allMsgs.filter(m => m.roomId === r.id && m.senderId !== user.id && !m.isRead).length;
      });
      setUnreadCounts(counts);
    };
    loadRooms();
    const interval = setInterval(loadRooms, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (activeRoomId && user) {
      const loadMessages = () => {
        let allMsgs = getChatMessages().filter(m => m.roomId === activeRoomId);
        const unreadFromOther = allMsgs.some(m => m.senderId !== user.id && !m.isRead);
        if (unreadFromOther) {
          markRoomMessagesAsRead(activeRoomId, user.id);
          allMsgs = getChatMessages().filter(m => m.roomId === activeRoomId);
          setUnreadCounts(prev => ({ ...prev, [activeRoomId]: 0 }));
        }
        setMessages(allMsgs);
      };
      loadMessages();
      const interval = setInterval(loadMessages, 1000); // Fast poll for active chat
      return () => clearInterval(interval);
    }
  }, [activeRoomId, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, activeRoomId]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeRoomId || !user) return;
    sendChatMessage(activeRoomId, user.id, inputText);
    setInputText("");
  };

  const handleRemoveConnection = () => {
    if (!activeRoomId) return;
    const allRooms = getChatRooms();
    saveChatRooms(allRooms.filter(r => r.id !== activeRoomId));
    
    const allMsgs = getChatMessages();
    saveChatMessages(allMsgs.filter(m => m.roomId !== activeRoomId));

    setRooms(prev => prev.filter(r => r.id !== activeRoomId));
    setActiveRoomId(null);
    setShowUserProfile(null);
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center p-20 text-center bg-white dark:bg-card border border-border rounded-[3rem]">
      <Zap className="w-16 h-16 text-primary/20 mb-6" />
      <h3 className="text-2xl font-black uppercase tracking-tighter">Login Required</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Please authenticate your node to access secure marketplace transmissions.</p>
    </div>
  );

  const allUsers = getUsers();
  const getOtherUserName = (room: ChatRoom) => {
    const otherUserId = room.participantIds.find(id => id !== user?.id);
    const otherUser = allUsers.find(u => u.id === otherUserId);
    return otherUser ? otherUser.name : "Unknown User";
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  return (
    <div className="flex h-[550px] sm:h-[600px] md:h-[650px] bg-white dark:bg-[#0A0A0F] border border-border rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      {/* Sidebar - Rooms List */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col bg-muted/5 ${activeRoomId && 'hidden md:flex'}`}>
        <div className="p-4 sm:p-6 md:p-8 border-b border-border bg-white dark:bg-card">
          <h3 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-3">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Signal Hub
          </h3>
          <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 sm:mt-2 opacity-60">Active Trade Channels</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 sm:p-3 space-y-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              className={`w-full p-3.5 sm:p-5 rounded-2xl sm:rounded-[1.5rem] text-left transition-all flex items-center gap-3 sm:gap-4 relative overflow-hidden group ${activeRoomId === room.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'hover:bg-white dark:hover:bg-card border border-transparent hover:border-border'}`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${activeRoomId === room.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] sm:text-[12px] font-black uppercase truncate leading-none mb-1 ${activeRoomId === room.id ? 'text-white' : 'text-foreground'}`}>
                  {getOtherUserName(room)}
                </p>
                <p className={`text-[9px] sm:text-[10px] font-bold truncate opacity-80 mb-1 ${activeRoomId === room.id ? 'text-white/80' : 'text-primary'}`}>
                  {room.contextTitle || `Node_${room.id.slice(0, 8)}`}
                </p>
                <p className={`text-[9px] sm:text-[10px] font-medium truncate opacity-70 ${activeRoomId === room.id ? 'text-white' : 'text-muted-foreground'}`}>
                  {room.lastMessage || "Awaiting signal synchronization..."}
                </p>
              </div>
              {unreadCounts[room.id] > 0 && activeRoomId !== room.id && (
                <span className="bg-indigo-500 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-black min-w-[18px] sm:min-w-[20px] text-center shrink-0 shadow-sm">
                  {unreadCounts[room.id]}
                </span>
              )}
              {activeRoomId === room.id && <div className="absolute right-0 top-0 h-full w-1 bg-white" />}
            </button>
          ))}
          {rooms.length === 0 && (
            <div className="p-8 sm:p-12 text-center">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-border/10">
                 <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30" />
               </div>
               <p className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-40">No Active Relays</p>
            </div>
          )}
        </div>
      </div>

      {/* Main View - Messages */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-card ${!activeRoomId && 'hidden md:flex'}`}>
        {activeRoomId ? (
          <>
            <div className="p-3.5 sm:p-6 md:p-8 border-b border-border flex items-center justify-between bg-muted/5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 sm:gap-5 min-w-0">
                <Button variant="ghost" size="icon" onClick={() => setActiveRoomId(null)} className="md:hidden h-9 w-9 rounded-xl shrink-0 -ml-1">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <button 
                  onClick={() => {
                    const otherId = activeRoom?.participantIds.find(id => id !== user?.id);
                    const otherUser = allUsers.find(u => u.id === otherId);
                    if (otherUser) setShowUserProfile(otherUser);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner hover:bg-primary/20 transition-colors cursor-pointer shrink-0"
                >
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="min-w-0 flex-1">
                   <h3 className="text-xs sm:text-base font-black uppercase tracking-tight truncate max-w-[170px] sm:max-w-none">
                     {activeRoom ? (activeRoom.contextTitle ? `${activeRoom.contextTitle} - ${getOtherUserName(activeRoom)}` : getOtherUserName(activeRoom)) : "Encrypted Direct"}
                   </h3>
                   <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                     <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                     <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate">Live Channel Authorized</span>
                   </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0">
                <ShieldCheck className="w-4 h-4" /> Secure Hub
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 bg-slate-50/50 dark:bg-transparent" style={{ scrollBehavior: 'smooth' }}>
              {messages.map((msg, i) => {
                const isMine = msg.senderId === user.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[70%] p-3.5 sm:p-5 rounded-2xl sm:rounded-[1.75rem] text-xs sm:text-[13px] font-bold leading-relaxed shadow-sm transition-all hover:shadow-md ${isMine ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-muted/50 border border-border rounded-tl-none'}`}>
                      {msg.text}
                      <div className={`text-[8px] sm:text-[9px] mt-1.5 sm:mt-2 font-black uppercase opacity-50 flex items-center gap-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && (
                          msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-blue-400" /> : <Check className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-30 py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center mb-3 sm:mb-4">
                    <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary text-center px-4">Channel Ready for Transmission</p>
                </div>
              )}
              <div ref={scrollRef} className="h-1" />
            </div>

            <div className="p-3 sm:p-6 md:p-8 border-t border-border bg-white dark:bg-card pb-14 sm:pb-6 md:pb-8">
              <div className="flex items-center gap-2 sm:gap-4 bg-muted/10 p-2 sm:p-3 rounded-2xl sm:rounded-[1.75rem] border border-border shadow-inner focus-within:border-primary/50 transition-all">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Transmit secure trade signal..."
                  className="flex-1 bg-transparent border-none outline-none px-2 sm:px-4 text-xs font-bold text-foreground min-w-0"
                />
                <Button onClick={handleSendMessage} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl gradient-primary border-none p-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </Button>
              </div>
              <p className="text-[8px] sm:text-[9px] text-center mt-2 sm:mt-4 text-muted-foreground font-black uppercase tracking-widest opacity-40 hidden sm:block">System logs encrypted and archived for trade compliance</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/20 dark:bg-transparent">
            <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center mb-8 shadow-inner">
               <Zap className="w-12 h-12 text-primary/20" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Relay Station Standby</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto mt-3 leading-relaxed italic">Select an authorized channel from the matrix to begin secure industrial negotiations.</p>
            <div className="mt-10 flex items-center gap-8 opacity-30 grayscale">
              <div className="flex flex-col items-center gap-1">
                 <ShieldCheck className="w-6 h-6" />
                 <span className="text-[8px] font-black uppercase">Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Zap className="w-6 h-6" />
                 <span className="text-[8px] font-black uppercase">Instant</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Clock className="w-6 h-6" />
                 <span className="text-[8px] font-black uppercase">Archived</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showUserProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserProfile(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-card w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-border"
            >
              <div className="p-8 relative">
                <button 
                  onClick={() => setShowUserProfile(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white font-black text-4xl shadow-xl mb-4 border-4 border-white dark:border-card shrink-0">
                    {showUserProfile.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{showUserProfile.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-6">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                      {showUserProfile.role === 'buyer' ? 'Pro Buyer' : 'Verified Seller'}
                    </span>
                    {showUserProfile.verified && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-black text-foreground">{showUserProfile.email}</p>
                      </div>
                    </div>

                    {showUserProfile.phone && (
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Direct Line</p>
                          <p className="text-sm font-black text-foreground">{showUserProfile.phone}</p>
                        </div>
                      </div>
                    )}

                    {showUserProfile.sector && (
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Industry Sector</p>
                          <p className="text-sm font-black text-foreground">{showUserProfile.sector}</p>
                        </div>
                      </div>
                    )}

                    {showUserProfile.website && (
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-transparent">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Web Presence</p>
                          <a href={showUserProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-primary hover:underline">{showUserProfile.website}</a>
                        </div>
                      </div>
                    )}
                  </div>

                  {showUserProfile.socialLinks && Object.values(showUserProfile.socialLinks).some(Boolean) && (
                    <div className="w-full mt-6 pt-6 border-t border-border">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Connected Nodes</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {showUserProfile.socialLinks.linkedin && (
                          <a href={`https://linkedin.com/in/${showUserProfile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {showUserProfile.socialLinks.instagram && (
                          <a href={`https://instagram.com/${showUserProfile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {showUserProfile.socialLinks.facebook && (
                          <a href={`https://facebook.com/${showUserProfile.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800 hover:bg-blue-800 hover:text-white transition-all shadow-sm border border-blue-200">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {showUserProfile.socialLinks.youtube && (
                          <a href={`https://youtube.com/@${showUserProfile.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100">
                            <Youtube className="w-5 h-5" />
                          </a>
                        )}
                        {showUserProfile.socialLinks.threads && (
                          <a href={`https://threads.net/@${showUserProfile.socialLinks.threads}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-foreground hover:bg-foreground hover:text-white transition-all shadow-sm border border-slate-200">
                            <AtSign className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="w-full mt-6 pt-6 border-t border-border">
                    <Button 
                      variant="ghost" 
                      onClick={handleRemoveConnection}
                      className="w-full h-12 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" /> Remove Connection
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
