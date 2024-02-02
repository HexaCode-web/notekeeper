import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { CreateToast } from "../../popups/App";

const Note = ({ note, setUser, User, setNotesClone }) => {
  const NOTES = User.Notes;
  const [deleting, setDeleting] = useState(false);
  const [noteActive, setNoteActive] = useState(false);
  const ref = useRef(null);

  const handleChange = (event) => {
    setNoteActive(false);
    const { name, value } = event.target;
    if (name === "title" && value === "/") {
      CreateToast("not allowed to use `/`", "error", 2000);
      return;
    }
    const targetNote = NOTES.find((oldNote) => {
      return oldNote.id === note.id;
    });
    const Notes = NOTES;
    targetNote[name] = value;
    setUser((prev) => {
      return { ...prev, Notes };
    });
  };
  const calculateLineHeight = () => {
    const lines = note.text.split("\n").length;
    return lines;
  };
  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Create a URL object
    const url = new URL(currentUrl);

    // Get the id from the URL
    const id = url.hash.replace("#", "");

    // Use the id as needed (for example, log it to the console)
    if (id === note.id) {
      setNoteActive(true);
    }
  }, []);
  const deleteActiveNote = () => {
    setDeleting(true);
    //find the needed user
    const newList = User.Notes.filter((oldNote) => {
      return oldNote.id !== note.id;
    });
    setUser((prev) => {
      return { ...prev, Notes: newList };
    });
    setNotesClone(newList);
    CreateToast("تم حذف الملاحظة", "success");
    setDeleting(false);
  };
  const ChangePin = () => {
    let TempUser = User;

    let ResortNotes = TempUser.Notes.map((oldNote) => {
      if (oldNote.id === note.id) {
        console.log("changed", oldNote.id);
        return {
          ...oldNote,
          pinned: !note.pinned,
        };
      }
      return oldNote;
    });
    let sortedNotes = [...ResortNotes].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return 0;
      } else if (a.pinned) {
        return -1;
      } else {
        return 1;
      }
    });
    setNotesClone(sortedNotes);

    let UserToSend = {
      ...TempUser,
      Notes: sortedNotes,
    };

    setUser(UserToSend);
  };

  return (
    <div
      id={note.id}
      ref={ref}
      className={`Note ${noteActive ? "Hover" : ""}`}
      key={note.id}
    >
      <input
        className="title"
        name="title"
        onChange={handleChange}
        placeholder="Note's title"
        value={note.title}
      ></input>
      <textarea
        value={note.text}
        name="text"
        rows={calculateLineHeight()}
        onChange={handleChange}
      ></textarea>

      <div className="button-wrapper  animate__animated  animate__fadeIn">
        <img
          title="مسح"
          disabled={deleting ? true : false}
          src="../../icons/delete.png"
          className="Icon"
          onClick={() => {
            deleteActiveNote(note);
          }}
        />
        {note.pinned ? (
          <img
            title="الغاء التثبيت"
            className="Pin  animate__animated  animate__fadeIn"
            onClick={() => {
              ChangePin(note);
            }}
            src="../../icons/pinFilled.png"
          ></img>
        ) : (
          <img
            title="تثبيت"
            className="Pin  animate__animated  animate__fadeIn"
            onClick={() => {
              ChangePin(note);
            }}
            src="../../icons/pin.png"
          ></img>
        )}
      </div>
    </div>
  );
};
export default Note;
