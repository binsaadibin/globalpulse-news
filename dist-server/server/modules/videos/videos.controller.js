var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { videos } from '../../db/mockData.js';
export var getVideos = function (req, res) {
    try {
        console.log('🎬 Fetching published videos');
        var publishedVideos = videos.filter(function (video) { return video.status === 'published'; });
        console.log('📊 Returning', publishedVideos.length, 'published videos');
        res.json(publishedVideos);
    }
    catch (error) {
        console.error('Get videos error:', error);
        res.json([]);
    }
};
export var createVideo = function (req, res) {
    try {
        console.log('🎥 Creating video by:', req.user.username);
        var video = __assign(__assign({ _id: Date.now().toString() }, req.body), { views: 0, likes: 0, createdBy: req.user.id, createdByUsername: req.user.username, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        videos.push(video);
        console.log('💾 Video saved. Total videos:', videos.length);
        res.json({
            success: true,
            message: "Video ".concat(video.status === 'draft' ? 'saved as draft' : 'published', " successfully"),
            video: video
        });
    }
    catch (error) {
        console.error('Create video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export var getMyVideos = function (req, res) {
    try {
        console.log('📹 Fetching videos for user:', req.user.username);
        var userVideos = videos.filter(function (video) { return video.createdBy === req.user.id; });
        console.log('📊 Returning', userVideos.length, 'videos for user');
        res.json(userVideos);
    }
    catch (error) {
        console.error('Get my videos error:', error);
        res.json([]);
    }
};
export var updateVideo = function (req, res) {
    try {
        var videoId_1 = req.params.id;
        console.log('✏️ Updating video:', videoId_1);
        var videoIndex = videos.findIndex(function (video) {
            return video._id === videoId_1 && video.createdBy === req.user.id;
        });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        videos[videoIndex] = __assign(__assign(__assign({}, videos[videoIndex]), req.body), { updatedAt: new Date().toISOString() });
        console.log('✅ Video updated successfully');
        res.json({
            success: true,
            message: "Video ".concat(videos[videoIndex].status === 'draft' ? 'draft updated' : 'updated and published', " successfully"),
            video: videos[videoIndex]
        });
    }
    catch (error) {
        console.error('Update video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export var deleteVideo = function (req, res) {
    try {
        var videoId_2 = req.params.id;
        console.log('🗑️ Deleting video:', videoId_2);
        var videoIndex = videos.findIndex(function (video) {
            return video._id === videoId_2 && video.createdBy === req.user.id;
        });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var deletedVideo = videos.splice(videoIndex, 1)[0];
        console.log('✅ Video deleted. Total videos:', videos.length);
        res.json({
            success: true,
            message: 'Video deleted successfully',
            video: deletedVideo
        });
    }
    catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export var trackView = function (req, res) {
    try {
        var videoId_3 = req.params.id;
        console.log('👀 Tracking view for video:', videoId_3);
        var videoIndex = videos.findIndex(function (video) { return video._id === videoId_3; });
        if (videoIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        var video = videos[videoIndex];
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
    }
    catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
export var getVideoViews = function (req, res) {
    try {
        var videoId_4 = req.params.id;
        console.log('📊 Getting views for video:', videoId_4);
        var video = videos.find(function (video) { return video._id === videoId_4; });
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        var views = video.views || 0;
        res.json({
            success: true,
            views: views,
            videoId: videoId_4
        });
    }
    catch (error) {
        console.error('Get views error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
export var likeVideo = function (req, res) {
    try {
        var videoId_5 = req.params.id;
        console.log('❤️ Liking video:', videoId_5);
        var videoIndex = videos.findIndex(function (video) { return video._id === videoId_5; });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var video = videos[videoIndex];
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
    }
    catch (error) {
        console.error('Like video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export var unlikeVideo = function (req, res) {
    try {
        var videoId_6 = req.params.id;
        console.log('💔 Unliking video:', videoId_6);
        var videoIndex = videos.findIndex(function (video) { return video._id === videoId_6; });
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found' });
        }
        var video = videos[videoIndex];
        if (video.likes > 0) {
            video.likes -= 1;
        }
        video.updatedAt = new Date().toISOString();
        res.json({
            success: true,
            likes: video.likes,
            hasLiked: false
        });
    }
    catch (error) {
        console.error('Unlike video error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
