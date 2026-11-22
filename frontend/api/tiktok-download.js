const axios = require('axios');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;

        // Validate URL
        if (!url) {
            return res.status(400).json({
                error: 'URL is required',
                message: 'Please provide a TikTok video URL'
            });
        }

        // Validate TikTok URL format
        const tiktokUrlPattern = /tiktok\.com/;
        if (!tiktokUrlPattern.test(url)) {
            return res.status(400).json({
                error: 'Invalid URL',
                message: 'Please provide a valid TikTok URL'
            });
        }

        console.log('Fetching TikTok video via TikWM (Frontend Serverless):', url);

        // Call TikWM Public API
        const params = new URLSearchParams();
        params.append('url', url);
        params.append('hd', '1');

        const response = await axios.post(
            'https://www.tikwm.com/api/',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 15000
            }
        );

        if (response.data?.code !== 0) {
            return res.status(400).json({
                error: 'Fetch Failed',
                message: response.data?.msg || 'Failed to parse TikTok video from URL'
            });
        }

        const apiData = response.data?.data || {};

        const videoData = {
            success: true,
            data: {
                video: {
                    noWatermark: apiData.hdplay || apiData.play || null,
                    watermark: apiData.wmplay || apiData.play || null,
                    thumbnail: apiData.cover || apiData.origin_cover || null,
                    duration: apiData.duration || 0
                },
                music: apiData.music || apiData.music_info?.play || null,
                music_info: {
                    title: apiData.music_info?.title || 'Original Sound',
                    author: apiData.music_info?.author || 'Unknown'
                },
                author: {
                    username: apiData.author?.unique_id || 'Unknown',
                    nickname: apiData.author?.nickname || apiData.author?.unique_id || 'Unknown',
                    avatar: apiData.author?.avatar || null,
                },
                stats: {
                    plays: apiData.play_count || 0,
                    likes: apiData.digg_count || 0,
                    comments: apiData.comment_count || 0,
                    shares: apiData.share_count || 0,
                },
                description: apiData.title || '',
            }
        };

        res.status(200).json(videoData);

    } catch (error) {
        console.error('Error downloading TikTok video:', error.message);
        res.status(500).json({
            error: 'Server Error',
            message: error.message || 'An error occurred while processing your request'
        });
    }
};
