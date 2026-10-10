import { Memory } from '../entities/Memory';

export interface IMemoryRepository {
  getByPlaceId(placeId: string): Promise<Memory[]>;
  getAll(): Promise<Memory[]>;
  addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory>;
}
