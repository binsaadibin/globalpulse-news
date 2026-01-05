import React from 'react';

interface AdvertisementProps {
  ads: any[];
  position: 'sidebar' | 'inline';
  className?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ ads, position, className = '' }) => {
  if (!ads || ads.length === 0) {
    return (
      <div className={`ad-container ${position} ${className}`}>
        <div className="ad-content">
          <div className="ad-placeholder">
            <span>Advertisement</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${position} ${className}`}>
      {ads.map((ad, index) => (
        <div key={ad._id || index} className="ad-content">
          <div className="ad-image">
            <img src={ad.imageUrl} alt={ad.title?.en || 'Advertisement'} />
          </div>
          <div className="ad-text">
            <h4>{ad.title?.en || 'Advertisement'}</h4>
            <p>{ad.description?.en || 'Sponsored content'}</p>
            <button className="ad-button">
              {ad.ctaText?.en || 'Learn More'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Advertisement;