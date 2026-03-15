import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon, Facebook, Instagram, MessageCircle, Globe, QrCode, Image as ImageIcon, Palette, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Generator() {
  const [fb, setFb] = useState('');
  const [ig, setIg] = useState('');
  const [wa, setWa] = useState('');
  const [web, setWeb] = useState('');
  const [qrMode, setQrMode] = useState<'combined' | 'fb' | 'ig' | 'wa' | 'web'>('combined');
  
  const [logoUrl, setLogoUrl] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');

  const [docId, setDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  const formatUrl = (url: string) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const getUrls = () => {
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    let relativeUrl = '';
    let absoluteUrl = '';
    
    switch (qrMode) {
      case 'fb': 
        absoluteUrl = formatUrl(fb); 
        relativeUrl = formatUrl(fb); 
        break;
      case 'ig': 
        absoluteUrl = formatUrl(ig); 
        relativeUrl = formatUrl(ig); 
        break;
      case 'wa': 
        const waUrl = wa ? `https://wa.me/${wa.replace(/\D/g, '')}` : '';
        absoluteUrl = waUrl; 
        relativeUrl = waUrl; 
        break;
      case 'web': 
        absoluteUrl = formatUrl(web); 
        relativeUrl = formatUrl(web); 
        break;
      case 'combined':
      default:
        if (!docId) {
          const params = new URLSearchParams();
          if (fb) params.append('fb', formatUrl(fb));
          if (ig) params.append('ig', formatUrl(ig));
          if (wa) params.append('wa', wa);
          if (web) params.append('web', formatUrl(web));
          
          if (!fb && !ig && !wa && !web) return { absolute: '', relative: '' };
          relativeUrl = `/bio?${params.toString()}`;
          absoluteUrl = `${baseUrl}/#/bio?${params.toString()}`;
        } else {
          relativeUrl = `/bio/${docId}`;
          absoluteUrl = `${baseUrl}/#/bio/${docId}`;
        }
        break;
    }
    
    return {
      absolute: absoluteUrl,
      relative: relativeUrl
    };
  };

  const { absolute: currentAbsoluteUrl, relative: currentRelativeUrl } = getUrls();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const saveLinks = async () => {
    if (!fb && !ig && !wa && !web) {
      alert('الرجاء إدخال رابط واحد على الأقل');
      return;
    }
    
    setIsSaving(true);
    try {
      const data = {
        fb: formatUrl(fb),
        ig: formatUrl(ig),
        wa: wa,
        web: formatUrl(web)
      };

      if (docId) {
        await updateDoc(doc(db, 'links', docId), data);
        alert('تم تحديث البيانات بنجاح!');
      } else {
        const docRef = await addDoc(collection(db, 'links'), {
          ...data,
          createdAt: new Date()
        });
        setDocId(docRef.id);
        alert('تم حفظ البيانات بنجاح!');
      }
    } catch (e: any) {
      console.error(e);
      alert('حدث خطأ أثناء الحفظ: ' + (e.message || 'تأكد من تفعيل Firestore وتحديث قواعد الأمان (Security Rules) لتسمح بالكتابة.'));
    }
    setIsSaving(false);
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_${qrMode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif" dir="ltr">Mr & Mrs Fashion</h1>
          <p className="text-lg text-gray-600">لوحة تحكم إنشاء رموز الاستجابة السريعة (QR Code)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-l border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <LinkIcon className="text-blue-600" />
              إدخال الروابط
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Instagram size={18} className="text-pink-600" />
                  رابط إنستجرام
                </label>
                <input
                  type="url"
                  value={ig}
                  onChange={(e) => setIg(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Facebook size={18} className="text-blue-600" />
                  رابط فيسبوك
                </label>
                <input
                  type="url"
                  value={fb}
                  onChange={(e) => setFb(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MessageCircle size={18} className="text-green-500" />
                  رقم واتساب
                </label>
                <input
                  type="tel"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="مثال: 201xxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Globe size={18} className="text-gray-600" />
                  رابط آخر (موقع، إلخ)
                </label>
                <input
                  type="url"
                  value={web}
                  onChange={(e) => setWeb(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={saveLinks}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {docId ? 'تحديث البيانات في السحابة' : 'حفظ البيانات في السحابة'}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                احفظ البيانات للحصول على رابط QR قصير ونظيف
              </p>
            </div>

            {/* Customization Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Palette className="text-purple-600" />
                تخصيص المظهر
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <ImageIcon size={18} className="text-gray-600" />
                    شعار مخصص للـ QR
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  />
                  {logoUrl && (
                    <button onClick={() => setLogoUrl('')} className="mt-2 text-sm text-red-600 hover:underline">
                      إزالة الشعار
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">لون الخلفية</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm text-gray-500" dir="ltr">{bgColor}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">لون الـ QR</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm text-gray-500" dir="ltr">{fgColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-8 md:w-1/2 bg-gray-50 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">تخصيص الـ QR Code</h2>
            
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setQrMode('combined')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${qrMode === 'combined' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                الصفحة المجمعة
              </button>
              <button
                onClick={() => setQrMode('ig')}
                disabled={!ig}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${qrMode === 'ig' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                إنستجرام
              </button>
              <button
                onClick={() => setQrMode('fb')}
                disabled={!fb}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${qrMode === 'fb' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                فيسبوك
              </button>
              <button
                onClick={() => setQrMode('wa')}
                disabled={!wa}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${qrMode === 'wa' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                واتساب
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6" ref={qrRef}>
              {currentAbsoluteUrl ? (
                <QRCodeCanvas
                  value={currentAbsoluteUrl}
                  size={200}
                  level="H"
                  bgColor={bgColor}
                  fgColor={fgColor}
                  includeMargin={true}
                  imageSettings={logoUrl ? {
                    src: logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                  } : undefined}
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                  <QrCode size={48} />
                </div>
              )}
            </div>

            <button
              onClick={downloadQR}
              disabled={!currentAbsoluteUrl}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              تحميل الـ QR
            </button>
            
            {qrMode === 'combined' && currentRelativeUrl && (
              <Link 
                to={currentRelativeUrl} 
                className="mt-4 text-sm text-blue-600 hover:underline font-medium"
              >
                معاينة الصفحة المجمعة
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
