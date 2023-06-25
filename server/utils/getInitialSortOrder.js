const SORT_ORDER_DESC = "desc";

export const getInitialSortOrder = (order = SORT_ORDER_DESC) => ({
  createdAt: order === SORT_ORDER_DESC ? -1 : 1,
});
