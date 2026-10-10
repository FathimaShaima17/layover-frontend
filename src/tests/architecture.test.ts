/**
 * Architecture & Domain Rule Verification Suite
 * Tests domain rules, value-objects, use-cases and repository independence
 */
import { isValidCoordinates, formatCoordinates } from '../domain/value-objects/Coordinates';
import { MockPlaceRepository } from '../infrastructure/repositories/MockPlaceRepository';
import { GetPlacesUseCase } from '../application/use-cases/GetPlaces';
import { SubmitPlaceUseCase } from '../application/use-cases/SubmitPlace';
import { SavePlaceUseCase, ISavedPlacesStorage } from '../application/use-cases/SavePlace';
import { INITIAL_MOCK_PLACES } from '../data/mockPlaces';

// In-Memory Storage Mock for testing SavePlaceUseCase without browser DOM
class InMemoryTestStorage implements ISavedPlacesStorage {
  private saved = new Set<string>();

  getSavedIds(): string[] {
    return Array.from(this.saved);
  }

  saveId(id: string): void {
    this.saved.add(id);
  }

  removeId(id: string): void {
    this.saved.delete(id);
  }

  isSaved(id: string): boolean {
    return this.saved.has(id);
  }
}

async function runTests() {
  console.log('🧪 Running HiddenAtlas Architecture & Domain Rule Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Coordinates Value-Object Tests
  console.log('1. Coordinates Value-Object');
  assert(isValidCoordinates(46.3384, 13.5528) === true, 'Accepts valid coordinates (Julian Alps)');
  assert(isValidCoordinates(0, 0) === true, 'Accepts equator/prime meridian (0, 0)');
  assert(isValidCoordinates(-90, 180) === true, 'Accepts exact boundary coordinates (-90, 180)');
  assert(isValidCoordinates(91, 50) === false, 'Rejects latitude > 90');
  assert(isValidCoordinates(-91, 50) === false, 'Rejects latitude < -90');
  assert(isValidCoordinates(45, 181) === false, 'Rejects longitude > 180');
  assert(isValidCoordinates(45, -181) === false, 'Rejects longitude < -180');
  assert(isValidCoordinates(NaN, 50) === false, 'Rejects NaN latitude');
  assert(formatCoordinates({ latitude: 44.3159, longitude: 9.1751 }).includes('N'), 'Formats Northern hemisphere correctly');

  // 2. MockPlaceRepository & GetPlacesUseCase Tests
  console.log('\n2. MockPlaceRepository & GetPlacesUseCase');
  const repository = new MockPlaceRepository(INITIAL_MOCK_PLACES);
  const getPlaces = new GetPlacesUseCase(repository);

  const allPlaces = await getPlaces.execute();
  assert(allPlaces.length === INITIAL_MOCK_PLACES.length, `Loads all initial mock destinations (${allPlaces.length})`);

  const hiddenGems = await getPlaces.execute({ type: 'hidden-gem' });
  assert(hiddenGems.every((p) => p.type === 'hidden-gem'), 'Filters by place type: hidden-gem');

  const naturePlaces = await getPlaces.execute({ category: 'nature' });
  assert(naturePlaces.every((p) => p.category === 'nature'), 'Filters by category: nature');

  const searchResults = await getPlaces.execute({ query: 'waterfall' });
  assert(searchResults.length > 0 && searchResults.some((p) => p.name.toLowerCase().includes('waterfall') || p.tags.includes('waterfall')), 'Performs multi-field query search');

  // 3. SubmitPlaceUseCase Tests
  console.log('\n3. SubmitPlaceUseCase');
  const submitPlace = new SubmitPlaceUseCase(repository);

  // Validation failure cases
  const invalidName = submitPlace.validate({
    name: 'ab',
    description: 'This is a long enough description for the place.',
    location: 'Slovenia',
    category: 'nature',
    type: 'hidden-gem',
    imageUrls: [],
    tags: [],
  });
  assert(!invalidName.isValid && !!invalidName.errors.name, 'Rejects short place name (< 3 chars)');

  const invalidCoords = submitPlace.validate({
    name: 'Secret Alpine Tarn',
    description: 'A secluded glacial tarn high above the pine tree line.',
    location: 'High Tatras',
    category: 'mountains',
    type: 'hidden-gem',
    latitude: 95, // Invalid
    longitude: 20,
    imageUrls: [],
    tags: [],
  });
  assert(!invalidCoords.isValid && !!invalidCoords.errors.latitude, 'Rejects out-of-range latitude in form DTO');

  // Successful submission case
  const created = await submitPlace.execute({
    name: 'Secret Sunken Church Tower',
    description: 'A 14th century bell tower emerging from an alpine turquoise reservoir.',
    location: 'Reschen Lake, South Tyrol',
    category: 'history',
    type: 'hidden-gem',
    latitude: 46.8105,
    longitude: 10.5366,
    imageUrls: ['https://images.unsplash.com/photo-1516483638261-f4dbaf036963'],
    tags: ['bell-tower', 'reservoir'],
  });
  assert(created.status === 'pending', 'Newly submitted discovery is marked as pending review');
  assert(created.id.startsWith('place-custom-'), 'Generates a unique destination ID');

  // 4. SavePlaceUseCase & Storage Tests
  console.log('\n4. SavePlaceUseCase');
  const testStorage = new InMemoryTestStorage();
  const savePlace = new SavePlaceUseCase(repository, testStorage);

  assert(savePlace.isSaved('place-01') === false, 'Initially destination is not bookmarked');
  const savedState1 = savePlace.toggleSave('place-01');
  assert(savedState1 === true, 'toggleSave adds destination to bookmarks');
  assert(savePlace.isSaved('place-01') === true, 'isSaved confirms place is bookmarked');

  const savedState2 = savePlace.toggleSave('place-01');
  assert(savedState2 === false, 'toggleSave removes destination on second call');
  assert(savePlace.isSaved('place-01') === false, 'isSaved confirms place was unbookmarked');

  console.log(`\n================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
