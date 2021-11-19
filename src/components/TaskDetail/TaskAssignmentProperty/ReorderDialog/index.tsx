import { useState } from "react";

import _ from "lodash";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";

import MemberDisplay from "../../MemberDisplay";

import taskService from "../../../../services/task";
import useAuth from "../../../../contexts/auth";

import { reorder, getTaskPreviews } from "./utils";

import "./style.css";

function ReorderDialog({
  open,
  setOpen,
  taskAssignment,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  taskAssignment: TaskAssignment;
}) {
  const queryClient = useQueryClient();
  const { authState } = useAuth() as { authState: UserWithToken };

  const { task, assignments } = taskAssignment;
  const sortedAssignmentsByOrder = _.sortBy(assignments, ["order"]);
  const [currentOrder, setCurrentOrder] = useState<Assignment[]>(
    sortedAssignmentsByOrder,
  );

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    const assignmentUsernames = assignments.map(
      (assignment) => assignment.assignee.username,
    );
    const currentOrderUsernames = currentOrder.map(
      (assignment) => assignment.assignee.username,
    );

    if (_.isEqual(assignmentUsernames, currentOrderUsernames)) {
      setOpen(false);
      return;
    }

    try {
      await taskService.updateOrder(
        authState.token,
        task.id,
        currentOrderUsernames,
      );
      toast.success(
        `Reorder TASK-${task.id} to ${currentOrderUsernames.join(", ")}`,
        { position: toast.POSITION.TOP_CENTER },
      );
      queryClient.invalidateQueries("apartment");
    } catch (err) {
      console.log(err);
      toast.error("Fail to re-assign the task", {
        position: toast.POSITION.TOP_CENTER,
      });
      setCurrentOrder(assignments);
    } finally {
      setOpen(false);
    }
  }

  function onEnd(result: DropResult) {
    console.log(result);

    if (!result.destination) return;

    const newOrder = reorder(
      currentOrder,
      result.source.index,
      result.destination.index,
    );

    setCurrentOrder(newOrder);
  }

  return (
    <DragDropContext onDragEnd={onEnd}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        className="reorder-dialog"
      >
        <DialogContent>
          <Grid
            container
            spacing={0}
            sx={{
              width: "28rem",
            }}
          >
            <Grid item xs={6}>
              <h3>Order</h3>
              <Droppable droppableId="orderlist">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    {currentOrder.map((assignment, index) => (
                      <Draggable
                        draggableId={String(assignment.id)}
                        key={assignment.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="reorder-dialog__assignment-display"
                          >
                            <MemberDisplay member={assignment.assignee} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
            <Grid item xs={6}>
              <h3>Preview next task</h3>
              {getTaskPreviews(task, assignments.length).map((taskPreview) => (
                <div className="reorder-dialog__preview-task">
                  {taskPreview}
                </div>
              ))}
            </Grid>
          </Grid>
          <p className="reorder-dialog__note">
            Note: Drag and drop member cards to create new assignment order
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Re-order</Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );
}

export default ReorderDialog;
