import { Prisma } from '@prisma/client';

export type CarFilterParamsDto = {
  brandIds?: string[];
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number; // Nếu = 0 hoặc undefined thì coi như không giới hạn
};