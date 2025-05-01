export interface IInternalProposal {
  itn_proposal_id: string
  itn_proposal_title: string
  itn_proposal_content?: string
  itn_proposal_type?: string
  itn_proposal_status: "pending" | "approved" | "rejected"
}
