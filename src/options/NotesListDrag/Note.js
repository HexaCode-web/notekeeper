import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const Note = ({ note, index, moveNote, NOTES }) => {
  const ref = useRef(null);
  //drag index the note being moved
  //hover index the note being hovered over
  const [, drop] = useDrop({
    accept: "NOTE",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Get the note being dragged and the hovered note
      const draggedNote = NOTES[dragIndex];
      if (draggedNote) {
        draggedNote.order = hoverIndex;
      }
      const hoveredNote = NOTES[hoverIndex];
      // Check if both the dragged and hovered notes are pinned
      const areBothPinned =
        draggedNote && hoveredNote && draggedNote.pinned && hoveredNote.pinned;

      // If not both pinned, don't perform the move

      // Check if the dragged note is pinned
      if (
        (draggedNote && draggedNote.pinned && !areBothPinned) ||
        (hoveredNote && hoveredNote.pinned && !areBothPinned)
      ) {
        return; // If pinned, don't perform the move
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveNote(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { id: note.id, index },
    options: {
      autoScroll: true, // Enable auto-scrolling
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div id={note.id} ref={ref} className="Note Drag" key={note.id}>
      <>
        {note.pinned ? (
          <img
            className="Pin  animate__animated  animate__fadeIn"
            src="../../icons/pinFilled.png"
            style={{ cursor: "normal" }}
          ></img>
        ) : (
          <img
            className="Pin  animate__animated  animate__fadeIn"
            src="../../icons/pin.png"
            style={{ cursor: "normal" }}
          ></img>
        )}
      </>
      <p>{note.title}</p>
      <div className="text-wrapper" title={note.text}>
        {note.text}
      </div>
    </div>
  );
};
export default Note;
