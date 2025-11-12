import { Facebook, Twitter, Youtube, Instagram, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const FloatingMediaIcons = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const socialLinks = [
    {
      icon: Facebook,
      name: 'Facebook',
      href: '#',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: Twitter,
      name: 'Twitter', 
      href: '#',
      color: 'text-sky-500',
      bgColor: 'bg-sky-50 dark:bg-sky-950',
      borderColor: 'border-sky-200 dark:border-sky-800'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      href: '#',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      icon: Youtube,
      name: 'YouTube',
      href: '#',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      icon: Share2,
      name: 'Share',
      href: '#',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  return (
    <>
      {/* All Screen Sizes - Left Side */}
      <div className="fixed left-3 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-40">
        <div 
          className="flex flex-col items-center gap-2 p-2 sm:p-3 bg-background/90 backdrop-blur-lg border border-border/60 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setActiveIcon(null);
          }}
        >
          {/* Header Label - Only show on larger screens when hovered */}
          <div className={`hidden sm:flex items-center gap-2 mb-1 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">Follow</span>
          </div>

          {/* Social Icons */}
          {socialLinks.map((social, index) => (
            <div key={index} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className={`relative h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-lg sm:rounded-xl transition-all duration-300 border ${
                  activeIcon === social.name 
                    ? `${social.bgColor} ${social.color} ${social.borderColor} scale-110 shadow-lg` 
                    : 'bg-background/70 border-transparent hover:bg-accent/50 hover:scale-105'
                }`}
                onMouseEnter={() => setActiveIcon(social.name)}
                onMouseLeave={() => setActiveIcon(null)}
                onTouchStart={() => setActiveIcon(activeIcon === social.name ? null : social.name)}
                asChild
              >
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </a>
              </Button>
            </div>
          ))}

          {/* Vertical Separator */}
          <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-transparent via-border/50 to-transparent rounded-full mt-1"></div>
        </div>
      </div>

      {/* Click Outside Handler for Mobile */}
      {(activeIcon && typeof window !== 'undefined') && (
        <div 
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setActiveIcon(null)}
          onTouchStart={() => setActiveIcon(null)}
        />
      )}
    </>
  );
};

export default FloatingMediaIcons;