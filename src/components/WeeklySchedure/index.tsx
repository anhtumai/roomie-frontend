import { useState } from "react";

import { startOfWeek, add } from "date-fns";

import { Box, IconButton } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import useAuth from "../../contexts/auth";
import useApartment from "../../contexts/apartment";
import { getAssignmentMap, getAssignerUsernames } from "./utils";

import TaskCard from "./TaskCard";

import "./style.css";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  const assignmentMap = getAssignmentMap(
    startOfWeekDate,
    apartment.task_assignments,
    apartment.members.map((member) => member.username),
  );
  console.log(assignmentMap);

  function handleClickNext() {
    setStartOfWeekDate(add(startOfWeekDate, { weeks: 1 }));
  }
  function handleClickPrevious() {
    setStartOfWeekDate(add(startOfWeekDate, { weeks: -1 }));
  }
  return (
    <Box
      sx={{
        width: "700px",
        border: 1,
        borderColor: "black",
      }}
      className="weekly-schedure"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <IconButton
          sx={{
            flexGrow: 1,
          }}
          onClick={handleClickPrevious}
        >
          <ChevronLeftIcon />
        </IconButton>
        <div
          style={{
            flexGrow: 12,
            display: "flex",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          {months[startOfWeekDate.getMonth() - 1]},{" "}
          {startOfWeekDate.getFullYear()}
        </div>
        <IconButton
          sx={{
            flexGrow: 1,
          }}
          onClick={handleClickNext}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="date">
            <p>{weekDays[i]}</p>
            <p>{add(startOfWeekDate, { days: i }).getDate()}</p>
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
    </Box>
  );
}

export default WeeklySchedure;
