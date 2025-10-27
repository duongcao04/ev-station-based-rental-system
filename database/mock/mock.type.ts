type SpecificationType = {
	id: string,
	label: string,
	icon?: string,
	description?: string
}
type Category = {
	id: string,
	displayName: string,
	description: string,
	thumbnailUrl?: string
}
type Brand = {
	id: string,
	displayName: string,
	description: string,
	thumbnailUrl?: string
}
type Uom = {
	id: string,
	displayName: string,
	description: string
}
type CarSpecification = {
	id: string
	label: SpecificationType,
	value: string
}
type Car = {
	id: string,
	depositPrice?: number
	regularPrice: number,
	salePrice: number,
	categories?: Category[],
	brand?: Brand,
	inStock: boolean,
	specifications?: CarSpecification[]
	description?: string
	uom: Uom
	thumbnailUrl: string,
	featuredImageUrls?: string[]
}