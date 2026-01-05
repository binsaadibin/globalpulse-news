import Advertisement from '../models/Advertisement.js';
import mongoose from 'mongoose';

export const seedAdvertisements = async () => {
  try {
    const count = await Advertisement.countDocuments();
    
    if (count === 0) {
      console.log('🌱 Seeding sample advertisements...');
      
      const sampleAds = [
        {
          title: {
            en: 'Special Offer - Limited Time',
            ar: 'عرض خاص - لفترة محدودة',
            ur: 'خصوصی پیشکش - محدود وقت'
          },
          description: {
            en: 'Get exclusive discounts on our premium services. Limited time offer!',
            ar: 'احصل على خصومات حصرية على خدماتنا المميزة. عرض لفترة محدودة!',
            ur: 'ہماری پریمیم سروسز پر خصوصی رعایتیں حاصل کریں۔ محدود وقت کی پیشکش!'
          },
          imageUrl: 'https://images.unsplash.com/photo-1665686374006-b8f04cf62d57?w=400&h=300&fit=crop',
          url: '#',
          position: 'inline',
          ctaText: {
            en: 'Learn More',
            ar: 'تعرف أكثر',
            ur: 'مزید جانیں'
          },
          sponsor: 'Global Pulse',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          priority: 1,
          createdBy: new mongoose.Types.ObjectId('69233afabbee0ece537f7574'), // Use an existing user ID
          createdByUsername: 'globalplus'
        },
        {
          title: {
            en: 'New Features Available',
            ar: 'ميزات جديدة متاحة',
            ur: 'نئی خصوصیات دستیاب'
          },
          description: {
            en: 'Discover our latest platform features and enhancements',
            ar: 'اكتشف أحدث ميزات المنصة وتحسيناتها',
            ur: 'ہمارے تازہ ترین پلیٹ فارم کی خصوصیات اور بہتریوں کو دریافت کریں'
          },
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          url: '#',
          position: 'sidebar',
          ctaText: {
            en: 'Get Started',
            ar: 'ابدأ الآن',
            ur: 'شروع کریں'
          },
          sponsor: 'Tech Solutions',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          priority: 2,
          createdBy: new mongoose.Types.ObjectId('69233afabbee0ece537f7574'),
          createdByUsername: 'globalplus'
        }
      ];

      await Advertisement.insertMany(sampleAds);
      console.log('✅ Sample advertisements seeded successfully');
    } else {
      console.log('✅ Advertisements already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding advertisements:', error);
  }
};