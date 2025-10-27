import { type TCar } from '@/lib/types/car.type'

export interface CarWithFavorite extends TCar {
	isFavorite: boolean
}