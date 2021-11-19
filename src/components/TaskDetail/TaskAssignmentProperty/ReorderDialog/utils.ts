import {
  add,
  differenceInDays,
  endOfWeek,
  format,
  isAfter,
  isEqual,
  startOfWeek,
} from "date-fns";

import _ from "lodash";

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

function getWeekRange(date: Date): string {
  const weekBeginDate = startOfWeek(date, { weekStartsOn: 1 });
  const weekEndDate = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(weekBeginDate, "dd/MM/yyyy")} - ${format(
    weekEndDate,
    "dd/MM/yyyy",
  )}`;
}

export function getTaskPreviews(task: Task, assigneeCount: number): string[] {
  const currentDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const beginDate = startOfWeek(new Date(task.start), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(task.end), { weekStartsOn: 1 });

  if (!isAfter(currentDate, beginDate)) {
    const taskPreviewsResult = _.range(assigneeCount).map((order) => {
      const nextTaskBeginDate = add(beginDate, {
        weeks: order * task.frequency,
      });

      if (isAfter(nextTaskBeginDate, endDate)) {
        return "No more tasks";
      } else if (isEqual(nextTaskBeginDate, currentDate)) {
        return "This week";
      } else {
        return getWeekRange(nextTaskBeginDate);
      }
    });
    return taskPreviewsResult;
  } else {
    const daysDifference = differenceInDays(currentDate, beginDate);
    const weeksDifference = daysDifference / 7;

    const remainder = weeksDifference % (task.frequency * assigneeCount);

    const taskPreviewsResult = _.range(assigneeCount).map((order) => {
      const nextTaskBeginDate =
        remainder === order * task.frequency
          ? currentDate
          : remainder > order * task.frequency
          ? add(currentDate, {
              weeks: task.frequency * (assigneeCount + order) - remainder,
            })
          : add(currentDate, {
              weeks: order * task.frequency - remainder,
            });

      if (isAfter(nextTaskBeginDate, endDate)) {
        return "No more tasks";
      } else if (isEqual(nextTaskBeginDate, currentDate)) {
        return "This week";
      } else {
        return getWeekRange(nextTaskBeginDate);
      }
    });
    return taskPreviewsResult;
  }
}
