import { useState } from "react";

import _ from "lodash";
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

import MemberDisplay from "components/TaskDetail/MemberDisplay";

import taskService from "services/task";
import useAuth from "contexts/auth";
import useApartment from "contexts/apartment";

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
  const { authState } = useAuth() as { authState: UserWithToken };
  const { apartment, setApartment } = useApartment() as {
    apartment: Apartment;
    setApartment: (x: Apartment | "") => void;
  };

  const { task, assignments } = taskAssignment;
  const currentOrder = _.sortBy(assignments, (assignment) => assignment.order);
  const [proposedOrder, setProposedOrder] =
    useState<Assignment[]>(currentOrder);

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit() {
    const currentOrderUsernames = currentOrder.map(
      (assignment) => assignment.assignee.username,
    );
    const proposedOrderUsernames = proposedOrder.map(
      (assignment) => assignment.assignee.username,
    );

    if (_.isEqual(currentOrderUsernames, proposedOrderUsernames)) {
      setOpen(false);
      return;
    }

    try {
      const taskAssignment = await taskService.updateOrder(
        authState.token,
        task.id,
        proposedOrderUsernames,
      );

      const updatedTaskAssignments = apartment.task_assignments.map((element) =>
        element.task.id === taskAssignment.task.id ? taskAssignment : element,
      );
      setApartment({
        ...apartment,
        task_assignments: updatedTaskAssignments,
      });
    } catch (err) {
      console.log(err);
      const errMessage =
        (err as any).response?.data.error || "Fail to reorder an apartment";
      toast.error(errMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
      setProposedOrder(currentOrder);
    } finally {
      setOpen(false);
    }
  }

  function onEnd(result: DropResult) {
    if (!result.destination) return;

    const newOrder = reorder(
      proposedOrder,
      result.source.index,
      result.destination.index,
    );

    setProposedOrder(newOrder);
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
                    {proposedOrder.map((assignment, index) => (
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
              {getTaskPreviews(task, assignments.length).map(
                (taskPreview, index) => (
                  <div key={index} className="reorder-dialog__preview-task">
                    {taskPreview}
                  </div>
                ),
              )}
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
