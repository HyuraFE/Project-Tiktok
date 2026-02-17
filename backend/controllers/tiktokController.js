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

        console.log('Fetching TikTok video:', url);
        console.log('Using API Key:', process.env.RAPIDAPI_KEY?.substring(0, 10) + '...');
        console.log('Using Host:', process.env.RAPIDAPI_HOST);

        // Call RapidAPI - Updated endpoint
        const options = {
            method: 'GET',
            url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
            }
        };

        const response = await axios.request(options);
        console.log('API Response:', JSON.stringify(response.data, null, 2));

        // Format response based on the actual API structure
        const apiData = response.data?.data || response.data;

        const videoData = {
            success: true,
            data: {
                video: {
                    noWatermark: apiData?.play || apiData?.hdplay || apiData?.wmplay || null,
                    watermark: apiData?.wmplay || apiData?.play || null,
                    thumbnail: apiData?.cover || apiData?.origin_cover || null,
                },
                music: apiData?.music || apiData?.music_info?.play || null,
                author: {
                    username: apiData?.author?.unique_id || apiData?.author?.nickname || 'Unknown',
                    nickname: apiData?.author?.nickname || apiData?.author?.unique_id || 'Unknown',
                    avatar: apiData?.author?.avatar || apiData?.author?.avatar_thumb || null,
                },
                stats: {
                    plays: apiData?.play_count || apiData?.statistics?.play_count || 0,
                    likes: apiData?.digg_count || apiData?.statistics?.digg_count || 0,
                    comments: apiData?.comment_count || apiData?.statistics?.comment_count || 0,
                    shares: apiData?.share_count || apiData?.statistics?.share_count || 0,
                },
                description: apiData?.title || apiData?.desc || '',
            }
        };

        console.log('Formatted response:', JSON.stringify(videoData, null, 2));
        res.json(videoData);

    } catch (error) {
        console.error('Error downloading TikTok video:', error.message);
        console.error('Error details:', error.response?.data);

        if (error.response) {
            // RapidAPI error
            return res.status(error.response.status).json({
                error: 'API Error',
                message: error.response.data?.message || error.response.data?.error || 'Failed to fetch video data from TikTok',
                details: error.response.data
            });
        }

        res.status(500).json({
            error: 'Server Error',
            message: 'An error occurred while processing your request'
        });
    }
};
