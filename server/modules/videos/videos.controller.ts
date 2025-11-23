import { Response } from "express";
import { videos } from '../../db/mockData.js';

export const getVideos = (req: any, res: Response) => {
  try {
    console.log('🎬 Fetching published videos');
    
    const publishedVideos = videos.filter(video => video.status === 'published');
    console.log('📊 Returning', publishedVideos.length, 'published videos');
    res.json(publishedVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.json([]);
  }
};

export const createVideo = (req: any, res: Response) => {
  try {
    console.log('🎥 Creating video by:', req.user.username);

    const video = {
      _id: Date.now().toString(),
      ...req.body,
      views: 0,
      likes: 0,
      createdBy: req.user.id,
      createdByUsername: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    videos.push(video);
    console.log('💾 Video saved. Total videos:', videos.length);

    res.json({
      success: true,
      message: `Video ${video.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
      video: video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyVideos = (req: any, res: Response) => {
  try {
    console.log('📹 Fetching videos for user:', req.user.username);
    
    const userVideos = videos.filter(video => video.createdBy === req.user.id);
    console.log('📊 Returning', userVideos.length, 'videos for user');
    res.json(userVideos);
  } catch (error) {
    console.error('Get my videos error:', error);
    res.json([]);
  }
};

export const updateVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('✏️ Updating video:', videoId);

    const videoIndex = videos.findIndex(video => 
      video._id === videoId && video.createdBy === req.user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
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
      video: videos[videoIndex]
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('🗑️ Deleting video:', videoId);

    const videoIndex = videos.findIndex(video => 
      video._id === videoId && video.createdBy === req.user.id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const deletedVideo = videos.splice(videoIndex, 1)[0];
    console.log('✅ Video deleted. Total videos:', videos.length);

    res.json({
      success: true,
      message: 'Video deleted successfully',
      video: deletedVideo
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      message: 'Server error' 
    });
  }
};

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
      message: 'Server error' 
    });
  }
};

export const likeVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('❤️ Liking video:', videoId);

    const videoIndex = videos.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const unlikeVideo = (req: any, res: Response) => {
  try {
    const videoId = req.params.id;
    console.log('💔 Unliking video:', videoId);

    const videoIndex = videos.findIndex(video => video._id === videoId);
    
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};