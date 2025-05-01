export interface IEquipmentMaintenance {
  eqp_mtn_id: string
  eqp_mtn_name: string
  eqp_mtn_cost: number
  eqp_mtn_date_fixed: Date
  eqp_mtn_date_reported: Date
  eqp_mtn_issue_description: string
  eqp_mtn_location: string
  eqp_mtn_note: string
  eqp_mtn_performed_by: string
  eqp_mtn_reported_by: string
  eqp_mtn_status: 'pending' | ' in_progress' | ' done' | ' rejected'
}
