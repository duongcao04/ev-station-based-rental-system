import type { TBrand } from "./brand.type"
import type { TCarSpecification } from "./car-specification.type"
import type { TCategory } from "./category.type"

export type TCar = {
	id: string,
	displayName: string,
	sku: string,
	quantity: number,
	slug: string,
	depositPrice?: number
	regularPrice: number,
	salePrice: number,
	categories?: TCategory[],
	brand?: TBrand,
	isInStock: boolean,
	specifications?: TCarSpecification[]
	description?: string
	thumbnailUrl: string,
	featuredImageUrls?: string[]
}