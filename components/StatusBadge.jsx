import { OUTLINE_STATUS } from "../constants/outlineStatus";
import "./status-badge.css";

export default function StatusBadge({ status }) {
  const labelMap = {
    [OUTLINE_STATUS.DRAFT]: "Draft",
    [OUTLINE_STATUS.PENDING_VICE_DEAN]: "Pending Vice Dean",
    [OUTLINE_STATUS.RETURNED]: "Returned",
    [OUTLINE_STATUS.PENDING_DEAN]: "Pending Dean",
    [OUTLINE_STATUS.FINAL]: "Final Approved",
  };

  return (
    <span className={`status-badge ${status}`}>
      {labelMap[status]}
    </span>
  );
}
