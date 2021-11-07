import { useState } from "react";

import { startOfWeek, add, isSameDay } from "date-fns";

import { Box, IconButton, Button, Typography } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";
import { getAssignmentMap, getAssignerUsernames } from "./utils";

import TaskCard from "../TaskCard";

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
  border: `5px solid ${buttonBackgroundColor}`,
  borderRadius: "50%",
  width: "2rem",
  height: "2rem",
  background: buttonBackgroundColor,
  color: "white",
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
    if (isAuthUser) return <p>You don't have any assignments this week</p>;
    return <p>{username} doesn't have any assignments this week</p>;
  }
  return (
    <>
      {" "}
      <p>{isAuthUser ? "You have" : `${username} has`} task(s):</p>
      <div
        style={{
          display: "flex",
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assigners={getAssignerUsernames(task.id, taskAssignments)}
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
      <Button variant="outlined" onClick={handleResetCurrentDate}>
        Reset to current date
      </Button>
    </div>
  );
}

export default WeeklySchedure;
