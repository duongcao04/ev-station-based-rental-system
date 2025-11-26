import { useState, useMemo } from 'react';
import type { TFilterState } from '../pages/thue-xe-tu-lai/components/FilterBarView';
import type { TCar } from '../lib/types/car.type';

export const useVehicleFilter = (vehicles: TCar[] | undefined) => {
	const [filters, setFilters] = useState<TFilterState>({
		brands: [],
		categories: [],
		priceRange: { min: 0, max: 0 },
	});

	const filteredVehicles = useMemo<TCar[]>(() => {
		if (!vehicles) return [];

		return vehicles.filter((car) => {
			// 1. Filter Brand
			const matchBrand =
				filters.brands.length === 0 ||
				(typeof car.brandId === 'string' && filters.brands.includes(car.brandId));

			// 2. Filter Category
			const matchCategory =
				filters.categories.length === 0 ||
				(Array.isArray(car.categories) &&
					car.categories.some((cat) => filters.categories.includes(cat.id)));

			// 3. Filter Price
			const price = Number(car.salePrice ?? car.regularPrice);
			const matchPrice =
				price >= filters.priceRange.min &&
				(filters.priceRange.max === 0 || price <= filters.priceRange.max);

			return matchBrand && matchCategory && matchPrice;
		});
	}, [vehicles, filters]);

	// Hàm helper để reset filter
	const resetFilters = () => {
		setFilters({ brands: [], categories: [], priceRange: { min: 0, max: 0 } });
	};

	return {
		filters,
		setFilters,
		filteredVehicles,
		resetFilters
	};
};