import React from "react";

import Note from "./Note";

const NotesList = ({ User, setUser, notesClone, setNotesClone }) => {
  const notes = User.Notes;
  return (
    <div className="NotesWrapper">
      {notesClone.length > 0
        ? notesClone.map((note) => (
            <Note
              key={note.id}
              note={note}
              setUser={setUser}
              User={User}
              setNotesClone={setNotesClone}
            />
          ))
        : notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              setUser={setUser}
              User={User}
              setNotesClone={setNotesClone}
            />
          ))}
    </div>
  );
};

export default NotesList;
