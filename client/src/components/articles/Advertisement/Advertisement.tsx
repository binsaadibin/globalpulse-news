import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdvertisementProps {
  ads: any[];
  position: 'sidebar' | 'inline';
  className?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ ads, position, className = '' }) => {
  const { language } = useLanguage();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const translations = {
    en: {
      advertisement: 'Advertisement',
      sponsored: 'Sponsored Content',
      learnMore: 'Learn More',
      visitWebsite: 'Visit Website'
    },
    ar: {
      advertisement: 'إعلان',
      sponsored: 'محتوى مدفوع',
      learnMore: 'تعرف أكثر',
      visitWebsite: 'زيارة الموقع'
    },
    ur: {
      advertisement: 'اشتہار',
      sponsored: 'سپانسرڈ مواد',
      learnMore: 'مزید جانیں',
      visitWebsite: 'ویب سائٹ پر جائیں'
    }
  };

  const t = translations[language as 'en' | 'ar' | 'ur'];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const trackAdClick = async (adId: string) => {
    try {
      await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/advertisements/${adId}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.warn('Failed to track ad click:', error);
      });
    } catch (error) {
      console.warn('Failed to track ad click:', error);
    }
  };

  const trackAdImpression = async (adId: string) => {
    try {
      await fetch(`https://globalpulse-news-production-31ee.up.railway.app/api/advertisements/${adId}/impression`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.warn('Failed to track ad impression:', error);
      });
    } catch (error) {
      console.warn('Failed to track ad impression:', error);
    }
  };

  useEffect(() => {
    if (ads.length > 0 && ads[currentAdIndex]?._id) {
      trackAdImpression(ads[currentAdIndex]._id);
    }
  }, [currentAdIndex, ads]);

  if (!ads || ads.length === 0) {
    return null; // Don't show anything if no real ads
  }

  const currentAd = ads[currentAdIndex];

  const getDisplayText = (textObject: any): string => {
    if (!textObject) return '';
    if (typeof textObject === 'string') return textObject;
    return textObject[language] || textObject.en || textObject.ar || textObject.ur || '';
  };

  const handleAdClick = () => {
    if (currentAd.url && currentAd.url !== '#') {
      window.open(currentAd.url, '_blank');
    }
    
    if (currentAd._id) {
      trackAdClick(currentAd._id);
    }
  };

  return (
    <div className={`ad-wrapper ${position}`}>
      {ads.length > 1 && (
        <div className="flex justify-center gap-1 mb-3">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => setCurrentAdIndex(index)}
            />
          ))}
        </div>
      )}
      
      <Card 
        className={`overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-500 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        onClick={handleAdClick}
      >
        <CardContent className="p-6">
          {currentAd.imageUrl ? (
            <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
              <img 
                src={currentAd.imageUrl} 
                alt={getDisplayText(currentAd.title)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // If image fails to load, hide the image container
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.display = 'none';
                  }
                }}
              />
            </div>
          ) : (
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          
          <Badge variant="outline" className="mb-3">
            {t.advertisement}
          </Badge>
          
          <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {getDisplayText(currentAd.title)}
          </h4>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {getDisplayText(currentAd.description)}
          </p>
          
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {getDisplayText(currentAd.ctaText) || t.learnMore}
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
          
          {currentAd.sponsor && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {t.sponsored} • {currentAd.sponsor}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Advertisement;