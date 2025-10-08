export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Memory {
  id: string;
  title: string;
  image: string;
  notes: string;
  location?: string;
  date: string;
  tripId?: string;
  userId: string;
  userName: string;
  reviews: Review[];
  likes: string[];
}