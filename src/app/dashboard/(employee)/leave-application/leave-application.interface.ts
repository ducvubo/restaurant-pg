export interface ILeaveApplication {
  leaveAppId: string;
  leaveAppResId?: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  approvedBy?: string;
  approvedAt?: string;
  approvalComment?: string;
}
