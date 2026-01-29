export interface Category {
  _id: string;
  name: string;
  totalCar: number;
  voteStatus: boolean;
  Reward: number;
  categorySlug: string;
  description: string;
  image: string;
  battleCost: number;
}

export interface FormData {
  name: string;
  Reward: string;
  categorySlug: string;
  description: string;
  battleCost: string;
  image: File | string | null;
}