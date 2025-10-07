import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  viewsChange: number;
  uploadDate: string;
}

interface VideosTableProps {
  videos: Video[];
}

type SortField = 'title' | 'views' | 'viewsChange' | 'uploadDate';
type SortDirection = 'asc' | 'desc';

export const VideosTable = ({ videos }: VideosTableProps) => {
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedVideos = [...videos].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    
    if (sortField === 'uploadDate') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">
              <Button
                variant="ghost"
                onClick={() => handleSort('title')}
                className="hover:bg-muted"
              >
                Video
                <SortIcon field="title" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('views')}
                className="hover:bg-muted"
              >
                Views
                <SortIcon field="views" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('viewsChange')}
                className="hover:bg-muted"
              >
                Change
                <SortIcon field="viewsChange" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('uploadDate')}
                className="hover:bg-muted"
              >
                Upload Date
                <SortIcon field="uploadDate" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVideos.map((video) => (
            <TableRow key={video.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                  <span className="font-medium line-clamp-2">{video.title}</span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {video.views.toLocaleString()}
              </TableCell>
              <TableCell>
                <span className={video.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {video.viewsChange >= 0 ? '+' : ''}{video.viewsChange.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(video.uploadDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
