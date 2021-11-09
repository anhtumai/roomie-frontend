export function getAbbreviation(name: string) {
  return name
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

export function getAssigneeUsernames(
  taskId: number,
  apartment: Apartment,
): string[] {
  const taskRequests = apartment.task_requests;
  const taskAssignments = apartment.task_assignments;

  const taskRequest = taskRequests.find(
    (element) => element.task.id === taskId,
  );

  if (taskRequest) {
    return taskRequest.requests.map((_request) => _request.assigner.username);
  }

  const taskAssignment = taskAssignments.find(
    (element) => element.task.id === taskId,
  );
  if (taskAssignment)
    return taskAssignment.assignments.map(
      (assignment) => assignment.assigner.username,
    );
  return [];
}
