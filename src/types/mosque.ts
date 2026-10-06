export type Mosque = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  isPreferred: boolean;
};

export type MosqueMatch = {
  mosque: Pick<Mosque, 'name' | 'address' | 'latitude' | 'longitude'>;
  distanceMeters: number;
  /** 0..1 combined score of distance, name and address similarity. */
  score: number;
};
