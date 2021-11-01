import {
  startOfWeek,
  endOfWeek,
  compareAsc,
  differenceInDays,
  format,
} from "date-fns";

export function getAssignmentMap(
  currentDate: Date,
  taskAssignments: TaskAssignment[],
  memberUsernames: string[],
) {
  const result = new Map<string, Task[]>();
  for (const username of memberUsernames) {
    result.set(username, []);
  }

  for (const taskAssignment of taskAssignments) {
    const { task, assignments } = taskAssignment;
    const beginDate = startOfWeek(new Date(task.start), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(task.end), { weekStartsOn: 1 });

    if (
      compareAsc(currentDate, beginDate) !== -1 &&
      compareAsc(endDate, currentDate) !== -1
    ) {
      const daysDifference = differenceInDays(currentDate, beginDate);
      const weeksDifference = daysDifference / 7;
      const remainder = weeksDifference % (task.frequency * assignments.length);
      const order = (remainder + 1) / task.frequency - 1;
      const assigner = assignments.find(
        (assignment) => assignment.order === order,
      )?.assigner;
      if (!assigner) {
        continue;
      }
      result.set(assigner.username, [
        ...(result.get(assigner.username) as Task[]),
        task,
      ]);
    }
  }

  return result;
}

export function getAssignerUsernames(
  taskId: number,
  taskAssignments: TaskAssignment[],
): string[] {
  const taskAssignment = taskAssignments.find(
    (element) => element.task.id === taskId,
  );
  if (!taskAssignment) return [];
  return taskAssignment.assignments.map(
    (assignment) => assignment.assigner.username,
  );
}
