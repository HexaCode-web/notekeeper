import React, { useEffect, useState } from "react";
import CustomInput from "../../Input/CustomInput";
import NotesListDrag from "../NotesListDrag/NotesListDrag";
import NotesList from "../NotesList/NotesList";
import Switch from "react-switch";
import { CreateToast } from "../../popups/App";

const Notes = ({ notesClone, User, setUser, setNotesClone, SaveUser }) => {
  const [reorderMode, setReorderMode] = useState(false);
  const [eligibleForReorder, setEligibleForReorder] = useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [NewNote, setNewNote] = useState(
    JSON.parse(localStorage.getItem("NewNote")) || {
      pinned: false,
      title: "",
      text: "",
      category: "",
      order: "",
      id: generateId(),
    }
  );
  const handleReorderChange = () => {
    setReorderMode(!reorderMode);
  };
  const handleInput = (event) => {
    const { name, value } = event.target;
    if (name === "title" && value === "/") {
      CreateToast('"/"غير مسموح بستعمال', "error", 2000);
      return;
    }
    setNewNote((prev) => {
      return { ...prev, [name]: value, order: User.Notes.length + 1 };
    });
  };
  function generateId() {
    let id = "";
    const digits = "0123456789";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      id += digits[randomIndex];
    }
    return id;
  }

  const SaveNewNote = async () => {
    const Notes = User.Notes;
    const pinnedNotes = Notes.filter((oldNote) => oldNote.pinned);
    const unpinnedNotes = Notes.filter((oldNote) => !oldNote.pinned);
    Notes.length = 0;
    Notes.push(...pinnedNotes, NewNote, ...unpinnedNotes);

    setNotesClone(Notes);
    setUser((prev) => {
      return { ...prev, Notes };
    });
    CreateToast("تم عمل الملاحظة", "success");
    setNewNote({
      pinned: false,
      title: "",
      text: "",
      category: "",
      order: "",
      id: generateId(),
    });
  };
  React.useEffect(() => {
    localStorage.setItem("NewNote", JSON.stringify(NewNote));
  }, [NewNote]);
  const validateNotes = () => {
    for (const note of User.Notes) {
      if (typeof note.order === "undefined") {
        CreateToast(
          `Note with ID ${note.id} does not have an 'order' property, please report this issue in the settings tab`,
          "error"
        );
        setEligibleForReorder(false);

        break;
      }
      setEligibleForReorder(true);
    }
  };
  useEffect(() => {
    validateNotes();
  }, []);
  const updateNotes = async () => {
    const newNotes = User.Notes.map((note, index) => {
      if (!note.order) {
        note.order = index;
        setEligibleForReorder(true);
        return note;
      } else return note;
    });
    setUser((prev) => {
      return { ...prev, Notes: newNotes };
    });
    await SaveUser(User);
  };
  const Search = (event) => {
    let SearchValue = event.target.value;
    setSearchValue(event.target.value);
    if (SearchValue === " ") {
      setNotesClone(User.Notes);
    }
    const Notes = User.Notes;
    const filteredNotes = JSON.parse(localStorage.getItem("TextSearch"))
      .SearchInText
      ? Notes.filter((oldNote) => {
          return (
            oldNote.title.toUpperCase().startsWith(SearchValue.toUpperCase()) ||
            oldNote.text.toUpperCase().startsWith(SearchValue.toUpperCase())
          );
        })
      : Notes.filter((oldNote) => {
          return oldNote.title
            .toUpperCase()
            .startsWith(SearchValue.toUpperCase());
        });
    if (filteredNotes.length > 0) {
      setNotesClone(filteredNotes);
    }
  };
  return (
    <div className="General">
      <div className="reorderCheckBox">
        <label style={{ width: "150px" }}>
          <span>re-arrange mode</span>
          <Switch
            onChange={handleReorderChange}
            checked={reorderMode}
            height={20}
            width={40}
            onColor="#8f54a0"
          />
        </label>
      </div>
      <div className="NotesPage">
        <div className="Right">
          {reorderMode ? (
            <h2>
              Please disable rearrange mode to perform searches within your
              notes.
            </h2>
          ) : (
            <CustomInput
              customClass="Search"
              onChangeFunction={Search}
              type="text"
              name="Search"
              label="search for a note"
            />
          )}

          <div className="AddNote-Wrapper">
            <h2>Add New Note</h2>
            <CustomInput
              value={NewNote.title}
              name="title"
              id="title"
              type="text"
              label="Title"
              onChangeFunction={handleInput}
            />
            <CustomInput
              value={NewNote.text}
              name="text"
              customClass="new-note-body"
              id="text"
              textarea={true}
              label="Note"
              onChangeFunction={handleInput}
            />
            <div className="buttons">
              <button title="حفظ" className="button" onClick={SaveNewNote}>
                Save note
              </button>
            </div>
          </div>
        </div>
        {User.Notes.length > 0 ? (
          reorderMode ? (
            eligibleForReorder ? (
              <NotesListDrag
                notes={User.Notes}
                setUser={setUser}
                setNotesClone={setNotesClone}
              />
            ) : (
              <div
                className="NotesWrapper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "1.5rem" }}>
                  your notes arent updated for this option
                </p>
                <button className="button" onClick={updateNotes}>
                  update them now
                </button>
              </div>
            )
          ) : (
            <NotesList
              setUser={setUser}
              User={User}
              notesClone={notesClone}
              setNotesClone={setNotesClone}
            />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Notes;
