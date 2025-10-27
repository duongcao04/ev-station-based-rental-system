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
type CarSpecification = {
	id: string
	label: SpecificationType,
	value: string
}
type Car = {
	id: string,
	regularPrice: number,
	salePrice?: number,
	depositPrice?: number
	categories?: Category[],
	brand?: Brand,
	quantity?: number
	isInStock: boolean,
	specifications?: CarSpecification[]
	description?: string
	thumbnailUrl: string,
	featuredImageUrls?: string[]
}