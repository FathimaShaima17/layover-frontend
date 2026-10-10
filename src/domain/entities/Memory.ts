export interface Memory {
  id: string;
  placeId: string;
  travelerName: string;
  travelerAvatar?: string;
  caption: string;
  story: string;
  photoUrl: string;
  visitDate?: string;
  tags?: string[];
  createdAt: string;
}
