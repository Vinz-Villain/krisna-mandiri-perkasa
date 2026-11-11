import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chatbotLogo from '../assets/chatbot-logo.png';

let messageCounter = 0;
const generateMsgId = (prefix) => {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
};

export default function ChatbotWidget({
  defaultWhatsAppNumber = '6289659586363',
  displayWhatsApp = '+62 896 5958 6363',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Halo! Selamat datang di CV. Krisna Mandiri Perkasa 👋',
      time: 'Baru saja',
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: 'Sedang mencari tipe sparepart tertentu, butuh cek ketersediaan stok, atau minta surat penawaran harga (RFQ) resmi? Tuliskan saja di bawah ya, tim kami siap membantu.',
      time: 'Baru saja',
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickChips = [
    {
      label: '🔍 Cek stok & nomor part',
      text: 'Halo KMP, saya ingin cek ketersediaan stok dan harga untuk part mesin pabrik.',
    },
    {
      label: '📄 Minta surat penawaran (RFQ)',
      text: 'Halo KMP, saya butuh surat penawaran harga resmi (Quotation/RFQ) untuk pengadaan sparepart pabrik.',
    },
    {
      label: '⚙️ Konsultasi teknis / part pengganti',
      text: 'Halo KMP, saya mau konsultasi kecocokan spesifikasi / cross-reference part pengganti untuk mesin.',
    },
    {
      label: '💬 Chat langsung dengan tim sales',
      text: 'Halo tim CV. Krisna Mandiri Perkasa, saya ingin terhubung langsung dengan bagian pengadaan & sales.',
    },
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  const handleToggle = () => {
    setHasOpened(true);
    setIsOpen((prev) => !prev);
  };

  const createWhatsAppUrl = (userQuery) => {
    const message = `Halo Admin CV. Krisna Mandiri Perkasa,\nSaya dari website ingin bertanya:\n\n"${userQuery}"\n\nMohon informasi ketersediaan atau penawarannya. Terima kasih.`;
    return `https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessageId = generateMsgId('user');
    const currentTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsgObj = {
      id: userMessageId,
      sender: 'user',
      text: query,
      time: currentTimeStr,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputText('');
    setIsTyping(true);

    const waUrl = createWhatsAppUrl(query);

    // Simulate natural response & handoff
    setTimeout(() => {
      setIsTyping(false);
      const botResponseId = generateMsgId('bot');
      const botMsgObj = {
        id: botResponseId,
        sender: 'bot',
        text: 'Pesan Anda sudah kami siapkan. Silakan klik tombol di bawah untuk langsung terhubung dengan Admin Teknis & Sales KMP via WhatsApp:',
        time: currentTimeStr,
        action: {
          label: 'Lanjut ke WhatsApp Resmi KMP',
          url: waUrl,
        },
      };

      setMessages((prev) => [...prev, botMsgObj]);

      // Open WhatsApp in a new tab safely
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Auto-open blocked, user can click button:', err);
      }
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleChipClick = (chip) => {
    handleSendMessage(chip.text);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: 'Halo! Selamat datang di CV. Krisna Mandiri Perkasa 👋',
        time: 'Baru saja',
      },
      {
        id: 'welcome-2',
        sender: 'bot',
        text: 'Sedang mencari tipe sparepart tertentu, butuh cek ketersediaan stok, atau minta surat penawaran harga (RFQ) resmi? Tuliskan saja di bawah ya, tim kami siap membantu.',
        time: 'Baru saja',
      },
    ]);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING CHAT CARD WINDOW */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-24px)] max-w-[390px] h-[540px] max-h-[82vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white p-1.5 border-2 border-[#DC2626] flex items-center justify-center shrink-0 shadow-sm">
                    <img src={chatbotLogo} alt="Layanan Pelanggan KMP" className="w-full h-full object-contain" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>

                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-tight">
                    <span>Layanan Pelanggan KMP</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online • Respon Cepat</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-xs transition-colors"
                  title="Mulai obrolan baru"
                >
                  <i className="fa-solid fa-rotate-right text-[11px]"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-sm transition-colors"
                  title="Tutup Obrolan"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Sub-header info bar */}
            <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-200/80 flex items-center justify-between text-[10.5px] text-slate-600 font-mono shrink-0">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-[#DC2626]"></i>
                <span>Resmi CV. Krisna Mandiri Perkasa</span>
              </span>
              <span className="text-slate-400">{displayWhatsApp}</span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
              {/* Date Stamp */}
              <div className="text-center my-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-xs">
                  Bantuan Langsung
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action button in bot message if present */}
                    {msg.action && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <a
                          href={msg.action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 text-center"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i>
                          <span>{msg.action.label}</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        </a>
                      </div>
                    )}
                  </div>

                  <span className="text-[9.5px] text-slate-400 mt-1 px-1 font-mono flex items-center gap-1">
                    {msg.time}
                    {msg.sender === 'user' && (
                      <i className="fa-solid fa-check-double text-blue-500 text-[9px]"></i>
                    )}
                  </span>
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-1">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      Menghubungkan ke WhatsApp...
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Prompt Chips (show when only welcome messages exist) */}
              {messages.length <= 2 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase font-bold text-slate-400 px-1">
                    Pilihan Cepat:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="text-left px-3 py-2 rounded-xl bg-white hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 text-slate-700 text-[11px] font-medium transition-all shadow-xs flex items-center justify-between group active:scale-[0.99]"
                      >
                        <span className="group-hover:text-slate-900">{chip.label}</span>
                        <i className="fa-solid fa-chevron-right text-[9px] text-slate-300 group-hover:text-slate-600 transition-colors"></i>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-slate-200 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik tipe part atau pertanyaan Anda..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm"
                  title="Kirim ke WhatsApp KMP"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono px-0.5">
                <span className="flex items-center gap-1">
                  <i className="fa-brands fa-whatsapp text-emerald-600"></i>
                  <span>Diteruskan ke WhatsApp Resmi</span>
                </span>
                <span>Bebas Konsultasi</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. FLOATING TRIGGER BUTTON (CIRCULAR) */}
      {/* ============================================================== */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5">
        {/* Unread hint tooltip (desktop only, disappears after first click) */}
        {!hasOpened && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            onClick={handleOpen}
            className="hidden md:flex items-center gap-2 bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-full border border-slate-200 shadow-xl cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Butuh bantuan cek stok part? Tulis di sini</span>
            <i
              className="fa-solid fa-xmark text-[10px] text-slate-400 hover:text-slate-600 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                setHasOpened(true);
              }}
            ></i>
          </motion.div>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggle}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all border-2 cursor-pointer ${
            isOpen
              ? 'bg-slate-900 border-slate-700 text-white'
              : 'bg-white border-slate-200 hover:border-[#DC2626] hover:shadow-red-500/20'
          }`}
          title={isOpen ? 'Tutup Chat' : 'Konsultasi Suku Cadang'}
          aria-label={isOpen ? 'Tutup Chat' : 'Buka Chatbot Bantuan'}
        >
          {isOpen ? (
            <i className="fa-solid fa-xmark text-xl text-white"></i>
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 p-1 flex items-center justify-center">
              <img
                src={chatbotLogo}
                alt="Chatbot KMP"
                className="w-full h-full object-contain hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Online green indicator badge on the button */}
          {!isOpen && (
            <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          )}

          {/* Red unread badge when closed and hasn't opened yet */}
          {!hasOpened && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DC2626] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
              1
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
