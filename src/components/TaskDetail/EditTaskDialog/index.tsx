import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";
import taskService from "services/task";

import "components/sharedStyles/taskFormStyle.css";

function toInputTypeDateFormat(dateString: string) {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString("en-CA");
}

interface IFormInput {
  name: string;
  description: string;
  difficulty: string;
  frequency: string;
  start: string;
  end: string;
}

function EditTaskDialog({
  open,
  setOpen,
  task,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  task: Task;
}) {
  const defaultTaskValues = {
    name: task.name,
    description: task.description,
    difficulty: String(task.difficulty),
    frequency: String(task.frequency),
    start: toInputTypeDateFormat(task.start),
    end: toInputTypeDateFormat(task.end),
  };
  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultTaskValues,
  });
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment, setApartment } = useApartment() as {
    apartment: Apartment;
    setApartment: (x: Apartment | "") => void;
  };

  function resetAllFields() {
    reset(defaultTaskValues);
  }

  function handleClose() {
    resetAllFields();
    setOpen(false);
  }

  async function onSubmit(data: IFormInput) {
    try {
      const updatedTask = await taskService.update(authState.token, task.id, {
        name: data.name,
        description: data.description,
        difficulty: Number(data.difficulty),
        frequency: Number(data.frequency),
        start: data.start,
        end: data.end,
      });
      toast.success(`Update task ${updatedTask.name}`, {
        position: toast.POSITION.TOP_CENTER,
      });

      const updatedTaskRequests = apartment.task_requests.map((taskRequest) =>
        taskRequest.task.id === updatedTask.id
          ? { ...taskRequest, task: updatedTask }
          : taskRequest,
      );
      const updatedTaskAssignments = apartment.task_assignments.map(
        (taskAssignment) =>
          taskAssignment.task.id === updatedTask.id
            ? { ...taskAssignment, task: updatedTask }
            : taskAssignment,
      );
      setApartment({
        ...apartment,
        task_requests: updatedTaskRequests,
        task_assignments: updatedTaskAssignments,
      });
    } catch (err) {
      console.log(err);
      toast.error("Fail to update task", {
        position: toast.POSITION.TOP_CENTER,
      });
      resetAllFields();
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <DialogTitle>Edit task-{task.id}</DialogTitle>
        <DialogContent>
          <label>Name</label>
          <input
            {...register("name", {
              required: true,
              maxLength: 50,
            })}
          />
          <label>Description</label>
          <textarea
            rows={10}
            cols={30}
            {...register("description", {
              required: true,
              maxLength: 500,
            })}
          ></textarea>
          <label>Difficulty (N out of 10)</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("difficulty", {
              required: true,
            })}
          />
          <label>Frequency (every N weeks)</label>
          <input
            type="number"
            min="1"
            max="10"
            {...register("frequency", {
              required: true,
            })}
          />
          <div className="task-form__date_inputs">
            <div className="task-form__date_input">
              <label>Start Date</label>
              <input
                type="date"
                {...register("start", {
                  required: true,
                })}
              />
            </div>
            <div className="task-form__date_input">
              <label>End Date</label>
              <input
                type="date"
                {...register("end", {
                  required: true,
                })}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update task</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditTaskDialog;
