export interface Memory {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  media: Media[];
  userId: string;
  userName: string;
  reviews: Review[];
  likes: string[];
  tags: string[];
  createdAt: string; // Add this line
}

export interface Media {
  id: string;
  type: 'image' | 'video' | 'note';
  url: string;
  thumbnail?: string;
  caption?: string;
  file?: File;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}