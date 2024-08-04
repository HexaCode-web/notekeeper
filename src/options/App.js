import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "./options.css";
import "react-toastify/dist/ReactToastify.css";
import { CreateToast } from "../popups/App";
import { SETDOC } from "../background/background";
import Notes from "./Pages/Notes";
import General from "./Pages/General";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import Updates from "./Pages/Updates";

const Options = () => {
  const [firstRender, setFirstRender] = useState(true);
  const [notesChanged, setNotesChanged] = useState(false);
  const [activePage, setActivePage] = useState(
    localStorage.getItem("DefaultPage") || "Updates"
  );
  const [User, setUser] = React.useState(
    JSON.parse(localStorage.getItem("ActiveUser")) || null
  );
  const [notesClone, setNotesClone] = React.useState([]);
  const updateUser = async (targetUser) => {
    const User = targetUser;
    chrome.storage.local.set({ Notes: User.Notes });
    localStorage.setItem("ActiveUser", JSON.stringify(User));
    await SETDOC("Users", User.ID, {
      ...User,
    });
    setUser(User);
  };

  const SaveUser = async (TargetUser) => {
    CreateToast("updating", "info");
    setNotesChanged(false);
    await updateUser(TargetUser);
    CreateToast("Notes updated", "success");
  };

  useEffect(() => {
    if (firstRender) {
      // Update the flag to indicate that the first render has occurred
      setFirstRender(false);
      return; // Skip the side effect on the first render
    }
    setNotesChanged(true);
  }, [User]);
  useEffect(() => {
    const checkActiveUser = () => {
      const CurrentActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));

      if (CurrentActiveUser) {
        if (CurrentActiveUser.ID !== User.ID) {
          setUser(CurrentActiveUser);
        }
      } else {
        setUser(null);
      }
    };

    // Set up the interval when the component mounts
    const intervalId = setInterval(checkActiveUser, 1000); // Check every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const logout = () => {
    localStorage.removeItem("ActiveUser");
    localStorage.removeItem("NewNote");
    chrome.storage.local.set({ AdvancedMode: false });
    window.location.reload();
  };
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Are you sure you want to leave? Your changes may not be saved.";
      event.returnValue = message; // Standard for most browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <div className="Info">
        NoteKeeper • {User?.UserName} • {activePage}
      </div>
      <div className="sideBar">
        <img
          style={{ marginBottom: "20px" }}
          title="Logout"
          src={"../../icons/logout.png"}
          className="Icon"
          onClick={logout}
        ></img>
        <img
          style={{ marginBottom: "20px" }}
          title="Settings"
          src={"../../icons/settings.png"}
          onClick={() => {
            setActivePage("Settings");
          }}
          className="Icon"
        ></img>
        <img
          style={{ marginBottom: "20px" }}
          src={"../../icons/Notes.png"}
          title="Notes"
          onClick={() => {
            setActivePage("Notes");
          }}
          className="Icon"
        ></img>
        <img
          style={{ marginBottom: "20px" }}
          title="User"
          src={"../../icons/user.png"}
          onClick={() => {
            setActivePage("Profile");
          }}
          className="Icon"
        ></img>
        {User?.ID === 6 && (
          <img
            style={{ marginBottom: "20px" }}
            title="Dashboard"
            src={"../../icons/monitor.png"}
            onClick={() => {
              setActivePage("Dashboard");
            }}
            className="Icon"
          ></img>
        )}

        <img
          style={{ marginBottom: "20px" }}
          title="updates"
          src={"../../icons/updates.png"}
          onClick={() => {
            setActivePage("Updates");
          }}
          className="Icon"
        ></img>

        {/* <img
          style={{ marginBottom: "20px" }}
          title="Categories"
          src={"../../icons/categories.png"}
          onClick={() => {
            setActivePage("Categories");
          }}
          className="Icon"
        ></img> */}
      </div>
      {!User ? (
        <div style={{ marginTop: "60px" }}>
          <h1>
            no user found, open noteKeeper and login then refresh the page
          </h1>
        </div>
      ) : (
        <div className="container">
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {activePage === "Notes" && (
            <>
              <Notes
                notesClone={notesClone}
                User={User}
                setUser={setUser}
                setNotesClone={setNotesClone}
                SaveUser={SaveUser}
              />
              <div className={`Save-Wrapper ${notesChanged ? "Active" : ""}`}>
                <button
                  className="button"
                  onClick={() => {
                    SaveUser(User);
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
          {activePage === "Settings" && <General />}
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Updates" && <Updates />}
          {activePage === "Profile" && (
            <>
              <Profile User={User} setUser={setUser} SaveUser={SaveUser} />
              <div className={`Save-Wrapper ${notesChanged ? "Active" : ""}`}>
                <button
                  className="button"
                  onClick={() => {
                    SaveUser(User);
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: "1.05rem" }}>
        Version: 2.9 • Created by Marco
      </p>
    </>
  );
};

export default Options;
