import { Response } from "express";
import { videos } from '../../db/mockData.js';

// Enhanced filter function with better search and category handling
export const getVideos = (req: any, res: Response) => {
  try {
    console.log('🎬 Fetching videos with filters:', req.query);
    
    let filteredVideos = [...videos];
    const { 
      category, 
      search, 
      sortBy, 
      isFeatured, 
      isTrending, 
      isLive, 
      isShort,
      startDate,
      endDate,
      platform,
      status = 'published'
    } = req.query;

    // Filter by status (default to published for public)
    if (status === 'published') {
      filteredVideos = filteredVideos.filter(video => video.status === 'published');
    } else if (status) {
      filteredVideos = filteredVideos.filter(video => video.status === status);
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredVideos = filteredVideos.filter(video => 
        video.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by platform
    if (platform && platform !== 'all') {
      filteredVideos = filteredVideos.filter(video => 
        video.platform?.toLowerCase() === platform.toLowerCase()
      );
    }

    // Enhanced search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(video => {
        const title = typeof video.title === 'string' ? video.title : 
                     video.title?.en || video.title?.ar || video.title?.ur || '';
        const description = typeof video.description === 'string' ? video.description : 
                          video.description?.en || video.description?.ar || video.description?.ur || '';
        const category = video.category || '';
        
        return title.toLowerCase().includes(searchLower) || 
               description.toLowerCase().includes(searchLower) ||
               category.toLowerCase().includes(searchLower);
      });
    }

    // Filter by featured
    if (isFeatured === 'true') {
      filteredVideos = filteredVideos.filter(video => video.isFeatured === true);
    }

    // Filter by trending
    if (isTrending === 'true') {
      filteredVideos = filteredVideos.filter(video => video.isTrending === true);
    }

    // Filter by live
    if (isLive === 'true') {
      filteredVideos = filteredVideos.filter(video => video.isLive === true);
    }

    // Filter by shorts
    if (isShort === 'true') {
      filteredVideos = filteredVideos.filter(video => video.isShort === true);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filteredVideos = filteredVideos.filter(video => 
        new Date(video.createdAt) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredVideos = filteredVideos.filter(video => 
        new Date(video.createdAt) <= end
      );
    }

    // Enhanced sorting
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          filteredVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          filteredVideos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'mostViewed':
          filteredVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'mostLiked':
          filteredVideos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case 'trending':
          filteredVideos.sort((a, b) => {
            if (a.isTrending && !b.isTrending) return -1;
            if (!a.isTrending && b.isTrending) return 1;
            return (b.views || 0) - (a.views || 0);
          });
          break;
        case 'featured':
          filteredVideos.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          break;
      }
    }

    console.log(`📊 Returning ${filteredVideos.length} videos`);
    
    res.json({
      success: true,
      data: filteredVideos,
      metadata: {
        total: filteredVideos.length,
        hasMore: false,
        filters: {
          category: category || 'all',
          search: search || '',
          sortBy: sortBy || 'newest',
          appliedFilters: Object.keys(req.query).length
        }
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching videos' 
    });
  }
};

// Enhanced featured videos with better filtering
export const getFeaturedVideos = (req: any, res: Response) => {
  try {
    console.log('⭐ Fetching featured videos');
    const featuredVideos = videos
      .filter(video => video.isFeatured === true && video.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`📊 Returning ${featuredVideos.length} featured videos`);
    
    res.json({
      success: true,
      data: featuredVideos,
      metadata: {
        total: featuredVideos.length
      }
    });
  } catch (error) {
    console.error('Get featured videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching featured videos' 
    });
  }
};

// Enhanced trending videos algorithm
export const getTrendingVideos = (req: any, res: Response) => {
  try {
    console.log('🔥 Fetching trending videos');
    const trendingVideos = videos
      .filter(video => video.status === 'published')
      .sort((a, b) => {
        // Calculate trending score based on views, likes, and recency
        const aScore = (a.views || 0) + (a.likes || 0) * 10 + 
          (new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        const bScore = (b.views || 0) + (b.likes || 0) * 10 + 
          (new Date().getTime() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return bScore - aScore;
      })
      .slice(0, 20);
    
    console.log(`📊 Returning ${trendingVideos.length} trending videos`);
    
    res.json({
      success: true,
      data: trendingVideos,
      metadata: {
        total: trendingVideos.length
      }
    });
  } catch (error) {
    console.error('Get trending videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching trending videos' 
    });
  }
};

export const getLiveVideos = (req: any, res: Response) => {
  try {
    console.log('🔴 Fetching live videos');
    const liveVideos = videos.filter(video => 
      video.isLive === true && video.status === 'published'
    );
    console.log(`📊 Returning ${liveVideos.length} live videos`);
    
    res.json({
      success: true,
      data: liveVideos,
      metadata: {
        total: liveVideos.length
      }
    });
  } catch (error) {
    console.error('Get live videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching live videos' 
    });
  }
};

export const getShortsVideos = (req: any, res: Response) => {
  try {
    console.log('🎬 Fetching shorts videos');
    const shortsVideos = videos.filter(video => 
      video.isShort === true && video.status === 'published'
    );
    console.log(`📊 Returning ${shortsVideos.length} shorts videos`);
    
    res.json({
      success: true,
      data: shortsVideos,
      metadata: {
        total: shortsVideos.length
      }
    });
  } catch (error) {
    console.error('Get shorts videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching shorts videos' 
    });
  }
};

export const getPopularVideos = (req: any, res: Response) => {
  try {
    console.log('📈 Fetching popular videos');
    const popularVideos = [...videos]
      .filter(video => video.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 50);
    
    console.log(`📊 Returning ${popularVideos.length} popular videos`);
    
    res.json({
      success: true,
      data: popularVideos,
      metadata: {
        total: popularVideos.length
      }
    });
  } catch (error) {
    console.error('Get popular videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching popular videos' 
    });
  }
};

// Create new video
export const createVideo = (req: any, res: Response) => {
  try {
    console.log('🎥 Creating video by:', req.user.username);

    const { title, description, videoUrl, platform, category, thumbnail, status, isFeatured, isTrending, isLive, isShort } = req.body;

    // Enhanced validation
    if (!title || !title.en) {
      return res.status(400).json({
        success: false,
        message: 'Video title in English is required'
      });
    }

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    const video = {
      _id: Date.now().toString(),
      title,
      description: description || { en: '', ar: '', ur: '' },
      videoUrl,
      platform: platform || 'youtube',
      category,
      thumbnail: thumbnail || '',
      status: status || 'draft',
      views: 0,
      likes: 0,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      isLive: isLive || false,
      isShort: isShort || false,
      createdBy: req.user.id,
      createdByUsername: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    videos.push(video);
    console.log('💾 Video saved. Total videos:', videos.length);

    res.status(201).json({
      success: true,
      message: `Video ${video.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      data: video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating video' 
    });
  }
};

// Get user's videos
export const getMyVideos = (req: any, res: Response) => {
  try {
    console.log('📹 Fetching videos for user:', req.user.username);
    
    const userVideos = videos.filter(video => video.createdBy === req.user.id);
    console.log('📊 Returning', userVideos.length, 'videos for user');
    
    res.json({
      success: true,
      data: userVideos,
      metadata: {
        total: userVideos.length
      }
    });
  } catch (error) {
    console.error('Get my videos error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user videos' 
    });
  }
};

// Update video
export const updateVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);

    const videoIndex = videos.findIndex(video => 
      video._id === videoId && video.createdBy === req.user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    videos[videoIndex] = {
      ...videos[videoIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Video updated successfully');

    res.json({
      success: true,
      message: `Video ${videos[videoIndex].status === 'draft' ? 'draft updated' : 'updated and published'} successfully`,
      data: videos[videoIndex]
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating video' 
    });
  }
};

// Delete video
export const deleteVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    const videoIndex = videos.findIndex(video => 
      video._id === videoId && video.createdBy === req.user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const deletedVideo = videos.splice(videoIndex, 1)[0];
    console.log('✅ Video deleted. Total videos:', videos.length);

    res.json({
      success: true,
      message: 'Video deleted successfully',
      data: deletedVideo
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting video' 
    });
  }
};

// Track video view
export const trackView = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('👀 Tracking view for video:', videoId);

    const videoIndex = videos.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const video = videos[videoIndex];
    
    if (typeof video.views !== 'number') {
      video.views = 0;
    }
    
    video.views += 1;
    video.updatedAt = new Date().toISOString();

    console.log('✅ View tracked. Total views:', video.views);

    res.json({
      success: true,
      views: video.views,
      message: 'View tracked successfully'
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while tracking view' 
    });
  }
};

// Get video views
export const getVideoViews = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('📊 Getting views for video:', videoId);

    const video = videos.find(video => video._id === videoId);
    
    if (!video) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const views = video.views || 0;

    res.json({
      success: true,
      views: views,
      videoId: videoId
    });
  } catch (error) {
    console.error('Get views error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while getting views' 
    });
  }
};

// Like video
export const likeVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('❤️ Liking video:', videoId);

    const videoIndex = videos.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const video = videos[videoIndex];
    
    if (typeof video.likes !== 'number') {
      video.likes = 0;
    }
    
    video.likes += 1;
    video.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: video.likes,
      hasLiked: true
    });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while liking video' 
    });
  }
};

// Unlike video
export const unlikeVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('💔 Unliking video:', videoId);

    const videoIndex = videos.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Video not found' 
      });
    }

    const video = videos[videoIndex];
    
    if (video.likes > 0) {
      video.likes -= 1;
    }
    
    video.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      likes: video.likes,
      hasLiked: false
    });
  } catch (error) {
    console.error('Unlike video error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while unliking video' 
    });
  }
};