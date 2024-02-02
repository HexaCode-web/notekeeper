import React from "react";

import Note from "./Note";

const NotesList = ({ notes, setUser }) => {
  const moveNote = (dragIndex, hoverIndex) => {
    const newNotes = [...notes];
    const [removed] = newNotes.splice(dragIndex, 1);
    newNotes.splice(hoverIndex, 0, removed);
    newNotes.forEach((note, index) => {
      note.order = index;
    });

    setUser((prev) => {
      return { ...prev, Notes: newNotes };
    });
  };

  return (
    <div className="NotesWrapper">
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          index={note.order}
          moveNote={moveNote}
          NOTES={notes}
        />
      ))}
    </div>
  );
};

export default NotesList;
