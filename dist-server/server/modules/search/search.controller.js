var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { articles, videos } from '../../db/mockData.js';
export var search = function (req, res) {
    try {
        var _a = req.query, query = _a.q, type = _a.type;
        console.log('🔍 Search request:', { query: query, type: type });
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        var searchTerm_1 = query.toLowerCase().trim();
        // Search in articles
        var articleResults = articles
            .filter(function (article) { return article.status === 'published'; })
            .filter(function (article) {
            var _a, _b, _c, _d, _e, _f, _g;
            var title = typeof article.title === 'string'
                ? article.title
                : ((_a = article.title) === null || _a === void 0 ? void 0 : _a.en) || ((_b = article.title) === null || _b === void 0 ? void 0 : _b.ar) || ((_c = article.title) === null || _c === void 0 ? void 0 : _c.ur) || '';
            var description = typeof article.description === 'string'
                ? article.description
                : ((_d = article.description) === null || _d === void 0 ? void 0 : _d.en) || ((_e = article.description) === null || _e === void 0 ? void 0 : _e.ar) || ((_f = article.description) === null || _f === void 0 ? void 0 : _f.ur) || '';
            return title.toLowerCase().includes(searchTerm_1) ||
                description.toLowerCase().includes(searchTerm_1) ||
                ((_g = article.category) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes(searchTerm_1));
        })
            .map(function (article) {
            var _a, _b;
            return ({
                id: article._id,
                title: typeof article.title === 'string' ? article.title : (_a = article.title) === null || _a === void 0 ? void 0 : _a.en,
                description: typeof article.description === 'string' ? article.description : (_b = article.description) === null || _b === void 0 ? void 0 : _b.en,
                url: "/article/".concat(article._id),
                type: 'news',
                date: article.createdAt,
                imageUrl: article.imageUrl
            });
        });
        // Search in videos
        var videoResults = videos
            .filter(function (video) { return video.status === 'published'; })
            .filter(function (video) {
            var _a, _b, _c, _d, _e, _f;
            var title = typeof video.title === 'string'
                ? video.title
                : ((_a = video.title) === null || _a === void 0 ? void 0 : _a.en) || ((_b = video.title) === null || _b === void 0 ? void 0 : _b.ar) || ((_c = video.title) === null || _c === void 0 ? void 0 : _c.ur) || '';
            var description = typeof video.description === 'string'
                ? video.description
                : ((_d = video.description) === null || _d === void 0 ? void 0 : _d.en) || ((_e = video.description) === null || _e === void 0 ? void 0 : _e.ar) || ((_f = video.description) === null || _f === void 0 ? void 0 : _f.ur) || '';
            return title.toLowerCase().includes(searchTerm_1) ||
                description.toLowerCase().includes(searchTerm_1);
        })
            .map(function (video) {
            var _a, _b;
            return ({
                id: video._id,
                title: typeof video.title === 'string' ? video.title : (_a = video.title) === null || _a === void 0 ? void 0 : _a.en,
                description: typeof video.description === 'string' ? video.description : (_b = video.description) === null || _b === void 0 ? void 0 : _b.en,
                url: "/video/".concat(video._id),
                type: 'video',
                duration: '5:30',
                platform: video.platform
            });
        });
        var results = [];
        if (type === 'news') {
            results = articleResults;
        }
        else if (type === 'video') {
            results = videoResults;
        }
        else {
            results = __spreadArray(__spreadArray([], articleResults, true), videoResults, true);
        }
        console.log('🔍 Search results:', results.length);
        res.json({
            success: true,
            data: results,
            total: results.length,
            query: searchTerm_1
        });
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
