import { Memory } from '../../domain/entities/Memory';
import { IMemoryRepository } from '../../domain/repositories/IMemoryRepository';

export class GetMemoriesByPlaceIdUseCase {
  constructor(private memoryRepository: IMemoryRepository) {}

  async execute(placeId: string): Promise<Memory[]> {
    if (!placeId) return [];
    return this.memoryRepository.getByPlaceId(placeId);
  }
}
