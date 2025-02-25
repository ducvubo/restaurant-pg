import { ILabel } from '../labels/label.interface'

export interface IWorkingShift {
  wks_name: string
  wks_description: string
  wks_res_id?: string
  wks_start_time?: string
  wks_end_time?: string
  createdBy?: string
  updatedBy?: any
  deletedBy?: any
  wks_id: string
  wks_status?: string
}
