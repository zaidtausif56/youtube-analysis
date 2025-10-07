import { Video } from "@/components/VideosTable";

// Mock data - replace with actual API calls
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "How to Build a React Dashboard in 2024 | Complete Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
    views: 125430,
    viewsChange: 15.3,
    uploadDate: "2024-09-15",
  },
  {
    id: "2",
    title: "10 JavaScript Tips Every Developer Should Know",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
    views: 98765,
    viewsChange: -2.4,
    uploadDate: "2024-08-22",
  },
  {
    id: "3",
    title: "TypeScript Advanced Patterns for Production Apps",
    thumbnail: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=225&fit=crop",
    views: 87234,
    viewsChange: 8.7,
    uploadDate: "2024-10-01",
  },
  {
    id: "4",
    title: "Building Scalable APIs with Node.js",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    views: 76543,
    viewsChange: 12.1,
    uploadDate: "2024-09-05",
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Each",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop",
    views: 65432,
    viewsChange: -5.2,
    uploadDate: "2024-07-18",
  },
];

export const mockStats = {
  totalViews: 453404,
  totalViewsChange: 8.5,
  subscribers: 42567,
  subscribersChange: 3.2,
  videoCount: 127,
};
