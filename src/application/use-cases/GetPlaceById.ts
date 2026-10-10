import { Place } from '../../domain/entities/Place';
import { PlaceRepository } from '../../domain/repositories/PlaceRepository';

export class GetPlaceByIdUseCase {
  constructor(private readonly repository: PlaceRepository) {}

  async execute(id: string): Promise<Place | null> {
    if (!id || id.trim() === '') {
      return null;
    }
    return this.repository.getById(id);
  }
}
