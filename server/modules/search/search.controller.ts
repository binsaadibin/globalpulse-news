import { Response } from "express";
import { articles, videos } from '../../db/mockData.js';

export const search = (req: any, res: Response) => {
  try {
    const { q: query, type } = req.query;
    console.log('🔍 Search request:', { query, type });

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Search in articles
    const articleResults = articles
      .filter(article => article.status === 'published')
      .filter(article => {
        const title = typeof article.title === 'string' 
          ? article.title 
          : article.title?.en || article.title?.ar || article.title?.ur || '';
        const description = typeof article.description === 'string'
          ? article.description
          : article.description?.en || article.description?.ar || article.description?.ur || '';
        
        return title.toLowerCase().includes(searchTerm) || 
               description.toLowerCase().includes(searchTerm) ||
               article.category?.toLowerCase().includes(searchTerm);
      })
      .map(article => ({
        id: article._id,
        title: typeof article.title === 'string' ? article.title : article.title?.en,
        description: typeof article.description === 'string' ? article.description : article.description?.en,
        url: `/article/${article._id}`,
        type: 'news',
        date: article.createdAt,
        imageUrl: article.imageUrl
      }));

    // Search in videos
    const videoResults = videos
      .filter(video => video.status === 'published')
      .filter(video => {
        const title = typeof video.title === 'string' 
          ? video.title 
          : video.title?.en || video.title?.ar || video.title?.ur || '';
        const description = typeof video.description === 'string'
          ? video.description
          : video.description?.en || video.description?.ar || video.description?.ur || '';
        
        return title.toLowerCase().includes(searchTerm) || 
               description.toLowerCase().includes(searchTerm);
      })
      .map(video => ({
        id: video._id,
        title: typeof video.title === 'string' ? video.title : video.title?.en,
        description: typeof video.description === 'string' ? video.description : video.description?.en,
        url: `/video/${video._id}`,
        type: 'video',
        duration: '5:30',
        platform: video.platform
      }));

    let results = [];
    
    if (type === 'news') {
      results = articleResults;
    } else if (type === 'video') {
      results = videoResults;
    } else {
      results = [...articleResults, ...videoResults];
    }

    console.log('🔍 Search results:', results.length);

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};