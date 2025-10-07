export interface Memory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'photo' | 'video' | 'note';
  date: string;
  location: string;
  tags: string[];
  createdAt: Date;
}

export interface MemoryFormData {
  title: string;
  description: string;
  file: File | null;
  type: 'photo' | 'video' | 'note';
  location: string;
  tags: string;
}