import { Place } from '../../domain/entities/Place';
import { PlaceRepository, PlaceFilterOptions } from '../../domain/repositories/PlaceRepository';

export class SearchPlacesUseCase {
  constructor(private readonly repository: PlaceRepository) {}

  async execute(options: PlaceFilterOptions): Promise<Place[]> {
    return this.repository.search(options);
  }
}
