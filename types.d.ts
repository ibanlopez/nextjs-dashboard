type Revenue = {
	month: string
	revenue: number
}[]

type LatestInvoices = {
	amount: string
	id: string
	image_url: string
	name: string
	email: string
}[]

type CardData = {
	numberOfCustomers: number
	numberOfInvoices: number
	totalPaidInvoices: string
	totalPendingInvoices: string
}
