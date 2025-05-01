export interface IOperationManual {
  opera_manual_id: string
  opera_manual_title: string
  opera_manual_content?: string
  opera_manual_type?: string
  opera_manual_note?: string
  opera_manual_status: "active" | "archived"
}
