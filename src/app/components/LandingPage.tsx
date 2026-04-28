import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Wrench, Clock, Shield, Smartphone, CheckCircle2, Star, ArrowRight, Calendar, MapPin, Phone, MessageCircle, ArrowUp, X, Mail, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'motion/react';
import logoImage from 'figma:asset/02aef87afa090fdbcaef1cdcae0089d551235b8e.png';
import workshopImage from 'figma:asset/b10a928243874260885c1492e9db2868a9c41f14.png';

// Interactive Workshop Image Component with 3D Tilt
function InteractiveWorkshopImage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const rotateX = mousePosition.y * -15;
  const rotateY = mousePosition.x * 15;

  return (
    <motion.div
      ref={imageRef}
      className="relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
        animate={{
          rotateX: isHovering ? rotateX : 0,
          rotateY: isHovering ? rotateY : 0,
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <ImageWithFallback
            src={workshopImage}
            alt="YAMAHA Professional Workshop"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        
        {/* Glowing Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 pointer-events-none"
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Animated Floating Guarantee Badge */}
      <motion.div
        className="absolute -bottom-6 -left-6 bg-gradient-to-br from-white to-gray-50 text-gray-900 rounded-2xl shadow-2xl p-6 border-2 border-primary/20"
        initial={{ opacity: 0, scale: 0, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        whileHover={{ 
          scale: 1.15, 
          rotate: 5,
          boxShadow: "0 20px 50px rgba(255, 126, 95, 0.4)"
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50" />
            <Shield className="w-10 h-10 text-primary relative z-10" />
          </motion.div>
          <div>
            <motion.div 
              className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              100% Garansi
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">Kepuasan Terjamin</div>
          </div>
        </div>
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Number((easeOutQuart * end).toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, end, duration, decimals]);

  return { count, ref: countRef };
}

interface LandingPageProps {
  onNavigateToLogin?: () => void;
}

export function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, profile } = useAuth();

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (tab: 'login' | 'signup') => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      setAuthModalTab(tab);
      setShowAuthModal(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Counter hooks
  const customers = useCountUp(5000);
  const technicians = useCountUp(15);
  const rating = useCountUp(4.9, 2000, 1);

  // Service packages data
  const servicePackages = [
    {
      name: "Hemat Service",
      price: 40000,
      priceLabel: "≥ Rp.40.000",
      description: "Perawatan cepat & efisien",
      features: [
        "Ganti oli mesin standar",
        "Cek tekanan ban",
        "Pengecekan busi ringan"
      ],
      recommendation: "Cocok untuk perawatan cepat, misalnya tiap 1–2 bulan.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Basic Tune-Up",
      price: 60000,
      priceLabel: "≥ Rp.60.000",
      description: "Perawatan rutin lengkap",
      features: [
        "Semua layanan Hemat Service",
        "Pembersihan karburator / throttle body",
        "Setel rantai & rem"
      ],
      recommendation: "Cocok untuk perawatan rutin bulanan / 2 bulanan.",
      color: "from-green-500 to-emerald-500",
      popular: true
    },
    {
      name: "Standard Service",
      price: 100000,
      priceLabel: "≥ Rp.100.000",
      description: "Perawatan berkala menyeluruh",
      features: [
        "Semua layanan Basic Tune-Up",
        "Ganti oli mesin + oli gardan (untuk matic)",
        "Pembersihan filter udara",
        "Pengecekan kampas rem & shockbreaker",
        "Pengecekan kelistrikan (lampu, aki, kabel)",
        "Pengecekan sistem pendingin (radiator)"
      ],
      recommendation: "Cocok untuk perawatan berkala setiap 3–4 bulan.",
      color: "from-orange-500 to-amber-500"
    },
    {
      name: "Premium Service",
      price: 150000,
      priceLabel: "≥ Rp.150.000",
      description: "Service besar premium",
      features: [
        "Semua layanan Standard Service",
        "Ganti oli mesin full synthetic",
        "Pembersihan injektor (untuk motor injeksi)",
        "Pengecekan kompresi mesin",
        "Pengecekan sistem CVT (untuk matic)",
        "Pengecekan bearing roda & balancing",
        "Pengecekan sistem pengapian & ECU"
      ],
      recommendation: "Cocok untuk service besar tiap 6 bulan atau sebelum perjalanan jauh.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleWhatsAppBooking = (packageName: string, price: number) => {
    const phoneNumber = "6281515450611";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const message = `Halo YAMAHA Service! 👋

Saya ingin booking service:
📦 Paket: ${packageName}
💰 Harga: Rp ${price.toLocaleString('id-ID')}

Jadwal yang saya inginkan:
📅 Tanggal: ${tomorrow.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🕐 Jam: 09:00 WIB

Mohon konfirmasi ketersediaan jadwal. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    setShowWhatsAppChat(false);
  };

  const handleBookNow = () => {
    if (user && profile) {
      const servicesSection = document.getElementById('services');
      servicesSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleAuthClick('signup');
    }
  };

  const handleSendWhatsAppMessage = () => {
    if (!chatMessage.trim()) return;
    
    const phoneNumber = "6281515450611";
    const encodedMessage = encodeURIComponent(`Halo YAMAHA Service! ${chatMessage}`);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setChatMessage('');
    setShowWhatsAppChat(false);
  };

  // Testimonials with auto-scroll
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Ojek Online Driver",
      rating: 5,
      comment: "Tracking real-time sangat membantu! Saya bisa tau persis kapan motor saya selesai. Service cepat dan hasil memuaskan.",
      avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=ff7e5f&color=fff"
    },
    {
      name: "Rina Kusuma",
      role: "Karyawan Swasta",
      rating: 5,
      comment: "Booking online bikin gampang banget. Ga perlu antri lama. Teknisinya ramah dan profesional. Recommended!",
      avatar: "https://ui-avatars.com/api/?name=Rina+Kusuma&background=feb47b&color=fff"
    },
    {
      name: "Ahmad Wijaya",
      role: "Entrepreneur",
      rating: 5,
      comment: "Harga transparan, no hidden cost. Paket Premium Service worth it banget sebelum mudik kemarin. Motor jadi lebih halus!",
      avatar: "https://ui-avatars.com/api/?name=Ahmad+Wijaya&background=ff7e5f&color=fff"
    },
    {
      name: "Siti Rahma",
      role: "Mahasiswa",
      rating: 5,
      comment: "Pelayanan ramah dan harga terjangkau untuk mahasiswa. Teknisi profesional dan hasil kerja rapi!",
      avatar: "https://ui-avatars.com/api/?name=Siti+Rahma&background=feb47b&color=fff"
    },
    {
      name: "Dedi Kurniawan",
      role: "Sales Manager",
      rating: 5,
      comment: "YAMAHA Service solusi terbaik untuk perawatan motor. Tracking progress bikin tenang, ga perlu khawatir!",
      avatar: "https://ui-avatars.com/api/?name=Dedi+Kurniawan&background=ff7e5f&color=fff"
    }
  ];

  return (
    <div className="min-h-screen">
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          defaultTab={authModalTab}
        />
      )}

      {/* Navigation - Transparent to Solid */}
      <motion.nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' 
            : 'bg-gradient-to-r from-primary/95 via-accent/95 to-primary/95 backdrop-blur-md border-b border-white/30 shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img 
                src={logoImage} 
                alt="YAMAHA Logo" 
                className="h-10 w-auto object-contain opacity-95" 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['Layanan', 'Fitur', 'Testimoni', 'Kontak'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white/95 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium'}`}>
                    {profile?.full_name || user.email}
                  </span>
                  <Badge className="bg-accent text-white border-0">
                    {profile?.role || 'user'}
                  </Badge>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    className={isScrolled ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white text-primary hover:bg-white/90 shadow-lg font-semibold'}
                    onClick={() => handleAuthClick('login')}
                  >
                    Masuk / Daftar
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <motion.button
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span 
                className={`w-6 h-0.5 rounded-full transition-colors ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
                animate={showMobileMenu ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              />
              <motion.span 
                className={`w-6 h-0.5 rounded-full transition-colors ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
                animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span 
                className={`w-6 h-0.5 rounded-full transition-colors ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
                animate={showMobileMenu ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Top Banner - Below Navbar - Desktop Only */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block overflow-hidden"
            >
              <div className="bg-black/40 backdrop-blur-md border-t border-white/20">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-2">
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-5">
                      <motion.div 
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="font-medium drop-shadow-md">+62 815-1545-0611</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="font-medium drop-shadow-md">sunest.auto@gmail.com</span>
                      </motion.div>
                    </div>
                    <div className="flex items-center gap-5">
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-1.5 drop-shadow-md"
                      >
                        ✨ Free Konsultasi Permasalahan Motor
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-1.5 drop-shadow-md"
                      >
                        🚀 Proses Booking Lebih Mudah
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-1.5 drop-shadow-md"
                      >
                        🎁 Banyak Promo Menarik
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Blur Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={logoImage} alt="YAMAHA" className="h-10 w-auto object-contain opacity-95" />
                  </div>
                  <motion.button
                    onClick={() => setShowMobileMenu(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/90">
                    <Phone className="w-4 h-4" />
                    <span>+62 815-1545-0611</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="w-4 h-4" />
                    <span>sunest.auto@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6">
                <nav className="space-y-2">
                  {[
                    { name: 'Home', href: '#', icon: '🏠' },
                    { name: 'Layanan', href: '#layanan', icon: '⚙️' },
                    { name: 'Fitur', href: '#fitur', icon: '✨' },
                    { name: 'Testimoni', href: '#testimoni', icon: '⭐' },
                    { name: 'Kontak', href: '#kontak', icon: '📞' }
                  ].map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setShowMobileMenu(false)}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </motion.a>
                  ))}
                </nav>

                {/* WhatsApp CTA */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-[#D63031] to-[#E74C3C] hover:from-[#C0392B] hover:to-[#D63031] text-white font-semibold py-6"
                    onClick={() => {
                      setShowWhatsAppChat(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Konsultasi Gratis
                  </Button>
                </motion.div>

                {/* Auth Buttons */}
                {!user && (
                  <motion.div
                    className="mt-6 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => {
                        handleAuthClick('login');
                        setShowMobileMenu(false);
                      }}
                    >
                      Masuk / Daftar
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/10 rounded-full blur-lg"
          animate={{ 
            y: [0, -50, 0],
            rotate: [0, 360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 pt-12 md:pt-16 pb-20 md:pb-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-accent text-white border-0 px-4 py-1.5">
                  Dipercaya Lebih dari 5,000+ Riders
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Servis Motor Aman dengan
                <span className="text-white font-bold"> Transparansi Real-Time</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-200 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Transparansi penuh, teknisi berpengalaman, dan tracking real-time. 
                Bengkel motor modern yang mengutamakan kepuasan Anda.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="bg-[#10B981] hover:bg-[#059669] text-white text-lg px-8 py-6 group"
                  onClick={handleBookNow}
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book Service Sekarang
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur border-white/30 hover:bg-white/20 text-white text-lg px-8 py-6 group"
                  onClick={() => setShowWhatsAppChat(true)}
                >
                  <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Hubungi Kami
                </Button>
              </motion.div>
              
              {/* Stats with Count Animation */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div ref={customers.ref}>
                  <motion.div 
                    className="text-3xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    {customers.count.toLocaleString()}+
                  </motion.div>
                  <div className="text-sm text-gray-200">Pelanggan</div>
                </div>
                <div ref={technicians.ref}>
                  <motion.div 
                    className="text-3xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    {technicians.count}+
                  </motion.div>
                  <div className="text-sm text-gray-200">Teknisi Pro</div>
                </div>
                <div ref={rating.ref}>
                  <motion.div 
                    className="text-3xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    {rating.count}/5
                  </motion.div>
                  <div className="text-sm text-gray-200">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            <InteractiveWorkshopImage />
          </div>
        </div>
      </section>

      {/* Mengapa Booking Lewat YAMAHA Service Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 mb-4">
                Keuntungan
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Booking Lewat YAMAHA Service?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dapatkan pengalaman service motor terbaik dengan berbagai keuntungan eksklusif
              </p>
            </motion.div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* Large Card - Promo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-6 lg:col-span-7 row-span-2"
            >
              <Card className="h-full border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-2xl overflow-hidden group">
                <div className="h-full bg-gradient-to-br from-[#ff7e5f] via-[#ff9a76] to-[#feb47b] p-8 md:p-10 text-white relative">
                  {/* Decorative circles with animation */}
                  <motion.div 
                    className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  />
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="space-y-8">
                      {/* Promo Section */}
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                          Beragam Promo Menarik
                        </h3>
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                          Nikmati layanan servis motor lebih hemat dengan berbagai penawaran khusus dari YAMAHA Service
                        </p>
                        <div className="space-y-3">
                          <motion.div 
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                          >
                            <div className="text-base font-medium">Diskon hingga 30% untuk member baru</div>
                          </motion.div>
                          <motion.div 
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                          >
                            <div className="text-base font-medium">Promo bundling paket service hemat</div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Reminder & History Section */}
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">
                          Pengingat & Riwayat Servis
                        </h3>
                        <p className="text-white/90 leading-relaxed mb-4">
                          Fitur reminder otomatis dan pencatatan riwayat servis detail untuk memudahkan perawatan berkala motor Anda
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div 
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="text-sm font-medium">Reminder Otomatis</div>
                          </motion.div>
                          <motion.div 
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="text-sm font-medium">Histori Lengkap</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Medium Card - Area Coverage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-3 lg:col-span-5"
            >
              <Card className="h-full border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-2xl overflow-hidden group">
                <div className="h-full bg-gradient-to-br from-[#ff7e5f] to-[#ff9a76] p-6 md:p-8 text-white relative">
                  <motion.div 
                    className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">
                      Cakupan Area Luas
                    </h3>
                    <p className="text-white/90 leading-relaxed mb-4">
                      Bengkel rekanan yang tersebar di 3 kota (Jabodetabek, Medan, dan Makassar) lebih dari sekian bengkel!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Jabodetabek</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ delay: 0.05 }}>
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Medan</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1, y: -2 }} transition={{ delay: 0.1 }}>
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Makassar</Badge>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Medium Card - Booking App */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-3 lg:col-span-5"
            >
              <Card className="h-full border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-2xl overflow-hidden group">
                <div className="h-full bg-gradient-to-br from-[#feb47b] to-[#ffc896] p-6 md:p-8 text-white relative">
                  <motion.div 
                    className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">
                      Booking Super Mudah
                    </h3>
                    <p className="text-white/90 leading-relaxed mb-4">
                      Booking servis mudah langsung dari HP atau gadgetmu dan bisa dari mana saja
                    </p>
                    <div className="space-y-2">
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <span className="text-sm font-medium">1. Pilih paket service</span>
                      </motion.div>
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <span className="text-sm font-medium">2. Tentukan jadwal</span>
                      </motion.div>
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                      >
                        <span className="text-sm font-medium">3. Selesai!</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>


          </div>

          {/* CTA Section with Stats - Brand Colors */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-[#ff7e5f] via-[#ff9a76] to-[#feb47b] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Animated Decorative elements */}
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              />
              
              {/* Floating particles */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full"
                animate={{
                  y: [20, -20, 20],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <motion.div
                    className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.6 }}
                    >
                      5,000+
                    </motion.div>
                    <div className="text-white/90 font-medium">Pelanggan Puas</div>
                  </motion.div>
                  <motion.div
                    className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.7 }}
                    >
                      15+
                    </motion.div>
                    <div className="text-white/90 font-medium">Teknisi Profesional</div>
                  </motion.div>
                  <motion.div
                    className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.8 }}
                    >
                      4.9/5
                    </motion.div>
                    <div className="text-white/90 font-medium">Rating Pelanggan</div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 drop-shadow-lg">
                    Siap Merasakan Pengalaman Service Terbaik?
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-gray-50 px-10 py-7 text-lg font-bold group shadow-2xl hover:shadow-3xl transition-all"
                      onClick={() => setShowWhatsAppChat(true)}
                    >
                      <MessageCircle className="w-6 h-6 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                      Booking Sekarang & Dapatkan Promo
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section id="layanan" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 mb-4">
                Paket Service
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pilih Paket Service Terbaik
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dari perawatan cepat hingga service premium, kami punya paket yang sesuai kebutuhan motor Anda
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                className="h-full perspective-1000"
              >
                <Card className={`relative overflow-hidden h-full flex flex-col border-2 transition-all duration-500 group ${
                  pkg.popular 
                    ? 'border-primary shadow-xl shadow-primary/20' 
                    : 'border-gray-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
                }`}>
                  {/* Animated Background Gradient */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.05 }}
                  />
                  
                  {/* Popular Badge with Animation */}
                  {pkg.popular && (
                    <motion.div 
                      className="absolute top-0 right-0 z-10"
                      initial={{ x: 100, rotate: 45 }}
                      animate={{ x: 0, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      <Badge className="bg-accent text-white border-0 rounded-tl-none rounded-br-none shadow-lg">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          ⭐
                        </motion.span>
                        {' '}Populer
                      </Badge>
                    </motion.div>
                  )}
                  
                  <CardHeader className="pb-4 relative z-10">
                    {/* Animated Color Bar */}
                    <motion.div 
                      className={`w-full h-3 rounded-lg bg-gradient-to-r ${pkg.color} mb-6 shadow-sm`}
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                    >
                      <motion.div
                        className="h-full w-full bg-white/30 rounded-lg"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      />
                    </motion.div>
                    
                    <CardTitle className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {pkg.description}
                    </CardDescription>
                    
                    {/* Price with Hover Animation */}
                    <div className="pt-6">
                      <motion.div 
                        className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {pkg.priceLabel}
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col relative z-10">
                    {/* Features List with Stagger Animation */}
                    <div className="space-y-3 flex-1">
                      {pkg.features.map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-start gap-3 group/item"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: index * 0.1 + idx * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ x: 4 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          </motion.div>
                          <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recommendation Box with Gradient Border */}
                    <motion.div 
                      className="relative mt-4 p-4 rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white group-hover:border-primary/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-[2px] py-[22px] mx-[0px] my-[6px] mt-[-15px] mr-[0px] mb-[6px] ml-[0px]" />
                      <p className="text-sm text-gray-700 font-medium relative z-10 flex items-start gap-2">
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                        >
                          👉
                        </motion.span>
                        <span>{pkg.recommendation}</span>
                      </p>
                    </motion.div>
                  </CardContent>

                  {/* Animated Corner Accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${pkg.color} opacity-10 rounded-tr-full`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <p className="text-gray-600 mb-6 text-lg">
                Tidak yakin paket mana yang cocok?
              </p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowWhatsAppChat(true)}
                className="group border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                >
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                </motion.div>
                <span className="font-semibold">Konsultasi Gratis via WhatsApp</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 mb-4">
                Kenapa Pilih Kami
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fitur Unggulan YAMAHA Service
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock className="w-12 h-12 text-primary" />,
                title: "Booking Cepat",
                description: "Reservasi online hanya dalam 60 detik. Pilih waktu sesuai jadwal Anda."
              },
              {
                icon: <Smartphone className="w-12 h-12 text-primary" />,
                title: "Real-Time Tracking",
                description: "Pantau progres service motor Anda secara live dari smartphone."
              },
              {
                icon: <Shield className="w-12 h-12 text-primary" />,
                title: "Garansi 100%",
                description: "Semua pekerjaan dijamin. Tidak puas? Uang kembali."
              },
              {
                icon: <Star className="w-12 h-12 text-primary" />,
                title: "Teknisi Bersertifikat",
                description: "Tim profesional dengan pengalaman 10+ tahun di industri."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Card className="text-center h-full border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <CardContent className="pt-8 pb-8">
                    <motion.div 
                      className="flex justify-center mb-6"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="p-4 bg-primary/10 rounded-2xl">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Auto Scroll */}
      <section id="testimoni" className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 mb-4">
                Testimoni
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Apa Kata Mereka?
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-[380px]"
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring" }}
                      />
                      <div>
                        <div className="font-bold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 mb-4">
                  Hubungi Kami
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Siap Melayani Anda
                </h2>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: "Alamat", content: "Candi, Sidoarjo\nJawa Timur, Indonesia" },
                { icon: Phone, title: "Telepon", content: "+62 815-1545-0611" },
                { icon: Clock, title: "Jam Buka", content: "Senin - Sabtu\n08:00 - 20:00 WIB" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <Card className="text-center border-2 border-gray-200 hover:border-primary transition-all hover:shadow-xl">
                    <CardContent className="pt-8 pb-8">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      </motion.div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-9 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="YAMAHA Logo" className="h-12 w-auto object-contain opacity-90" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Bengkel motor profesional dengan sistem service modern dan transparansi real-time. Melayani segala jenis motor dengan teknisi bersertifikat dan spare part original. Kepuasan pelanggan adalah prioritas kami.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Ciampea, Bogor, Jawa Barat, Indonesia</span>
              </div>
            </div>

            {/* Kontak */}
            <div className="md:col-span-3">
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>sunest.auto@gmail.com</span>
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+62 815-1545-0611</span>
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>@sunest.auto</span>
                </li>
              </ul>
            </div>

            {/* Layanan */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4">Layanan</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#layanan" className="hover:text-primary transition">Paket Service</a></li>
                <li><a href="#fitur" className="hover:text-primary transition">Fitur</a></li>
                <li><a href="#" className="hover:text-primary transition">Booking Online</a></li>
                <li><a href="#testimoni" className="hover:text-primary transition">Testimoni</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2025 YAMAHA Service Center. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-primary" />
              <span>Crafted with ❤️ by PT Sunest Solution</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Buttons - WhatsApp & Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-[#DC2626] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#B91C1C] transition-colors"
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Chat Bubble */}
        <div className="relative">
          <AnimatePresence>
            {showWhatsAppChat && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="absolute bottom-20 right-0 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden mb-2 border-2 border-gray-100"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div 
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <MessageCircle className="w-7 h-7 text-[#25D366]" />
                      </motion.div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <div className="font-bold text-white">YAMAHA Service Team</div>
                      <div className="text-xs text-green-200 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Online - Fast Response
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    onClick={() => setShowWhatsAppChat(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Chat Body */}
                <div className="p-5 bg-gradient-to-b from-[#ECE5DD] to-[#D9D3CC] min-h-[200px] flex flex-col justify-end">
                  <motion.div 
                    className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md mb-3 max-w-[85%]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm text-gray-800 mb-2">
                      Halo! 👋 Selamat datang di <strong>YAMAHA Service Center</strong>
                    </p>
                    <p className="text-sm text-gray-800 mb-2">
                      Ada yang bisa kami bantu? Konsultasi gratis sekarang! 🏍️✨
                    </p>
                    <p className="text-xs text-gray-500">
                      Biasanya membalas dalam beberapa menit
                    </p>
                  </motion.div>

                  {/* Quick Actions */}
                  <div className="space-y-2 mb-3">
                    {['Informasi Paket Service', 'Booking Sekarang', 'Cek Status Service'].map((action, idx) => (
                      <motion.button
                        key={idx}
                        className="w-full bg-white hover:bg-gray-50 text-left px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 transition-colors"
                        onClick={() => {
                          setChatMessage(action);
                          handleSendWhatsAppMessage();
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendWhatsAppMessage()}
                      placeholder="Ketik pesan Anda..."
                      className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#25D366] focus:outline-none text-sm"
                    />
                    <motion.button
                      onClick={handleSendWhatsAppMessage}
                      className="w-12 h-12 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center text-white transition-colors"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="bg-gray-50 px-5 py-3 text-center">
                  <p className="text-xs text-gray-500">
                    Powered by <span className="font-semibold text-[#25D366]">WhatsApp Business</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Floating Button */}
          <motion.button
            className="w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all relative"
            onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.15, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-8 h-8" />
            <motion.span 
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              1
            </motion.span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}