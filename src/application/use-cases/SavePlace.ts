import { Place } from '../../domain/entities/Place';
import { PlaceRepository } from '../../domain/repositories/PlaceRepository';

export interface ISavedPlacesStorage {
  getSavedIds(): string[];
  saveId(id: string): void;
  removeId(id: string): void;
  isSaved(id: string): boolean;
}

export class SavePlaceUseCase {
  constructor(
    private readonly repository: PlaceRepository,
    private readonly storage: ISavedPlacesStorage
  ) {}

  toggleSave(id: string): boolean {
    if (this.storage.isSaved(id)) {
      this.storage.removeId(id);
      return false;
    } else {
      this.storage.saveId(id);
      return true;
    }
  }

  isSaved(id: string): boolean {
    return this.storage.isSaved(id);
  }

  getSavedIds(): string[] {
    return this.storage.getSavedIds();
  }

  async getSavedPlaces(): Promise<Place[]> {
    const ids = this.storage.getSavedIds();
    return this.repository.getSavedPlaces(ids);
  }
}
