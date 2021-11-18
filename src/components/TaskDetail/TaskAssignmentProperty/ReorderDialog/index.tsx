import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";

import MemberDisplay from "../../MemberDisplay";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import "./style.css";

function reorder(
  previousOrder: Assignment[],
  startIndex: number,
  endIndex: number,
): Assignment[] {
  const newOrder = Array.from(previousOrder);
  const [removed] = newOrder.splice(startIndex, 1);
  newOrder.splice(endIndex, 0, removed);

  return newOrder;
}

function ReorderDialog({
  open,
  setOpen,
  assignments,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
  assignments: Assignment[];
}) {
  const [currentOrder, setCurrentOrder] = useState<Assignment[]>(assignments);

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    console.log("submit");
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
              {currentOrder.map((assignment) => (
                <div className="reorder-dialog__preview-task">
                  in 23 weeks (11/11-11/11)
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
