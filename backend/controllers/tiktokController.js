import axios from 'axios';

export const downloadVideo = async (req, res) => {
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

        console.log('Fetching TikTok video via TikWM:', url);

        // Call TikWM Public API
        const response = await axios.post(
            'https://www.tikwm.com/api/',
            new URLSearchParams({
                url: url,
                hd: '1'
            }).toString(),
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

        console.log('Successfully parsed video:', apiData.id);
        res.json(videoData);

    } catch (error) {
        console.error('Error downloading TikTok video:', error.message);
        res.status(500).json({
            error: 'Server Error',
            message: error.message || 'An error occurred while processing your request'
        });
    }
};

// Stream proxy handler to force browser download with proper Content-Disposition
export const proxyDownload = async (req, res) => {
    try {
        const fileUrl = req.query.url;
        const filename = req.query.filename || 'tiktok-video.mp4';

        if (!fileUrl) {
            return res.status(400).send('Missing url parameter');
        }

        console.log(`Proxying download stream: ${filename} from ${fileUrl}`);

        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.tiktok.com/'
            },
            timeout: 30000
        });

        // Set attachment header so browser triggers native Save File dialog
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }

        response.data.pipe(res);
    } catch (error) {
        console.error('Proxy download stream error:', error.message);
        res.status(500).send('Failed to stream file');
    }
};
