export function reorder(
  previousOrder: Assignment[],
  startIndex: number,
  endIndex: number,
): Assignment[] {
  const newOrder = Array.from(previousOrder);
  const [removed] = newOrder.splice(startIndex, 1);
  newOrder.splice(endIndex, 0, removed);

  return newOrder;
}

export function getTaskPreview(
  order: number,
  taskStartDate: Date,
  taskEndDate: Date,
): string {
  return "";
}
