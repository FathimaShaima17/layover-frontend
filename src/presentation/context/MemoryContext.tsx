import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Memory } from '../../domain/entities/Memory';
import { MockMemoryRepository } from '../../infrastructure/repositories/MockMemoryRepository';
import { GetMemoriesByPlaceIdUseCase } from '../../application/use-cases/GetMemoriesByPlaceId';
import { AddMemoryUseCase, AddMemoryDTO } from '../../application/use-cases/AddMemory';
import { INITIAL_MOCK_MEMORIES } from '../../data/mockMemories';

interface MemoryContextValue {
  getMemoriesByPlaceId: (placeId: string) => Promise<Memory[]>;
  getAllMemories: () => Promise<Memory[]>;
  addMemory: (dto: AddMemoryDTO) => Promise<Memory>;
}

const memoryRepository = new MockMemoryRepository(INITIAL_MOCK_MEMORIES);

const MemoryContext = createContext<MemoryContextValue | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getMemoriesUseCase = useMemo(() => new GetMemoriesByPlaceIdUseCase(memoryRepository), []);
  const addMemoryUseCase = useMemo(() => new AddMemoryUseCase(memoryRepository), []);
  const [, setRevision] = useState(0);

  const getMemoriesByPlaceId = useCallback(
    async (placeId: string): Promise<Memory[]> => {
      return getMemoriesUseCase.execute(placeId);
    },
    [getMemoriesUseCase]
  );

  const getAllMemories = useCallback(async (): Promise<Memory[]> => {
    return memoryRepository.getAll();
  }, []);

  const addMemory = useCallback(
    async (dto: AddMemoryDTO): Promise<Memory> => {
      const created = await addMemoryUseCase.execute(dto);
      setRevision((r) => r + 1);
      return created;
    },
    [addMemoryUseCase]
  );

  const value = useMemo(
    () => ({
      getMemoriesByPlaceId,
      getAllMemories,
      addMemory,
    }),
    [getMemoriesByPlaceId, getAllMemories, addMemory]
  );

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
};

export const useMemories = (): MemoryContextValue => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemories must be used within a MemoryProvider');
  }
  return context;
};
