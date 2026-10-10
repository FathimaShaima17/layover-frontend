import { Memory } from '../../domain/entities/Memory';
import { IMemoryRepository } from '../../domain/repositories/IMemoryRepository';

export interface AddMemoryDTO {
  placeId: string;
  travelerName: string;
  travelerAvatar?: string;
  caption: string;
  story: string;
  photoUrl: string;
  visitDate?: string;
  tags?: string[];
}

export class AddMemoryUseCase {
  constructor(private memoryRepository: IMemoryRepository) {}

  validate(dto: AddMemoryDTO): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!dto.placeId) {
      errors.placeId = 'Place ID is required';
    }
    if (!dto.travelerName || dto.travelerName.trim().length < 2) {
      errors.travelerName = 'Traveler name must be at least 2 characters';
    }
    if (!dto.caption || dto.caption.trim().length < 3) {
      errors.caption = 'Caption must be at least 3 characters';
    }
    if (!dto.story || dto.story.trim().length < 10) {
      errors.story = 'Please share at least a short story or travel note (10+ characters)';
    }
    if (!dto.photoUrl || !dto.photoUrl.trim().startsWith('http')) {
      errors.photoUrl = 'A valid photo URL is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async execute(dto: AddMemoryDTO): Promise<Memory> {
    const validation = this.validate(dto);
    if (!validation.isValid) {
      throw new Error(`Invalid memory submission: ${JSON.stringify(validation.errors)}`);
    }

    return this.memoryRepository.addMemory({
      placeId: dto.placeId,
      travelerName: dto.travelerName.trim(),
      travelerAvatar: dto.travelerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      caption: dto.caption.trim(),
      story: dto.story.trim(),
      photoUrl: dto.photoUrl.trim(),
      visitDate: dto.visitDate || undefined,
      tags: dto.tags || [],
    });
  }
}
