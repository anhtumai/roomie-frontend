import { startOfWeek, endOfWeek, compareAsc, differenceInDays } from "date-fns";

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
      const assignee = assignments.find(
        (assignment) => assignment.order === order,
      )?.assignee;
      if (!assignee) {
        continue;
      }
      result.set(assignee.username, [
        ...(result.get(assignee.username) as Task[]),
        task,
      ]);
    }
  }

  return result;
}

export function getAssignees(
  taskId: number,
  taskAssignments: TaskAssignment[],
): Member[] {
  const taskAssignment = taskAssignments.find(
    (element) => element.task.id === taskId,
  );
  if (!taskAssignment) return [];
  return taskAssignment.assignments.map((assignment) => assignment.assignee);
}
