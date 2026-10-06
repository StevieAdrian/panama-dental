import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, MessageCircle, ShieldCheck, Sparkles, X } from 'lucide-react';
import clinicInterior from './assets/clinic-interior.jpg';

const CLINIC_WHATSAPP_NUMBER = ''; // Isi nomor resmi, format internasional tanpa tanda +, contoh: 628123456789

type Category = 'Semua layanan' | 'Estetik' | 'Ortodonti' | 'Restoratif' | 'Bedah minor' | 'Pemeriksaan';
type Service = { title: string; category: Exclude<Category, 'Semua layanan'>; duration: string; description: string; price: string; code: string };

const categories: Category[] = ['Semua layanan', 'Estetik', 'Ortodonti', 'Restoratif', 'Bedah minor', 'Pemeriksaan'];
const services: Service[] = [
  { title: 'Konsultasi & pemeriksaan gigi menyeluruh', category: 'Pemeriksaan', duration: '± 30 menit', description: 'Awali dengan memahami kondisi gigi dan kebutuhan perawatan Anda.', price: 'Rp 200.000', code: '01' },
  { title: 'Scaling & polishing', category: 'Pemeriksaan', duration: '± 45 menit', description: 'Pembersihan karang gigi untuk membantu menjaga kesehatan mulut.', price: 'Rp 400.000', code: '02' },
  { title: 'Professional teeth whitening', category: 'Estetik', duration: '± 60 menit', description: 'Perawatan bleaching profesional untuk senyum yang tampak lebih cerah.', price: 'Rp 3.500.000', code: '03' },
  { title: 'Composite veneer', category: 'Estetik', duration: 'Sesuai konsultasi', description: 'Restorasi estetik langsung dengan komposit, disesuaikan per gigi.', price: 'Rp 800.000 / gigi', code: '04' },
  { title: 'Clear aligner', category: 'Ortodonti', duration: 'Sesuai rencana perawatan', description: 'Perawatan ortodonti dengan aligner transparan yang dapat dilepas.', price: 'Mulai Rp 15.000.000', code: '05' },
  { title: 'Tambal gigi & restorasi', category: 'Restoratif', duration: '± 30–60 menit', description: 'Mengembalikan bentuk dan fungsi gigi melalui perawatan restoratif.', price: 'Setelah pemeriksaan', code: '06' },
  { title: 'Mahkota gigi (crown)', category: 'Restoratif', duration: 'Sesuai konsultasi', description: 'Pilihan restorasi untuk membantu melindungi dan menguatkan gigi.', price: 'Setelah pemeriksaan', code: '07' },
  { title: 'Konsultasi bedah mulut minor', category: 'Bedah minor', duration: 'Sesuai konsultasi', description: 'Evaluasi awal dan rencana tindakan berdasarkan kondisi klinis.', price: 'Setelah pemeriksaan', code: '08' },
];

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const sessions = ['Pagi', 'Siang', 'Sore'];
const formatDate = (date: Date) => new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Semua layanan');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingState, setBookingState] = useState<'form' | 'fallback' | 'sent'>('form');
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredServices = useMemo(
    () => services.filter((service) => activeCategory === 'Semua layanan' || service.category === activeCategory),
    [activeCategory],
  );
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return { value: date.toISOString().slice(0, 10), label: formatDate(date) };
  }), []);

  function openBooking(service?: string) {
    setSelectedService(service ?? '');
    setStep(1);
    setBookingState('form');
    setDrawerOpen(true);
  }
  function closeBooking() {
    setDrawerOpen(false);
    setCopied(false);
  }
  function submitBooking() {
    if (!patientName.trim() || !patientPhone.trim() || !selectedDate || !selectedTime || !selectedService) return;
    if (!CLINIC_WHATSAPP_NUMBER) {
      setBookingState('fallback');
      return;
    }
    const message = encodeURIComponent(`Halo Panama Dental Care, saya ingin membuat janji konsultasi.\n\nNama: ${patientName}\nWhatsApp: ${patientPhone}\nLayanan: ${selectedService}\nTanggal: ${selectedDate}\nSesi: ${selectedTime}\n\nMohon konfirmasi ketersediaan jadwal. Terima kasih.`);
    window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
    setBookingState('sent');
  }
  const bookingText = `Halo Panama Dental Care, saya ingin membuat janji konsultasi.\nNama: ${patientName}\nWhatsApp: ${patientPhone}\nLayanan: ${selectedService}\nTanggal: ${selectedDate}\nSesi: ${selectedTime}`;
  async function copyBookingText() {
    try {
      await navigator.clipboard.writeText(bookingText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="site-shell min-h-[100dvh] bg-[#F8F6F0] text-[#1B262C]">
      <header className="relative z-20 border-b border-[#E4E0D5] bg-[#F8F6F0]">
        <div className="section-wrap flex h-[76px] items-center justify-between">
          <a href="#home" className="flex items-center gap-3" aria-label="Panama Dental Care beranda">
            <span className="grid h-10 w-10 place-items-center border border-[#C5A059] text-[#C5A059]"><span className="serif text-[26px] leading-none">P</span></span>
            <span className="leading-tight"><span className="block text-[11px] font-bold tracking-[.17em]">PANAMA</span><span className="mt-1 block text-[8px] tracking-[.19em] text-[#5C6B73]">DENTAL CARE</span></span>
          </a>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Navigasi utama">
            <a className="text-[11px] tracking-wide text-[#5C6B73] transition-colors hover:text-[#1B262C]" href="#layanan">Layanan</a>
            <a className="text-[11px] tracking-wide text-[#5C6B73] transition-colors hover:text-[#1B262C]" href="#tentang">Tentang klinik</a>
            <a className="text-[11px] tracking-wide text-[#5C6B73] transition-colors hover:text-[#1B262C]" href="#lokasi">Lokasi & jam</a>
            <button data-testid="header-booking-cta" onClick={() => openBooking()} className="flex items-center gap-2 border border-[#1B262C] px-5 py-3 text-[10px] font-semibold tracking-[.08em] transition-colors hover:bg-[#1B262C] hover:text-white">RESERVASI <ArrowUpRight size={14} /></button>
          </nav>
          <button data-testid="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="grid h-10 w-10 place-items-center border border-[#E4E0D5] md:hidden" aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}>{mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {mobileMenuOpen && <nav className="absolute left-0 right-0 top-full border-b border-[#E4E0D5] bg-[#F8F6F0] px-6 py-5 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm">
            <a onClick={() => setMobileMenuOpen(false)} href="#layanan">Layanan</a><a onClick={() => setMobileMenuOpen(false)} href="#tentang">Tentang klinik</a><a onClick={() => setMobileMenuOpen(false)} href="#lokasi">Lokasi & jam</a>
            <button onClick={() => { setMobileMenuOpen(false); openBooking(); }} className="mt-2 flex items-center justify-center gap-2 bg-[#1B262C] py-3 text-white">Reservasi konsultasi <ArrowRight size={15} /></button>
          </div>
        </nav>}
      </header>

      <main>
        <section id="home" className="relative">
          <div className="section-wrap grid min-h-[650px] items-center gap-10 py-14 md:grid-cols-[.92fr_1.08fr] md:py-20">
            <div className="relative z-10 reveal">
              <p className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-8 bg-[#C5A059]" /> Perawatan gigi, dengan lebih tenang</p>
              <h1 className="serif max-w-[590px] text-[58px] font-medium leading-[.94] tracking-[-.035em] sm:text-[72px] lg:text-[84px]">Senyum sehat,<br /><span className="text-[#A98543]">dirawat dengan</span><br />presisi dan perhatian.</h1>
              <p className="mt-7 max-w-[420px] text-[13px] leading-7 text-[#5C6B73] sm:text-sm">Klinik gigi premium di Mampang Prapatan, Jakarta Selatan, menghadirkan perawatan estetik dan restoratif berstandar tinggi dengan teknologi modern.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button data-testid="hero-booking-cta" onClick={() => openBooking()} className="group flex items-center gap-4 bg-[#1B262C] px-6 py-4 text-[11px] font-semibold tracking-wide text-white transition-colors hover:bg-[#34454c]">Reservasi Konsultasi <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} /></button>
                <a data-testid="hero-services-link" href="#layanan" className="flex items-center gap-2 px-2 py-3 text-[11px] font-semibold text-[#1B262C]">Jelajahi layanan <ArrowDown size={14} className="text-[#C5A059]" /></a>
              </div>
              <div className="mt-12 flex items-center gap-6 border-t border-[#E4E0D5] pt-5 text-[10px] tracking-wide text-[#5C6B73]">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#C5A059]" /> Pendekatan personal</span><span className="h-4 w-px bg-[#E4E0D5]" /><span className="flex items-center gap-2"><Sparkles size={14} className="text-[#C5A059]" /> Estetik & restoratif</span>
              </div>
            </div>
            <div className="relative reveal delay-1">
              <div className="absolute -right-4 -top-4 h-24 w-24 border-r border-t border-[#C5A059] sm:-right-7 sm:-top-7" />
              <div className="relative aspect-[.95] overflow-hidden bg-[#e9e5db] sm:aspect-[1.08]">
                <img data-testid="clinic-hero-image" src={clinicInterior} alt="Interior klinik gigi Panama Dental Care yang hangat dan modern" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B262C]/30 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7">
                  <div><p className="text-[9px] tracking-[.2em] text-white/75">RUANG UNTUK MERASA NYAMAN</p><p className="serif mt-1 text-[27px] leading-tight sm:text-[34px]">Perawatan yang terasa berbeda.</p></div><span className="mb-1 grid h-10 w-10 place-items-center border border-white/60"><ArrowUpRight size={16} /></span>
                </div>
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 border border-[#E4E0D5] bg-[#F8F6F0] px-4 py-3 sm:-left-9 sm:bottom-8">
                <span className="grid h-8 w-8 place-items-center bg-[#EAE4D6] text-[#A98543]"><MapPin size={15} /></span><span><span className="block text-[8px] tracking-[.16em] text-[#5C6B73]">BERLOKASI DI</span><span className="mt-1 block text-[11px] font-semibold">Mampang Prapatan, Jakarta Selatan</span></span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E4E0D5]" />
        </section>

        <section id="tentang" className="section-wrap grid gap-12 py-24 md:grid-cols-[.75fr_1.25fr] md:gap-20 md:py-32">
          <div className="reveal">
            <p className="eyebrow">Klinik & pendekatan</p>
            <h2 className="serif mt-5 max-w-sm text-[47px] leading-[.99] sm:text-[58px]">Perhatian pada detail. <span className="text-[#A98543]">Kenyamanan di setiap langkah.</span></h2>
          </div>
          <div className="reveal delay-1 md:pt-10">
            <p className="max-w-[650px] text-[14px] leading-8 text-[#5C6B73]">Kami percaya perawatan gigi yang baik dimulai dari mendengarkan. Setiap rencana perawatan berangkat dari kebutuhan dan kondisi Anda—dengan penjelasan yang jernih, perhatian pada detail, dan pendekatan yang mengutamakan kenyamanan.</p>
            <div className="mt-10 grid grid-cols-1 border-y border-[#E4E0D5] sm:grid-cols-3">
              <div className="border-b border-[#E4E0D5] py-5 sm:border-b-0 sm:border-r sm:pr-4"><span className="serif text-[34px] text-[#A98543]">01</span><p className="mt-2 text-[11px] font-semibold">Dengarkan dahulu</p><p className="mt-2 text-[10px] leading-5 text-[#5C6B73]">Kami memahami tujuan dan kekhawatiran Anda.</p></div>
              <div className="border-b border-[#E4E0D5] py-5 sm:border-b-0 sm:border-r sm:px-5"><span className="serif text-[34px] text-[#A98543]">02</span><p className="mt-2 text-[11px] font-semibold">Rencana yang jelas</p><p className="mt-2 text-[10px] leading-5 text-[#5C6B73]">Pilihan perawatan dijelaskan dengan transparan.</p></div>
              <div className="py-5 sm:pl-5"><span className="serif text-[34px] text-[#A98543]">03</span><p className="mt-2 text-[11px] font-semibold">Rawat dengan teliti</p><p className="mt-2 text-[10px] leading-5 text-[#5C6B73]">Fokus pada kualitas dan kenyamanan perawatan.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-[#1B262C] text-[#F8F6F0]">
          <div className="section-wrap grid gap-10 py-16 md:grid-cols-[.85fr_1.15fr] md:items-center md:py-20">
            <div className="reveal"><p className="eyebrow">Keahlian klinis</p><h2 className="serif mt-5 max-w-[430px] text-[48px] leading-[.98] sm:text-[60px]">Beragam kebutuhan, <span className="text-[#C5A059]">satu perhatian penuh.</span></h2></div>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {[
                ['Aesthetic dentistry', 'Veneer komposit & bleaching'],
                ['Ortodonti', 'Clear aligner & evaluasi susunan gigi'],
                ['Restoratif', 'Tambal gigi & mahkota gigi'],
                ['Kesehatan gigi umum', 'Pemeriksaan, scaling & polishing'],
              ].map(([name, sub], index) => <div key={name} className="flex gap-4 border-b border-white/15 py-5">
                <span className="serif text-[23px] text-[#C5A059]">0{index + 1}</span><div><h3 className="text-[12px] font-semibold">{name}</h3><p className="mt-1.5 text-[10px] leading-5 text-white/60">{sub}</p></div>
              </div>)}
            </div>
            <p className="text-[10px] leading-5 text-white/50 md:col-start-2">Tim dokter gigi dengan fokus pada perawatan estetik dan restoratif. Nama dan profil dokter dapat ditambahkan setelah dikonfirmasi oleh klinik.</p>
          </div>
        </section>

        <section id="layanan" className="section-wrap py-24 md:py-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><p className="eyebrow">Menu perawatan</p><h2 className="serif mt-4 text-[52px] leading-none sm:text-[64px]">Layanan kami<span className="text-[#C5A059]">.</span></h2><p className="mt-4 max-w-md text-[12px] leading-6 text-[#5C6B73]">Temukan perawatan yang sesuai. Harga awal ditampilkan secara transparan; beberapa tindakan memerlukan pemeriksaan terlebih dahulu.</p></div>
            <button onClick={() => openBooking()} data-testid="services-booking-cta" className="flex items-center gap-2 self-start border-b border-[#C5A059] pb-2 text-[11px] font-semibold md:self-auto">Tanya tentang perawatan <ArrowUpRight size={14} className="text-[#A98543]" /></button>
          </div>
          <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#E4E0D5] pb-0" role="tablist" aria-label="Filter kategori layanan">
            {categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} data-testid={`category-${category}`} onClick={() => setActiveCategory(category)} className={`shrink-0 border-b-2 px-4 pb-3 text-[10px] font-semibold transition-colors ${activeCategory === category ? 'border-[#C5A059] text-[#1B262C]' : 'border-transparent text-[#7A8588] hover:text-[#1B262C]'}`}>{category}</button>)}
          </div>
          <div data-testid="service-list" className="grid grid-cols-1 sm:grid-cols-2">
            {filteredServices.map((service) => <article key={service.code} data-testid={`service-card-${service.code}`} className="service-card group relative flex min-h-[210px] flex-col justify-between border-b border-[#E4E0D5] py-6 sm:min-h-[230px] sm:pr-8 sm:even:pl-8 sm:odd:border-r">
              <div className="flex items-start justify-between gap-4"><span className="text-[9px] tracking-[.14em] text-[#A98543]">PERAWATAN {service.code}</span><span className="border border-[#E4E0D5] px-2.5 py-1 text-[8px] text-[#5C6B73]">{service.category}</span></div>
              <div className="mt-7"><h3 className="serif text-[28px] leading-[1.05] sm:text-[31px]">{service.title}</h3><p className="mt-2 max-w-[380px] text-[10px] leading-5 text-[#5C6B73]">{service.description}</p></div>
              <div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] text-[#7D8789]">{service.duration}</p><p className="mt-1 text-[12px] font-semibold">{service.price}</p></div><button data-testid={`book-service-${service.code}`} onClick={() => openBooking(service.title)} aria-label={`Reservasi ${service.title}`} className="service-arrow grid h-9 w-9 place-items-center border border-[#E4E0D5] text-[#1B262C] hover:border-[#C5A059] hover:text-[#A98543]"><ArrowRight size={15} /></button></div>
            </article>)}
          </div>
          {filteredServices.length === 0 && <div className="border-b border-[#E4E0D5] py-14 text-center text-sm text-[#5C6B73]">Belum ada layanan pada kategori ini.</div>}
          <p className="mt-5 text-[9px] leading-5 text-[#7A8588]">Harga dapat berubah sesuai hasil konsultasi dan kondisi klinis. Tindakan yang ditandai “setelah pemeriksaan” akan dijelaskan lebih lanjut oleh tim klinik.</p>
        </section>

        <section id="lokasi" className="border-y border-[#E4E0D5] bg-[#F0EDE5]">
          <div className="section-wrap grid gap-9 py-20 md:grid-cols-[.85fr_1.15fr] md:py-28">
            <div className="reveal">
              <p className="eyebrow">Kunjungi kami</p><h2 className="serif mt-4 text-[50px] leading-[.98] sm:text-[60px]">Di <span className="text-[#A98543]">Mampang Prapatan.</span></h2>
              <p className="mt-5 max-w-sm text-[12px] leading-6 text-[#5C6B73]">Panama Dental Care berada di Jl. Tegal Parang Sel. No.1, Mampang Prapatan, Jakarta Selatan. Silakan gunakan peta untuk petunjuk arah menuju klinik.</p>
              <div className="mt-8 space-y-5 border-t border-[#DCD7CB] pt-6">
                <div className="flex gap-4"><MapPin size={16} className="mt-0.5 shrink-0 text-[#A98543]" /><div><p className="text-[11px] font-semibold">Lokasi klinik</p><p className="mt-1 text-[10px] leading-5 text-[#5C6B73]">Jl. Tegal Parang Sel. No.1, RT.6/RW.7, Tegal Parang,<br />Kec. Mampang Prpt., Jakarta Selatan,<br />Daerah Khusus Ibukota Jakarta 12790</p></div></div>
                <div className="flex gap-4"><MessageCircle size={16} className="mt-0.5 shrink-0 text-[#A98543]" /><div><p className="text-[11px] font-semibold">Informasi & reservasi</p><p className="mt-1 text-[10px] leading-5 text-[#5C6B73]">Nomor WhatsApp resmi belum tersedia.<br />Gunakan formulir reservasi untuk menyiapkan pesan.</p></div></div>
                <a href="https://www.google.com/maps/place/Panama+Dental+Care+%7C+Praktik+Dokter+Gigi/@-6.2486575,106.8316791,17z" target="_blank" rel="noreferrer" data-testid="map-directions-link" className="inline-flex items-center gap-2 border-b border-[#C5A059] pb-1 text-[10px] font-semibold">Lihat lokasi di Google Maps <ArrowUpRight size={13} /></a>
              </div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden border border-[#DCD7CB] bg-[#E4E0D5] md:min-h-[460px]">
              <iframe title="Peta lokasi Panama Dental Care, Mampang Prapatan, Jakarta Selatan" data-testid="location-map" className="absolute inset-0 h-full w-full grayscale-[.65] contrast-[.9]" loading="lazy" src="https://maps.google.com/maps?q=Panama%20Dental%20Care%2C%20Jl.%20Tegal%20Parang%20Sel.%20No.1%2C%20Jakarta%2012790&t=&z=16&ie=UTF8&iwloc=&output=embed" />
              <div className="absolute bottom-4 left-4 max-w-[220px] border border-[#E4E0D5] bg-[#F8F6F0] px-4 py-3">
                <p className="text-[8px] tracking-[.15em] text-[#A98543]">LOKASI KLINIK</p><p className="mt-1 text-[11px] font-semibold">Mampang Prapatan, Jakarta Selatan</p><p className="mt-1 text-[9px] text-[#5C6B73]">Jl. Tegal Parang Sel. No.1 · Jakarta 12790</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap grid gap-12 py-20 md:grid-cols-[.75fr_1.25fr] md:py-28">
          <div><p className="eyebrow">Waktu kunjungan</p><h2 className="serif mt-4 text-[48px] leading-none sm:text-[58px]">Jam operasional<span className="text-[#C5A059]">.</span></h2><p className="mt-4 max-w-xs text-[11px] leading-6 text-[#5C6B73]">Silakan konfirmasi jam praktik dan ketersediaan jadwal sebelum berkunjung.</p></div>
          <div data-testid="hours-grid" className="border-t border-[#E4E0D5]">
            {days.map((day, index) => <div key={day} className="flex items-center justify-between border-b border-[#E4E0D5] py-4"><span className="flex items-center gap-3 text-[11px] font-medium"><span className="serif w-5 text-[17px] text-[#A98543]">0{index + 1}</span>{day}</span><span className="text-[10px] text-[#5C6B73]">Jam praktik dikonfirmasi</span></div>)}
            <p className="mt-4 text-[9px] leading-5 text-[#7A8588]">Jam harian belum dipublikasikan. Detail yang terkonfirmasi dapat ditambahkan di sini oleh klinik.</p>
          </div>
        </section>
      </main>

      <footer className="bg-[#1B262C] text-[#F8F6F0]">
        <div className="section-wrap">
          <div className="grid gap-10 py-12 md:grid-cols-[1.3fr_.7fr_.8fr] md:py-16">
            <div><a href="#home" className="inline-flex items-center gap-3"><span className="grid h-10 w-10 place-items-center border border-[#C5A059] text-[#C5A059]"><span className="serif text-[26px]">P</span></span><span><span className="block text-[11px] font-bold tracking-[.17em]">PANAMA</span><span className="mt-1 block text-[8px] tracking-[.19em] text-white/55">DENTAL CARE</span></span></a><p className="mt-5 max-w-xs text-[10px] leading-6 text-white/55">Perawatan gigi estetik dan restoratif di Mampang Prapatan, Jakarta Selatan. Kami hadir untuk membantu Anda merasa lebih nyaman merawat senyum.</p></div>
            <div><p className="eyebrow">Jelajahi</p><div className="mt-5 flex flex-col gap-3 text-[10px] text-white/70"><a href="#layanan" className="hover:text-white">Layanan perawatan</a><a href="#tentang" className="hover:text-white">Tentang klinik</a><a href="#lokasi" className="hover:text-white">Lokasi & jam</a></div></div>
            <div><p className="eyebrow">Buat janji</p><p className="mt-5 text-[10px] leading-5 text-white/60">Mulai dengan memilih layanan dan waktu yang Anda inginkan.</p><button data-testid="footer-booking-cta" onClick={() => openBooking()} className="mt-4 inline-flex items-center gap-2 border border-white/35 px-4 py-3 text-[10px] hover:border-[#C5A059]">Reservasi konsultasi <ArrowRight size={13} /></button></div>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/15 py-5 text-[9px] text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Panama Dental Care. Powered by HokiDev Healthcare Solutions.</span><span>Mampang Prapatan · Jakarta Selatan</span></div>
        </div>
      </footer>

      <button data-testid="persistent-booking-cta" onClick={() => openBooking()} className="fixed bottom-5 right-5 z-30 flex items-center gap-3 bg-[#C5A059] px-5 py-4 text-[10px] font-bold tracking-[.04em] text-[#1B262C] transition-colors hover:bg-[#d2b16f] sm:bottom-7 sm:right-7"><MessageCircle size={16} /> <span className="hidden sm:inline">BOOK APPOINTMENT / </span>Tanya Dokter</button>

      {drawerOpen && <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
        <button className="fade-in absolute inset-0 cursor-default bg-[#1B262C]/55" aria-label="Tutup formulir reservasi" onClick={closeBooking} />
        <aside data-testid="appointment-drawer" role="dialog" aria-modal="true" aria-labelledby="booking-title" className="drawer-enter relative flex h-full w-full max-w-[500px] flex-col bg-[#F8F6F0]">
          <div className="flex items-center justify-between border-b border-[#E4E0D5] px-6 py-5 sm:px-8">
            <div><p className="eyebrow">Panama Dental Care</p><p className="mt-1 text-[10px] text-[#5C6B73]">Reservasi konsultasi</p></div>
            <button onClick={closeBooking} data-testid="close-booking-drawer" className="grid h-10 w-10 place-items-center border border-[#E4E0D5]" aria-label="Tutup"><X size={17} /></button>
          </div>
          {bookingState === 'form' ? <>
            <div className="flex gap-2 px-6 pt-6 sm:px-8">
              {[1, 2, 3].map((item) => <div key={item} className="flex flex-1 items-center gap-2"><span className={`grid h-7 w-7 shrink-0 place-items-center text-[10px] ${step >= item ? 'bg-[#1B262C] text-white' : 'border border-[#D6D1C5] text-[#748084]'}`}>{step > item ? <Check size={13} /> : `0${item}`}</span><span className={`hidden text-[9px] sm:block ${step === item ? 'font-semibold text-[#1B262C]' : 'text-[#879093]'}`}>{item === 1 ? 'Layanan' : item === 2 ? 'Jadwal' : 'Data diri'}</span>{item < 3 && <span className="h-px flex-1 bg-[#E4E0D5]" />}</div>)}
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-8 sm:px-8">
              <p className="eyebrow">Langkah 0{step} dari 03</p>
              <h2 id="booking-title" className="serif mt-3 text-[42px] leading-none">{step === 1 ? 'Pilih perawatan.' : step === 2 ? 'Pilih waktu.' : 'Sedikit tentang Anda.'}</h2>
              <p className="mt-3 text-[11px] leading-5 text-[#5C6B73]">{step === 1 ? 'Apa yang ingin Anda konsultasikan? Pilih layanan yang paling sesuai.' : step === 2 ? 'Pilih tanggal dan sesi kunjungan pilihan Anda. Jadwal akan dikonfirmasi klinik.' : 'Isi detail agar tim kami dapat menindaklanjuti permintaan Anda.'}</p>
              {step === 1 && <div className="mt-7 space-y-2">
                {services.map((service) => <button key={service.code} data-testid={`booking-service-${service.code}`} onClick={() => setSelectedService(service.title)} className={`flex w-full items-center justify-between gap-4 border px-4 py-4 text-left transition-colors ${selectedService === service.title ? 'border-[#C5A059] bg-[#F1EBDD]' : 'border-[#E4E0D5] bg-white hover:border-[#C5A059]'}`}><span><span className="block text-[11px] font-semibold">{service.title}</span><span className="mt-1 block text-[9px] text-[#687579]">{service.category} · {service.price}</span></span><span className={`h-4 w-4 shrink-0 rounded-full border ${selectedService === service.title ? 'border-[5px] border-[#C5A059]' : 'border-[#C9C7BF]'}`} /></button>)}
              </div>}
              {step === 2 && <div className="mt-8">
                <p className="mb-3 text-[10px] font-semibold">Pilih tanggal</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{dates.map((date) => <button key={date.value} data-testid={`booking-date-${date.value}`} onClick={() => setSelectedDate(date.value)} className={`border px-3 py-3 text-[10px] transition-colors ${selectedDate === date.value ? 'border-[#C5A059] bg-[#F1EBDD] font-semibold' : 'border-[#E4E0D5] bg-white hover:border-[#C5A059]'}`}>{date.label}</button>)}</div>
                <p className="mb-3 mt-8 text-[10px] font-semibold">Pilih sesi waktu</p>
                <div className="grid grid-cols-3 gap-2">{sessions.map((session) => <button key={session} data-testid={`booking-session-${session}`} onClick={() => setSelectedTime(session)} className={`flex items-center justify-center gap-2 border px-2 py-3 text-[10px] ${selectedTime === session ? 'border-[#C5A059] bg-[#F1EBDD] font-semibold' : 'border-[#E4E0D5] bg-white hover:border-[#C5A059]'}`}><Clock3 size={13} />{session}</button>)}</div>
                <p className="mt-4 text-[9px] leading-5 text-[#778286]">Pilihan sesi belum mewakili jam praktik tertentu. Klinik akan mengonfirmasi waktu yang tersedia.</p>
              </div>}
              {step === 3 && <div className="mt-8 space-y-5">
                <label className="block"><span className="mb-2 block text-[10px] font-semibold">Nama lengkap</span><input data-testid="patient-name-input" value={patientName} onChange={(event) => setPatientName(event.target.value)} type="text" autoComplete="name" placeholder="Nama Anda" className="h-12 w-full border border-[#DCD7CB] bg-white px-4 text-[12px] outline-none placeholder:text-[#A0A8A7] focus:border-[#C5A059]" /></label>
                <label className="block"><span className="mb-2 block text-[10px] font-semibold">Nomor WhatsApp</span><input data-testid="patient-phone-input" value={patientPhone} onChange={(event) => setPatientPhone(event.target.value)} type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" className="h-12 w-full border border-[#DCD7CB] bg-white px-4 text-[12px] outline-none placeholder:text-[#A0A8A7] focus:border-[#C5A059]" /></label>
                <div className="border border-[#E4E0D5] bg-[#F0EDE5] p-4 text-[10px] leading-5 text-[#5C6B73]"><span className="font-semibold text-[#1B262C]">Ringkasan pilihan</span><br />{selectedService}<br />{selectedDate} · Sesi {selectedTime}</div>
                <p className="text-[9px] leading-5 text-[#7A8588]">Data ini hanya digunakan untuk menyiapkan permintaan reservasi di perangkat Anda. Pengiriman WhatsApp memerlukan nomor resmi klinik.</p>
              </div>}
            </div>
            <div className="border-t border-[#E4E0D5] bg-[#F8F6F0] px-6 py-5 sm:px-8">
              <div className="flex gap-3">
                {step > 1 && <button data-testid="booking-back" onClick={() => setStep(step - 1)} className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#DCD7CB]" aria-label="Kembali"><ChevronLeft size={17} /></button>}
                {step < 3 ? <button data-testid="booking-next" disabled={step === 1 ? !selectedService : !selectedDate || !selectedTime} onClick={() => setStep(step + 1)} className="flex h-12 flex-1 items-center justify-center gap-3 bg-[#1B262C] text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Lanjutkan <ChevronRight size={15} /></button> : <button data-testid="booking-submit" disabled={!patientName.trim() || !patientPhone.trim()} onClick={submitBooking} className="flex h-12 flex-1 items-center justify-center gap-3 bg-[#1B262C] text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Siapkan permintaan <ArrowRight size={15} /></button>}
              </div>
            </div>
          </> : <div className="flex flex-1 flex-col items-center justify-center px-7 text-center sm:px-12">
            <div className="grid h-14 w-14 place-items-center border border-[#C5A059] text-[#A98543]">{bookingState === 'sent' ? <Check size={23} /> : <MessageCircle size={22} />}</div>
            <p className="eyebrow mt-7">{bookingState === 'sent' ? 'Permintaan disiapkan' : 'Satu langkah lagi'}</p>
            <h2 id="booking-title" className="serif mt-3 text-[42px] leading-[.98]">{bookingState === 'sent' ? 'Silakan lanjutkan percakapan.' : 'Nomor resmi belum tersedia.'}</h2>
            <p className="mt-4 max-w-sm text-[11px] leading-6 text-[#5C6B73]">{bookingState === 'sent' ? 'WhatsApp telah dibuka dengan detail permintaan Anda. Jadwal akan dikonfirmasi langsung oleh tim klinik.' : 'Kami belum dapat mengirim reservasi karena nomor WhatsApp resmi Panama Dental Care belum dikonfigurasi. Permintaan Anda tidak dikirim. Salin pesan di bawah dan kirim setelah menghubungi kanal resmi klinik.'}</p>
            {bookingState === 'fallback' && <div className="mt-6 w-full border border-[#E4E0D5] bg-white p-4 text-left"><p className="whitespace-pre-line text-[10px] leading-6 text-[#5C6B73]">{bookingText}</p><button data-testid="copy-booking-message" onClick={copyBookingText} className="mt-4 flex items-center gap-2 border-b border-[#C5A059] pb-1 text-[10px] font-semibold">{copied ? <><Check size={13} /> Pesan tersalin</> : <><MessageCircle size={13} /> Salin detail permintaan</>}</button></div>}
            <button data-testid="booking-done" onClick={closeBooking} className="mt-8 w-full bg-[#1B262C] py-4 text-[11px] font-semibold text-white">Selesai</button>
            <button data-testid="booking-edit-details" onClick={() => { setBookingState('form'); setStep(3); }} className="mt-4 text-[10px] text-[#5C6B73] underline underline-offset-4">Ubah detail permintaan</button>
          </div>}
        </aside>
      </div>}
    </div>
  );
}

export default App;