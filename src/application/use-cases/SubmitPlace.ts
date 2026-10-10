import { Place, Coordinates } from '../../domain/entities/Place';
import { PlaceRepository } from '../../domain/repositories/PlaceRepository';
import { isValidCoordinates } from '../../domain/value-objects/Coordinates';
import { SubmitPlaceFormDto, ValidationResult } from '../dto/PlaceDto';

export class SubmitPlaceUseCase {
  constructor(private readonly repository: PlaceRepository) {}

  validate(dto: SubmitPlaceFormDto): ValidationResult {
    const errors: Record<string, string> = {};

    if (!dto.name || dto.name.trim().length < 3) {
      errors.name = 'Place name must be at least 3 characters.';
    }

    if (!dto.description || dto.description.trim().length < 15) {
      errors.description = 'Please provide a descriptive summary of at least 15 characters.';
    }

    if (!dto.location || dto.location.trim().length < 2) {
      errors.location = 'Location (town/city/region) is required.';
    }

    if (!dto.category) {
      errors.category = 'Please select a valid category.';
    }

    if (!dto.type) {
      errors.type = 'Please specify if this is a Hidden Gem or Famous Attraction.';
    }

    // Latitude validation if provided
    if (dto.latitude !== undefined && dto.latitude !== '') {
      const lat = Number(dto.latitude);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be a valid number between -90 and 90.';
      }
    }

    // Longitude validation if provided
    if (dto.longitude !== undefined && dto.longitude !== '') {
      const lng = Number(dto.longitude);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        errors.longitude = 'Longitude must be a valid number between -180 and 180.';
      }
    }

    // If one coordinate is filled, both should ideally be filled
    const hasLat = dto.latitude !== undefined && dto.latitude !== '';
    const hasLng = dto.longitude !== undefined && dto.longitude !== '';
    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      errors.coordinates = 'Please provide both latitude and longitude, or leave both blank.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(dto: SubmitPlaceFormDto): Promise<Place> {
    const validation = this.validate(dto);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError || 'Validation failed');
    }

    let coordinates: Coordinates | undefined = undefined;
    if (
      dto.latitude !== undefined &&
      dto.latitude !== '' &&
      dto.longitude !== undefined &&
      dto.longitude !== ''
    ) {
      const lat = Number(dto.latitude);
      const lng = Number(dto.longitude);
      if (isValidCoordinates(lat, lng)) {
        coordinates = { latitude: lat, longitude: lng };
      }
    }

    // Compose location display string if town/district provided
    let fullLocation = dto.location.trim();
    if (dto.town && !fullLocation.includes(dto.town)) {
      fullLocation = `${dto.town}, ${fullLocation}`;
    }

    const nearbyLandmarks: string[] = [];
    if (dto.nearbyLandmark && dto.nearbyLandmark.trim()) {
      nearbyLandmarks.push(dto.nearbyLandmark.trim());
    }

    // Filter valid image URLs or fallback default
    const validImages = dto.imageUrls.filter((url) => url && url.trim().length > 0);
    const images = validImages.length > 0 ? validImages : [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ];

    return this.repository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
      story: dto.story?.trim() || undefined,
      category: dto.category,
      type: dto.type,
      location: fullLocation,
      coordinates,
      images,
      bestTimeToVisit: dto.bestTimeToVisit?.trim() || undefined,
      routeDescription: dto.routeDescription?.trim() || undefined,
      accessibility: dto.accessibility?.trim() || undefined,
      tags: dto.tags.length > 0 ? dto.tags : ['community-discovery'],
      estimatedDuration: dto.estimatedDuration?.trim() || undefined,
      nearbyLandmarks: nearbyLandmarks.length > 0 ? nearbyLandmarks : undefined,
      submittedBy: 'Community Explorer (You)',
    });
  }
}
