import { OUTLINE_STATUS } from "../constants/outlineStatus";

export const canSubmitToViceDean = (status) =>
  status === OUTLINE_STATUS.DRAFT ||
  status === OUTLINE_STATUS.RETURNED;

export const canViceDeanReview = (status) =>
  status === OUTLINE_STATUS.PENDING_VICE_DEAN;

export const canForwardToDean = (status) =>
  status === OUTLINE_STATUS.PENDING_VICE_DEAN;

export const canDeanApprove = (status) =>
  status === OUTLINE_STATUS.PENDING_DEAN;
