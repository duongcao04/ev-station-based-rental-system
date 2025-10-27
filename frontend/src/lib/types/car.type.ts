import type { TBrand } from "./bard.type"
import type { TCategory } from "./category.type"
import type { TSpecificationType } from "./specification-type.type"
import type { TUom } from "./uom.type"

export type TCarSpecification = {
	id: string
	label: TSpecificationType,
	value: string
}

export type TCar = {
	id: string,
	displayName: string,
	depositPrice?: number
	regularPrice: number,
	salePrice: number,
	categories?: TCategory[],
	brand?: TBrand,
	inStock: boolean,
	specifications?: TCarSpecification[]
	description?: string
	uom: TUom
	thumbnailUrl: string,
	featuredImageUrls?: string[]
}