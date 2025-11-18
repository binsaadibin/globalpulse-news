var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Youtube, Facebook, Instagram, Music, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
// Function to format view counts dynamically
var formatViews = function (views, language) {
    if (views >= 1000000) {
        var millions = (views / 1000000).toFixed(1);
        return language === 'ar'
            ? "".concat(millions, " \u0645\u0644\u064A\u0648\u0646")
            : language === 'ur'
                ? "".concat(millions, " \u0645\u0644\u06CC\u0646")
                : "".concat(millions, "M");
    }
    else if (views >= 1000) {
        var thousands = (views / 1000).toFixed(1);
        return language === 'ar'
            ? "".concat(thousands, " \u0623\u0644\u0641")
            : language === 'ur'
                ? "".concat(thousands, " \u06C1\u0632\u0627\u0631")
                : "".concat(thousands, "K");
    }
    return views.toString();
};
// Enhanced YouTube ID extraction
var getYouTubeId = function (url) {
    if (!url)
        return null;
    try {
        var regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        var match = url.match(regex);
        return match && match[1] ? match[1] : null;
    }
    catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return null;
    }
};
// Get platform from URL
var getPlatformFromUrl = function (url) {
    if (!url)
        return 'video';
    var urlLower = url.toLowerCase();
    if (urlLower.includes('youtube') || urlLower.includes('youtu.be'))
        return 'youtube';
    if (urlLower.includes('facebook'))
        return 'facebook';
    if (urlLower.includes('tiktok'))
        return 'tiktok';
    if (urlLower.includes('instagram'))
        return 'instagram';
    return 'video';
};
// Format time ago
var getTimeAgo = function (dateString, language) {
    var date = new Date(dateString);
    var now = new Date();
    var diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return language === 'ar' ? 'الآن' : language === 'ur' ? 'ابھی' : 'Just now';
    }
    var diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return language === 'ar'
            ? "\u0642\u0628\u0644 ".concat(diffInMinutes, " \u062F\u0642\u064A\u0642\u0629")
            : language === 'ur'
                ? "".concat(diffInMinutes, " \u0645\u0646\u0679 \u067E\u06C1\u0644\u06D2")
                : "".concat(diffInMinutes, " min ago");
    }
    var diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return language === 'ar'
            ? "\u0642\u0628\u0644 ".concat(diffInHours, " \u0633\u0627\u0639\u0629")
            : language === 'ur'
                ? "".concat(diffInHours, " \u06AF\u06BE\u0646\u0679\u06D2 \u067E\u06C1\u0644\u06D2")
                : "".concat(diffInHours, " hour").concat(diffInHours > 1 ? 's' : '', " ago");
    }
    var diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return language === 'ar'
            ? "\u0642\u0628\u0644 ".concat(diffInDays, " \u064A\u0648\u0645")
            : language === 'ur'
                ? "".concat(diffInDays, " \u062F\u0646 \u067E\u06C1\u0644\u06D2")
                : "".concat(diffInDays, " day").concat(diffInDays > 1 ? 's' : '', " ago");
    }
    var diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return language === 'ar'
            ? "\u0642\u0628\u0644 ".concat(diffInWeeks, " \u0623\u0633\u0628\u0648\u0639")
            : language === 'ur'
                ? "".concat(diffInWeeks, " \u06C1\u0641\u062A\u06D2 \u067E\u06C1\u0644\u06D2")
                : "".concat(diffInWeeks, " week").concat(diffInWeeks > 1 ? 's' : '', " ago");
    }
    return new Date(dateString).toLocaleDateString();
};
export default function VideoCard(_a) {
    var _this = this;
    var title = _a.title, platform = _a.platform, videoUrl = _a.videoUrl, _b = _a.views, views = _b === void 0 ? 0 : _b, createdAt = _a.createdAt, language = _a.language, videoId = _a.videoId, thumbnailUrl = _a.thumbnailUrl, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState(false), isPlaying = _d[0], setIsPlaying = _d[1];
    var _e = useState(views), currentViews = _e[0], setCurrentViews = _e[1];
    var _f = useState(false), isTrackingView = _f[0], setIsTrackingView = _f[1];
    var _g = useState(false), imageError = _g[0], setImageError = _g[1];
    var _h = useState(false), isLoading = _h[0], setIsLoading = _h[1];
    // Determine actual platform and video ID
    var actualPlatform = platform || getPlatformFromUrl(videoUrl);
    var videoIdFromUrl = getYouTubeId(videoUrl);
    // Track view when video starts playing
    var trackView = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!videoId || isTrackingView)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    setIsTrackingView(true);
                    return [4 /*yield*/, fetch("https://globalpulse-news-production-31ee.up.railway.app/api/videos/".concat(videoId, "/view"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    setCurrentViews(result.views);
                    console.log('✅ View tracked successfully:', result.views);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('❌ Error tracking view:', error_1);
                    return [3 /*break*/, 7];
                case 6:
                    setIsTrackingView(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Update views periodically when video is playing
    useEffect(function () {
        var updateViews = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!videoId)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("https://globalpulse-news-production-31ee.up.railway.app/api/videos/".concat(videoId, "/views"))];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        setCurrentViews(result.views);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Error fetching views:', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        var interval;
        if (isPlaying) {
            updateViews(); // Initial update
            interval = setInterval(updateViews, 30000);
        }
        return function () {
            if (interval)
                clearInterval(interval);
        };
    }, [videoId, isPlaying]);
    var handlePlayClick = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isLoading)
                        return [2 /*return*/];
                    setIsLoading(true);
                    return [4 /*yield*/, trackView()];
                case 1:
                    _a.sent();
                    setIsPlaying(true);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Get YouTube thumbnail with fallback
    var getThumbnailUrl = function (id) {
        if (thumbnailUrl)
            return thumbnailUrl;
        if (!id)
            return null;
        return "https://img.youtube.com/vi/".concat(id, "/hqdefault.jpg");
    };
    var finalThumbnailUrl = getThumbnailUrl(videoIdFromUrl);
    var getPlatformIcon = function (platform) {
        var platformLower = platform.toLowerCase();
        var icons = {
            youtube: Youtube,
            facebook: Facebook,
            tiktok: Music,
            instagram: Instagram,
            video: Play
        };
        return icons[platformLower] || Play;
    };
    var getPlatformColor = function (platform) {
        var platformLower = platform.toLowerCase();
        var colors = {
            youtube: 'bg-red-600 text-white',
            facebook: 'bg-blue-600 text-white',
            tiktok: 'bg-black text-white',
            instagram: 'bg-pink-600 text-white',
            video: 'bg-gray-600 text-white'
        };
        return colors[platformLower] || 'bg-gray-600 text-white';
    };
    var PlatformIcon = getPlatformIcon(actualPlatform);
    var formattedViews = formatViews(currentViews, language);
    var timeAgo = getTimeAgo(createdAt, language);
    var isListView = className.includes('flex-row');
    if (isPlaying && videoIdFromUrl) {
        return (<Card className={"w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ".concat(className)}>
        {/* Embedded YouTube Player */}
        <div className="relative aspect-video bg-black">
          <iframe src={"https://www.youtube.com/embed/".concat(videoIdFromUrl, "?autoplay=1&rel=0")} title={title} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
          {/* Close button */}
          <button onClick={function () { return setIsPlaying(false); }} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 leading-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <Badge className={"".concat(getPlatformColor(actualPlatform), " text-xs font-semibold")}>
              <PlatformIcon className="h-3 w-3 mr-1"/>
              {actualPlatform}
            </Badge>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Eye className="h-3 w-3 mr-1"/>
              {formattedViews}
            </div>
          </div>
        </CardContent>
      </Card>);
    }
    // For non-YouTube videos, open in new tab
    var handleNonYouTubeClick = function () {
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
    };
    if (isPlaying && !videoIdFromUrl) {
        return (<Card className={"w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ".concat(className)}>
        <CardContent className="p-6 text-center">
          <div className="max-w-md mx-auto">
            <PlatformIcon className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              {language === 'ar' ? 'فتح الفيديو' : language === 'ur' ? 'ویڈیو کھولیں' : 'Open Video'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {language === 'ar'
                ? 'سيتم فتح هذا الفيديو في نافذة جديدة'
                : language === 'ur'
                    ? 'یہ ویڈیو ایک نئی ونڈو میں کھل جائے گی'
                    : 'This video will open in a new window'}
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={function () { return setIsPlaying(false); }} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {language === 'ar' ? 'إلغاء' : language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button onClick={handleNonYouTubeClick} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                <Play className="h-4 w-4 mr-2"/>
                {language === 'ar' ? 'فتح الفيديو' : language === 'ur' ? 'ویڈیو کھولیں' : 'Open Video'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>);
    }
    return (<Card className={"w-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer bg-white dark:bg-gray-900 ".concat(className)}>
      {/* Video Thumbnail */}
      <div className={"relative bg-gray-900 overflow-hidden group ".concat(isListView ? 'w-48 flex-shrink-0' : 'aspect-video')} onClick={videoIdFromUrl ? handlePlayClick : function () { return setIsPlaying(true); }}>
        {finalThumbnailUrl && !imageError ? (<>
            <img src={finalThumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={function () { return setImageError(true); }} loading="lazy"/>
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"/>
          </>) : (<div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <Play className="h-8 w-8 text-white opacity-80"/>
          </div>)}
        
        {/* Loading overlay */}
        {isLoading && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>)}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Play className="h-5 w-5 text-white fill-current"/>
          </div>
        </div>
        
        {/* Duration badge - Simulated for YouTube style */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
            10:30
          </div>
        </div>
        
        {/* View count on thumbnail */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <Eye className="h-3 w-3 mr-1"/>
            {formattedViews}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <CardContent className={"p-3 flex-1 ".concat(isListView ? 'flex flex-col justify-between' : '')}>
        <div className="flex items-start space-x-3">
          {/* Channel avatar - simulated */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">GP</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {title}
            </h3>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Global Pulse</span>
              <Badge className={"".concat(getPlatformColor(actualPlatform), " ml-2 text-xs px-1.5 py-0")}>
                <PlatformIcon className="h-2.5 w-2.5 mr-0.5"/>
                {actualPlatform}
              </Badge>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{formattedViews} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          
          {/* More options button - YouTube style */}
          <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <MoreVertical className="h-4 w-4 text-gray-500"/>
          </button>
        </div>
      </CardContent>
    </Card>);
}
