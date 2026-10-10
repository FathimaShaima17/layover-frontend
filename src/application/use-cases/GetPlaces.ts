import { Place } from '../../domain/entities/Place';
import { PlaceRepository, PlaceFilterOptions } from '../../domain/repositories/PlaceRepository';

export class GetPlacesUseCase {
  constructor(private readonly repository: PlaceRepository) {}

  async execute(filters?: PlaceFilterOptions): Promise<Place[]> {
    return this.repository.getAll(filters);
  }
}
