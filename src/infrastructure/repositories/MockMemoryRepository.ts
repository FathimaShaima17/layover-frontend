import { Memory } from '../../domain/entities/Memory';
import { IMemoryRepository } from '../../domain/repositories/IMemoryRepository';
import { INITIAL_MOCK_MEMORIES } from '../../data/mockMemories';

export class MockMemoryRepository implements IMemoryRepository {
  private memories: Memory[];

  constructor(initialData: Memory[] = INITIAL_MOCK_MEMORIES) {
    this.memories = [...initialData];
  }

  async getByPlaceId(placeId: string): Promise<Memory[]> {
    return this.memories.filter((m) => m.placeId === placeId);
  }

  async getAll(): Promise<Memory[]> {
    return [...this.memories];
  }

  async addMemory(memoryData: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    const newMemory: Memory = {
      ...memoryData,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    this.memories.unshift(newMemory);
    return newMemory;
  }
}
