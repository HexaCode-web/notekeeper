import React, { useEffect } from "react";
import { GETDOC } from "../background/index";
export default function Main() {
  const settings = {
    SearchInText: JSON.parse(localStorage.getItem("TextSearch")),
    DCCopy: JSON.parse(localStorage.getItem("DoubleClick")),
    InsertText: JSON.parse(localStorage.getItem("InsertText")),
    AdvancedMode: JSON.parse(localStorage.getItem("AdvancedMode")),
    BreakTimer: JSON.parse(localStorage.getItem("BreakTimer")),
  };
  const [searching, setSearching] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [hoveredNoteId, setHoveredNoteId] = React.useState(null);
  const [NOTES, setNotes] = React.useState(
    JSON.parse(localStorage.getItem("ActiveUser")).Notes || []
  );
  const User = JSON.parse(localStorage.getItem("ActiveUser")) || {};

  const handleNoteHover = (note) => {
    setHoveredNoteId(note.id);
  };
  const handleNoteHoverEnd = () => {
    setHoveredNoteId(null);
  };

  useEffect(() => {
    const LastLogin = async () => {
      const FetchedUser = await GETDOC("Users", User.ID);
      const lastLogin = JSON.parse(localStorage.getItem("LoginTime"));
      const FetchedNotes = FetchedUser.Notes;
      const targetTime = new Date(lastLogin);
      const currentTime = new Date();

      const timeDifference = currentTime - targetTime; // Difference in milliseconds
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours

      return {
        Hours: hoursDifference >= 12,
        FetchedNotes: FetchedNotes,
        FetchedUser,
      };
    };

    LastLogin().then((res) => {
      if (res.Hours) {
        alert("your session has expired please login one more time");

        logout();
      }
    });
  }, []);
  const logout = () => {
    localStorage.removeItem("ActiveUser");
    localStorage.removeItem("NewNote");
    chrome.storage.local.set({ AdvancedMode: false });
    window.location.reload();
  };
  const Search = (event) => {
    setSearching(false);
    let SearchValue = event.target.value;
    setSearchValue(event.target.value);
    if (SearchValue === " ") {
      setNotes(User.Notes);
    }
    const Notes = User.Notes;
    const filteredNotes = settings.SearchInText
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
      setNotes(filteredNotes);
    } else {
      setSearching(true);
    }
  };

  React.useEffect(() => {
    function handleKeyPress(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        const textToInject = NOTES[0].text;
        navigator.clipboard.writeText(textToInject);
        if (!settings.InsertText) {
          chrome.tabs.query(
            {
              active: true,
              currentWindow: true,
            },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id);
            }
          );
          window.close();
          return;
        } else {
          chrome.tabs.query(
            {
              active: true,
              currentWindow: true,
            },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                textToInject,
              });
            }
          );
          window.close();
        }
      }
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchValue]);

  const copyText = (text, source) => {
    if (source === "icon") {
      navigator.clipboard.writeText(text);

      window.close();
    } else {
      if (settings.DCCopy) {
        const textToInject = text;
        navigator.clipboard.writeText(textToInject);
        if (!settings.InsertText) {
          chrome.tabs.query(
            {
              active: true,
              currentWindow: true,
            },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id);
            }
          );
          window.close();
          return;
        } else {
          chrome.tabs.query(
            {
              active: true,
              currentWindow: true,
            },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                textToInject,
              });
            }
          );
          window.close();
        }
      }
    }
  };
  return (
    <div className="container">
      <div className="Info">
        <p>{User.UserName}</p>
        <input
          onChange={() => {
            Search(event);
          }}
          type="text"
          id="Search"
          placeholder="search"
          autoFocus
        />
        <div className="dropdown-container CheckContainer">
          <img
            src={"../../icons/settings.png"}
            className="Icon"
            onClick={() => {
              chrome.tabs.create({ url: "options.html" });
            }}
          />
        </div>
        <img
          src={"../../icons/logout.png"}
          className="Icon"
          onClick={logout}
        ></img>
      </div>

      {searching && <span className="error">no note found </span>}

      <div className="Note-wrapper popup">
        {NOTES.length > 0
          ? NOTES.map((note) => {
              const isNoteHovered = hoveredNoteId === note.id ? true : false;
              return (
                <div
                  onDoubleClick={() => {
                    copyText(note.text, "");
                  }}
                  className="Note Popup"
                  key={note.id}
                  onMouseEnter={() => handleNoteHover(note)}
                  onMouseLeave={handleNoteHoverEnd}
                >
                  {isNoteHovered && <></>}
                  <h3> {note.title}</h3>
                  <p> {note.text}</p>

                  {isNoteHovered && (
                    <div className="button-wrapper  animate__animated  animate__fadeIn">
                      <img
                        src="../../icons/copy.png"
                        title="نسخ"
                        onClick={() => {
                          copyText(note.text, "icon");
                        }}
                        className="Icon  animate__animated  animate__fadeIn"
                      ></img>
                      <img
                        title="تعديل"
                        src="../../icons/Save.png"
                        className="Icon"
                        onClick={() => {
                          chrome.tabs.create({
                            url: `options.html#${note.id}`,
                          });
                        }}
                      />
                      {note.pinned && (
                        <img
                          className="Icon  animate__animated  animate__fadeIn"
                          src="../../icons/pinFilled.png"
                        ></img>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
