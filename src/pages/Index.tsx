import { useState, useEffect } from "react";
import { Eye, Users, VideoIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { DurationFilter, Duration } from "@/components/DurationFilter";
import { VideosTable, Video } from "@/components/VideosTable";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { fetchChannelStats, fetchVideos, fetchAnalytics } from "@/services/youtubeApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedDuration, setSelectedDuration] = useState<Duration>('30d');
  const [loading, setLoading] = useState(true);
  const [channelStats, setChannelStats] = useState({ viewCount: '0', subscriberCount: '0', videoCount: '0' });
  const [analytics, setAnalytics] = useState({ views: 0, viewsChange: 0, subscribers: 0, subscribersChange: 0 });
  const [videos, setVideos] = useState<Video[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!session) return;
      
      setLoading(true);
      try {
        const [statsData, analyticsData, videosData] = await Promise.all([
          fetchChannelStats(session),
          fetchAnalytics(session, selectedDuration),
          fetchVideos(session, 10),
        ]);
        
        setChannelStats(statsData);
        setAnalytics(analyticsData);
        setVideos(videosData.map(v => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          views: v.views,
          viewsChange: 0, // Would need separate analytics call per video for this
          uploadDate: v.publishedAt.split('T')[0],
        })));
      } catch (error) {
        console.error('Error loading YouTube data:', error);
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Failed to fetch YouTube data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, selectedDuration, toast]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container px-6 py-8">
          {/* Duration Filter */}
          <div className="mb-6">
            <DurationFilter 
              selected={selectedDuration} 
              onChange={setSelectedDuration}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <StatsCard
              title="Total Views"
              value={loading ? 0 : analytics.views}
              change={{
                value: analytics.viewsChange,
                period: selectedDuration
              }}
              icon={Eye}
            />
            <StatsCard
              title="Subscribers"
              value={loading ? 0 : parseInt(channelStats.subscriberCount)}
              change={{
                value: analytics.subscribersChange,
                period: selectedDuration
              }}
              icon={Users}
            />
            <StatsCard
              title="Videos"
              value={loading ? 0 : parseInt(channelStats.videoCount)}
              icon={VideoIcon}
            />
          </div>

          {/* Videos Table */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Videos</h2>
            <VideosTable videos={loading ? [] : videos} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
