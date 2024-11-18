import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YouTubeStats = ({ accessToken }) => {
    const [stats, setStats] = useState({ subscriberCount: 'Loading...', viewCount: 'Loading...' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchYouTubeStats = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,

                    },
                    params: {
                        part: 'statistics',
                        mine: 'true'
                    }
                });
                console.log(response);

                const statistics = response.data.items[0].statistics;
                setStats({
                    subscriberCount: statistics.subscriberCount,
                    viewCount: statistics.viewCount
                });

            } catch (err) {
                setError('Failed to fetch YouTube statistics');
                console.error(err);
            }
        };

        fetchYouTubeStats();
    }, [accessToken]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>YouTube Channel Statistics</h1>
            <p className=''>Subscribers: {stats.subscriberCount}</p>
            <p>Total Views: {stats.viewCount}</p>
        </div>
    );
};

export default YouTubeStats;