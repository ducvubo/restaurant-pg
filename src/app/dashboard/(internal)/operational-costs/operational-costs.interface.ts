export interface IOperationalCosts {
  opera_cost_id: string
  opera_cost_type: string
  opera_cost_amount: number
  opera_cost_date: Date
  opera_cost_description: string
  opera_cost_status: 'pending' | 'paid' | 'canceled'
}
