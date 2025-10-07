import { Session } from '@supabase/supabase-js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_ANALYTICS_API_BASE = 'https://youtubeanalytics.googleapis.com/v2';

export interface AnalyticsData {
  views: number;
  viewsChange: number;
  subscribers: number;
  subscribersChange: number;
}

export interface ChannelStats {
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

const getAccessToken = (session: Session | null): string => {
  if (!session?.provider_token) {
    throw new Error('No access token available. Please sign in again.');
  }
  return session.provider_token;
};

export const fetchChannelStats = async (session: Session | null): Promise<ChannelStats> => {
  const accessToken = getAccessToken(session);

  // First, get the channel ID
  const channelResponse = await fetch(`${YOUTUBE_API_BASE}/channels?part=statistics&mine=true`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!channelResponse.ok) {
    throw new Error('Failed to fetch channel statistics');
  }

  const channelData = await channelResponse.json();
  
  if (!channelData.items || channelData.items.length === 0) {
    throw new Error('No YouTube channel found for this account');
  }

  const stats = channelData.items[0].statistics;

  return {
    viewCount: stats.viewCount || '0',
    subscriberCount: stats.subscriberCount || '0',
    videoCount: stats.videoCount || '0',
  };
};

export const fetchVideos = async (session: Session | null, maxResults: number = 10): Promise<Video[]> => {
  const accessToken = getAccessToken(session);

  // Get channel ID first
  const channelResponse = await fetch(`${YOUTUBE_API_BASE}/channels?part=contentDetails&mine=true`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!channelResponse.ok) {
    throw new Error('Failed to fetch channel details');
  }

  const channelData = await channelResponse.json();
  
  if (!channelData.items || channelData.items.length === 0) {
    throw new Error('No YouTube channel found');
  }

  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

  // Get videos from uploads playlist
  const playlistResponse = await fetch(
    `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!playlistResponse.ok) {
    throw new Error('Failed to fetch videos');
  }

  const playlistData = await playlistResponse.json();
  const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

  // Get video statistics
  const statsResponse = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=statistics,contentDetails&id=${videoIds}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!statsResponse.ok) {
    throw new Error('Failed to fetch video statistics');
  }

  const statsData = await statsResponse.json();

  // Combine data
  return playlistData.items.map((item: any, index: number) => {
    const stats = statsData.items[index]?.statistics || {};
    const contentDetails = statsData.items[index]?.contentDetails || {};
    
    return {
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      views: parseInt(stats.viewCount || '0'),
      likes: parseInt(stats.likeCount || '0'),
      comments: parseInt(stats.commentCount || '0'),
      duration: contentDetails.duration || 'PT0S',
    };
  });
};

const getDateRange = (duration: string) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (duration) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const fetchAnalytics = async (session: Session | null, duration: string = '30d'): Promise<AnalyticsData> => {
  const accessToken = getAccessToken(session);

  // Get current period dates
  const currentPeriod = getDateRange(duration);
  
  // Calculate days in period for percentage calculation
  const daysInPeriod = Math.floor((new Date(currentPeriod.endDate).getTime() - new Date(currentPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const previousEndDate = new Date(currentPeriod.startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - daysInPeriod + 1);

  // Fetch current period analytics
  const currentResponse = await fetch(
    `${YOUTUBE_ANALYTICS_API_BASE}/reports?ids=channel==MINE&startDate=${currentPeriod.startDate}&endDate=${currentPeriod.endDate}&metrics=views,subscribersGained,subscribersLost`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!currentResponse.ok) {
    const errorText = await currentResponse.text();
    throw new Error(`Failed to fetch current analytics: ${errorText}`);
  }

  const currentData = await currentResponse.json();

  // Fetch previous period analytics
  const previousResponse = await fetch(
    `${YOUTUBE_ANALYTICS_API_BASE}/reports?ids=channel==MINE&startDate=${previousStartDate.toISOString().split('T')[0]}&endDate=${previousEndDate.toISOString().split('T')[0]}&metrics=views,subscribersGained,subscribersLost`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!previousResponse.ok) {
    const errorText = await previousResponse.text();
    throw new Error(`Failed to fetch previous analytics: ${errorText}`);
  }

  const previousData = await previousResponse.json();

  // Parse current period data
  const currentViews = currentData.rows?.[0]?.[0] || 0;
  const currentSubsGained = currentData.rows?.[0]?.[1] || 0;
  const currentSubsLost = currentData.rows?.[0]?.[2] || 0;
  const currentSubsNet = currentSubsGained - currentSubsLost;

  // Parse previous period data
  const previousViews = previousData.rows?.[0]?.[0] || 0;
  const previousSubsGained = previousData.rows?.[0]?.[1] || 0;
  const previousSubsLost = previousData.rows?.[0]?.[2] || 0;
  const previousSubsNet = previousSubsGained - previousSubsLost;

  // Calculate percentage changes (avoid division by zero)
  const viewsChange = previousViews > 0 ? ((currentViews - previousViews) / previousViews) * 100 : (currentViews > 0 ? 100 : 0);
  const subscribersChange = previousSubsNet !== 0 ? ((currentSubsNet - previousSubsNet) / Math.abs(previousSubsNet)) * 100 : (currentSubsNet > 0 ? 100 : 0);

  return {
    views: currentViews,
    viewsChange,
    subscribers: currentSubsNet,
    subscribersChange,
  };
};