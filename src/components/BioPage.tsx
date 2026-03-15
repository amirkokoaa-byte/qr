import { useSearchParams, Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Globe, ArrowRight } from 'lucide-react';

export default function BioPage() {
  const [searchParams] = useSearchParams();
  const fb = searchParams.get('fb');
  const ig = searchParams.get('ig');
  const wa = searchParams.get('wa');
  const web = searchParams.get('web');

  const getWhatsAppLink = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fdfbf7] flex flex-col items-center py-16 px-6 relative overflow-hidden">
      <Link to="/" className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-gray-700 hover:bg-white hover:shadow-md transition-all">
        <ArrowRight size={18} />
        <span className="text-sm font-medium">رجوع للوحة التحكم</span>
      </Link>

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#f3e8d5] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#e8d5f3] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">
          <span className="font-serif text-2xl italic">M&M</span>
        </div>

        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-2">
          مرحبا بكم في جميع صفحات التواصل
        </h2>
        
        <h1 className="font-serif text-4xl font-semibold text-black mb-3 text-center" dir="ltr">
          Mr & Mrs Fashion
        </h1>
        
        <p className="text-lg text-gray-700 mb-10 text-center font-medium">
          لأرقى الموديلات والأزياء الحديثة
        </p>

        <div className="w-full space-y-4">
          {ig && (
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Instagram size={24} />
              </div>
              <span className="flex-1 text-center font-semibold text-gray-800 text-lg ml-12">
                إنستجرام
              </span>
            </a>
          )}

          {fb && (
            <a
              href={fb}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1877F2] text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Facebook size={24} />
              </div>
              <span className="flex-1 text-center font-semibold text-gray-800 text-lg ml-12">
                فيسبوك
              </span>
            </a>
          )}

          {wa && (
            <a
              href={getWhatsAppLink(wa)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={24} />
              </div>
              <span className="flex-1 text-center font-semibold text-gray-800 text-lg ml-12">
                واتساب
              </span>
            </a>
          )}

          {web && (
            <a
              href={web}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Globe size={24} />
              </div>
              <span className="flex-1 text-center font-semibold text-gray-800 text-lg ml-12">
                موقعنا
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
