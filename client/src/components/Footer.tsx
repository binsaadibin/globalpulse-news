import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin, MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const translations = {
  en: {
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    categories: 'Categories',
    politics: 'Politics',
    business: 'Business',
    technology: 'Technology',
    sports: 'Sports',
    copyright: '© 2024 GlobalPulse News. All rights reserved.',
    
    // Contact Popup
    contactUs: 'Contact Us',
    getInTouch: 'Get in Touch',
    contactDesc: 'Have questions or feedback? We\'d love to hear from you.',
    name: 'Your Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email',
    message: 'Message',
    messagePlaceholder: 'Type your message here...',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message Sent!',
    messageSuccess: 'Thank you for your message. We\'ll get back to you soon.',
    close: 'Close',
    
    // Contact Info
    emailUs: 'Email Us',
    callUs: 'Call Us',
    visitUs: 'Visit Us',
    chatSupport: 'Chat Support',
    supportEmail: 'support@globalpulse.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 News Street, Media City, MC 12345'
  },
  ar: {
    about: 'معلومات عنا',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    categories: 'الفئات',
    politics: 'سياسة',
    business: 'أعمال',
    technology: 'تكنولوجيا',
    sports: 'رياضة',
    copyright: '© 2024 جلوبال بالس نيوز. جميع الحقوق محفوظة.',
    
    contactUs: 'اتصل بنا',
    getInTouch: 'ابق على تواصل',
    contactDesc: 'هل لديك أسئلة أو ملاحظات؟ نحن نحب أن نسمع منك.',
    name: 'اسمك',
    namePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    message: 'الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    sendMessage: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    messageSent: 'تم إرسال الرسالة!',
    messageSuccess: 'شكراً على رسالتك. سنرد عليك قريباً.',
    close: 'إغلاق',
    
    emailUs: 'راسلنا',
    callUs: 'اتصل بنا',
    visitUs: 'زورنا',
    chatSupport: 'الدردشة',
    supportEmail: 'support@globalpulse.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 شارع الأخبار، مدينة الإعلام، 12345'
  },
  ur: {
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    privacy: 'رازداری کی پالیسی',
    terms: 'سروس کی شرائط',
    categories: 'زمرے',
    politics: 'سیاست',
    business: 'کاروبار',
    technology: 'ٹیکنالوجی',
    sports: 'کھیل',
    copyright: '© 2024 گلوبل پلس نیوز۔ تمام حقوق محفوظ ہیں۔',
    
    contactUs: 'رابطہ کریں',
    getInTouch: 'رابطے میں رہیں',
    contactDesc: 'سوالات یا فیڈ بیک ہے؟ ہم آپ سے سننا پسند کریں گے۔',
    name: 'آپ کا نام',
    namePlaceholder: 'اپنا پورا نام درج کریں',
    email: 'ای میل ایڈریس',
    emailPlaceholder: 'اپنا ای میل درج کریں',
    message: 'پیغام',
    messagePlaceholder: 'اپنا پیغام یہاں لکھیں...',
    sendMessage: 'پیغام بھیجیں',
    sending: 'بھیجا جا رہا ہے...',
    messageSent: 'پیغام بھیج دیا گیا!',
    messageSuccess: 'آپ کے پیغام کا شکریہ۔ ہم جلد آپ کو جواب دیں گے۔',
    close: 'بند کریں',
    
    emailUs: 'ہمیں ای میل کریں',
    callUs: 'ہمیں کال کریں',
    visitUs: 'ہمیں ملنے آئیں',
    chatSupport: 'چیٹ سپورٹ',
    supportEmail: 'support@globalpulse.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 نیوز سٹریٹ، میڈیا سٹی، ایم سی 12345'
  },
};

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const [contactOpen, setContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t.emailUs,
      detail: t.supportEmail,
      action: () => window.open(`mailto:${t.supportEmail}`)
    },
    {
      icon: Phone,
      title: t.callUs,
      detail: t.phoneNumber,
      action: () => window.open(`tel:${t.phoneNumber}`)
    },
    {
      icon: MapPin,
      title: t.visitUs,
      detail: t.address,
      action: () => window.open('https://maps.google.com')
    }
  ];

  return (
    <>
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t.about}</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors" 
                    data-testid="link-about"
                  >
                    {t.about}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setContactOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors" 
                    data-testid="link-contact"
                  >
                    {t.contact}
                  </button>
                </li>
              </ul>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t.categories}</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-politics">
                    {t.politics}
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-business">
                    {t.business}
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-technology">
                    {t.technology}
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-sports">
                    {t.sports}
                  </button>
                </li>
              </ul>
            </div>

            {/* Privacy Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t.privacy}</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                    {t.privacy}
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                    {t.terms}
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">Social</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-facebook">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-youtube">
                  <Youtube className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-md" data-testid="link-instagram">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Contact Button */}
              <Button 
                onClick={() => setContactOpen(true)}
                className="w-full mt-4"
                variant="outline"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {t.contact}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            {t.copyright}
          </div>
        </div>
      </footer>

      {/* Contact Popup */}
      {contactOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setContactOpen(false)}
          />
          
          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
              className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">{t.contactUs}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setContactOpen(false)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-6">
                  <p className="text-muted-foreground mb-6 text-sm">{t.contactDesc}</p>

                  {/* Contact Methods */}
                  <div className="space-y-4 mb-6">
                    {contactMethods.map((method, index) => (
                      <button
                        key={index}
                        onClick={method.action}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 w-full text-left group"
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <method.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                            {method.title}
                          </h4>
                          <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                            {method.detail}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Contact Form */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-sm">{t.sendMessage}</h3>
                    {isSubmitted ? (
                      <div className="text-center py-4 space-y-2">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                          <Send className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-foreground">{t.messageSent}</h4>
                        <p className="text-sm text-muted-foreground">{t.messageSuccess}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t.namePlaceholder}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t.emailPlaceholder}
                            required
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={t.messagePlaceholder}
                            rows={4}
                            required
                            className="text-sm resize-none"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                              {t.sending}
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {t.sendMessage}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}