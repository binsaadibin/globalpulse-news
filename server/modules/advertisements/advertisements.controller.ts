import { Response } from "express";
import { advertisements } from '../../db/mockData.js';

// Get all active advertisements
export const getAdvertisements = (req: any, res: Response) => {
  try {
    console.log('📢 Fetching all active advertisements');
    
    const { position, status } = req.query;
    
    let filteredAds = [...advertisements];

    // Filter by position if provided
    if (position) {
      filteredAds = filteredAds.filter(ad => ad.position === position);
    }

    // Filter by status if provided, otherwise show only active
    if (status) {
      filteredAds = filteredAds.filter(ad => ad.status === status);
    } else {
      filteredAds = filteredAds.filter(ad => 
        ad.status === 'active' &&
        new Date(ad.startDate) <= new Date() &&
        new Date(ad.endDate) >= new Date()
      );
    }

    console.log(`📊 Returning ${filteredAds.length} advertisements`);
    
    res.json({
      success: true,
      data: filteredAds,
      metadata: {
        total: filteredAds.length,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching advertisements' 
    });
  }
};

// Get advertisements by specific position
export const getAdvertisementsByPosition = (req: any, res: Response) => {
  try {
    const { position } = req.params;
    console.log(`📢 Fetching advertisements for position: ${position}`);

    const filteredAds = advertisements.filter(ad => 
      ad.status === 'active' && 
      ad.position === position &&
      new Date(ad.startDate) <= new Date() &&
      new Date(ad.endDate) >= new Date()
    );

    console.log(`📊 Returning ${filteredAds.length} advertisements for ${position}`);
    
    res.json({
      success: true,
      data: filteredAds,
      metadata: {
        position,
        total: filteredAds.length
      }
    });
  } catch (error) {
    console.error('Get advertisements by position error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching advertisements by position' 
    });
  }
};

// Create new advertisement
export const createAdvertisement = (req: any, res: Response) => {
  try {
    console.log('🆕 Creating advertisement by:', req.user.username);

    const {
      title,
      description,
      imageUrl,
      targetUrl,
      position,
      status,
      startDate,
      endDate
    } = req.body;

    // Validation
    if (!title || !title.en) {
      return res.status(400).json({
        success: false,
        message: 'Advertisement title in English is required'
      });
    }

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Target URL is required'
      });
    }

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'Advertisement position is required'
      });
    }

    const advertisement = {
      _id: `ad${Date.now()}`,
      title: title || { en: '', ar: '', ur: '' },
      description: description || { en: '', ar: '', ur: '' },
      imageUrl: imageUrl || '',
      targetUrl,
      position,
      status: status || 'draft',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      clicks: 0,
      impressions: 0,
      createdBy: req.user.id,
      createdByUsername: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    advertisements.push(advertisement);
    console.log('💾 Advertisement saved. Total ads:', advertisements.length);

    res.status(201).json({
      success: true,
      message: `Advertisement ${advertisement.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      data: advertisement
    });
  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating advertisement' 
    });
  }
};

// Get user's advertisements
export const getMyAdvertisements = (req: any, res: Response) => {
  try {
    console.log('📋 Fetching advertisements for user:', req.user.username);
    
    const userAds = advertisements.filter(ad => ad.createdBy === req.user.id);
    console.log('📊 Returning', userAds.length, 'advertisements for user');
    
    res.json({
      success: true,
      data: userAds,
      metadata: {
        total: userAds.length
      }
    });
  } catch (error) {
    console.error('Get my advertisements error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user advertisements' 
    });
  }
};

// Update advertisement
export const updateAdvertisement = (req: any, res: Response) => {
  try {
    const adId = req.params.id;
    console.log('✏️ Updating advertisement:', adId);

    const adIndex = advertisements.findIndex(ad => 
      ad._id === adId && ad.createdBy === req.user.id
    );

    if (adIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Advertisement not found' 
      });
    }

    advertisements[adIndex] = {
      ...advertisements[adIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Advertisement updated successfully');

    res.json({
      success: true,
      message: `Advertisement ${advertisements[adIndex].status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      data: advertisements[adIndex]
    });
  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating advertisement' 
    });
  }
};

// Delete advertisement
export const deleteAdvertisement = (req: any, res: Response) => {
  try {
    const adId = req.params.id;
    console.log('🗑️ Deleting advertisement:', adId);

    const adIndex = advertisements.findIndex(ad => 
      ad._id === adId && ad.createdBy === req.user.id
    );

    if (adIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Advertisement not found' 
      });
    }

    const deletedAd = advertisements.splice(adIndex, 1)[0];
    console.log('✅ Advertisement deleted. Total ads:', advertisements.length);

    res.json({
      success: true,
      message: 'Advertisement deleted successfully',
      data: deletedAd
    });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting advertisement' 
    });
  }
};

// Track advertisement click
export const trackAdClick = (req: any, res: Response) => {
  try {
    const adId = req.params.id;
    console.log('🖱️ Tracking click for advertisement:', adId);

    const adIndex = advertisements.findIndex(ad => ad._id === adId);
    
    if (adIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Advertisement not found' 
      });
    }

    const ad = advertisements[adIndex];
    
    if (typeof ad.clicks !== 'number') {
      ad.clicks = 0;
    }
    
    ad.clicks += 1;
    ad.updatedAt = new Date().toISOString();

    console.log('✅ Click tracked. Total clicks:', ad.clicks);

    res.json({
      success: true,
      clicks: ad.clicks,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Track ad click error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while tracking advertisement click' 
    });
  }
};

// Track advertisement impression
export const trackAdImpression = (req: any, res: Response) => {
  try {
    const adId = req.params.id;
    console.log '👁️ Tracking impression for advertisement:', adId);

    const adIndex = advertisements.findIndex(ad => ad._id === adId);
    
    if (adIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Advertisement not found' 
      });
    }

    const ad = advertisements[adIndex];
    
    if (typeof ad.impressions !== 'number') {
      ad.impressions = 0;
    }
    
    ad.impressions += 1;
    ad.updatedAt = new Date().toISOString();

    console.log('✅ Impression tracked. Total impressions:', ad.impressions);

    res.json({
      success: true,
      impressions: ad.impressions,
      message: 'Impression tracked successfully'
    });
  } catch (error) {
    console.error('Track ad impression error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while tracking advertisement impression' 
    });
  }
};