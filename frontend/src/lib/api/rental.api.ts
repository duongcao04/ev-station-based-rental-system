export const rentalApi = {
	getRentals: async () => {
		const response = await fetch("/api/rentals")
		if (!response.ok) throw new Error("Failed to fetch rentals")
		return response.json()
	},
	getRental: async (id: string | number) => {
		const response = await fetch(`/api/rentals/${id}`)
		if (!response.ok) throw new Error("Failed to fetch rental")
		return response.json()
	},
	createRental: async (data: any) => {
		const response = await fetch("/api/rentals", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
		if (!response.ok) throw new Error("Failed to create rental")
		return response.json()
	},
	updateRental: async (id: string | number, data: any) => {
		const response = await fetch(`/api/rentals/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
		if (!response.ok) throw new Error("Failed to update rental")
		return response.json()
	},
	deleteRental: async (id: string | number) => {
		const response = await fetch(`/api/rentals/${id}`, { method: "DELETE" })
		if (!response.ok) throw new Error("Failed to delete rental")
		return response.json()
	},
}
