import { ILabel } from "../labels/label.interface"
import { IWorkingShift } from "../working-shifts/working-shift.interface"

export interface IWorkSchedule {
  ws_id: string
  ws_res_id: string
  lb_id: string | ILabel
  wks_id: string | IWorkingShift
  ws_date: Date
  ws_note: string
}