import { useState } from "react";

import { startOfWeek, add, isSameDay } from "date-fns";

import { IconButton, Button } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import TaskCard from "components/TaskCard";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import { getAssignmentMap, getAssignees } from "./utils";

import "./style.css";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const buttonBackgroundColor = "#288cfc";
const selectedStyle = {
  border: `1px solid ${buttonBackgroundColor}`,
  background: buttonBackgroundColor,
  color: "#fff",
};

function DateButton({
  date,
  selectedDate,
  setSelectedDate,
}: {
  date: Date;
  selectedDate: Date;
  setSelectedDate: (x: Date) => void;
}) {
  function handleClick() {
    setSelectedDate(date);
  }
  return (
    <div className="weekly-schedule__date-wrapper">
      <button
        style={isSameDay(date, selectedDate) ? selectedStyle : undefined}
        className="weekly-schedule__date-button"
        onClick={handleClick}
      >
        {date.getDate()}
      </button>
    </div>
  );
}

function SingleUserAssignment({
  username,
  tasks,
  taskAssignments,
  isAuthUser,
}: {
  username: string;
  tasks: Task[] | undefined;
  taskAssignments: TaskAssignment[];
  isAuthUser?: boolean;
}) {
  if (tasks === undefined || tasks.length === 0) {
    if (isAuthUser) return <p>You have no tasks</p>;
    return <p>{username} has no tasks</p>;
  }
  return (
    <>
      {" "}
      <p>{isAuthUser ? "You have" : `${username} has`} task(s):</p>
      <div className="weekly-schedule__scrollable-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assigneeNames={getAssignees(task.id, taskAssignments).map(
              (assignee) => assignee.name,
            )}
          />
        ))}
      </div>
    </>
  );
}

function WeeklySchedure() {
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment } = useApartment() as { apartment: Apartment };

  const today = new Date();
  const [startOfWeekDate, setStartOfWeekDate] = useState(
    startOfWeek(today, { weekStartsOn: 1 }),
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const assignmentMap = getAssignmentMap(
    startOfWeekDate,
    apartment.task_assignments,
    apartment.members.map((member) => member.username),
  );

  function handleClickNext() {
    const newStartOfWeekDate = add(startOfWeekDate, { weeks: 1 });
    setStartOfWeekDate(newStartOfWeekDate);
    setSelectedDate(newStartOfWeekDate);
  }

  function handleClickPrevious() {
    const newStartOfWeekDate = add(startOfWeekDate, { weeks: -1 });
    setStartOfWeekDate(newStartOfWeekDate);
    setSelectedDate(newStartOfWeekDate);
  }

  function handleResetCurrentDate() {
    setStartOfWeekDate(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  }

  return (
    <div className="weekly-schedule">
      <div className="weekly-schedule__header">
        <IconButton
          sx={{
            flexGrow: 1,
          }}
          onClick={handleClickPrevious}
        >
          <ChevronLeftIcon htmlColor="#047cfc" fontSize="inherit" />
        </IconButton>
        <div className="weekly-schedule__month-year-text">
          {months[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
        </div>
        <IconButton
          sx={{
            flexGrow: 1,
          }}
          onClick={handleClickNext}
        >
          <ChevronRightIcon htmlColor="#047cfc" fontSize="inherit" />
        </IconButton>
      </div>
      <div className="weekly-schedule__dates">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="weekly-schedule__day-date-block">
            <p>{weekDays[i]}</p>
            <DateButton
              date={add(startOfWeekDate, { days: i })}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        ))}
      </div>
      <Button
        variant="outlined"
        onClick={handleResetCurrentDate}
        className="weekly-schedule__reset-button"
      >
        Reset to today
      </Button>
      <SingleUserAssignment
        username={authState.username}
        tasks={assignmentMap.get(authState.username)}
        taskAssignments={apartment.task_assignments}
        isAuthUser
      />

      {Array.from(assignmentMap.keys())
        .filter((username) => username !== authState.username)
        .map((username) => (
          <SingleUserAssignment
            key={username}
            username={username}
            tasks={assignmentMap.get(username)}
            taskAssignments={apartment.task_assignments}
          />
        ))}
    </div>
  );
}

export default WeeklySchedure;
