import React, { useEffect, useState } from "react";
import { QUERY, SETDOC } from "../background/background";
import { CreateToast } from "./App";
import CustomInput from "../Input/CustomInput";
export default function Main(props) {
  const [LoggedInUser, setLoggedInUser] = React.useState({
    UserName: "",
    Password: "",
  });
  const [previousUsers, setPreviousUsers] = useState([]);
  const handleInput = (event) => {
    const { name, value } = event.target;
    setLoggedInUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const getSyncStorageData = (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  const handleLogin = async (User = null, e) => {
    CreateToast("logging in", "info");
    if (e) {
      e.preventDefault();
    }
    console.log(User);
    if (User) {
      LoggedInUser.UserName = User.UserName;
      LoggedInUser.Password = User.Password;
    }
    if (!LoggedInUser.UserName) {
      return;
    } else {
      const LookForUser = await QUERY(
        "Users",
        "UserName",
        "==",
        LoggedInUser.UserName
      );
      const MatchUsername = LookForUser[0];

      if (MatchUsername) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        if (MatchUsername.Password === LoggedInUser.Password) {
          localStorage.setItem("ActiveUser", JSON.stringify(MatchUsername));
          chrome.storage.local.set({ Notes: MatchUsername.Notes });
          const storedValue = await chrome.storage.local.get(["BreakTimer"]);

          localStorage.setItem("LoginTime", JSON.stringify(formattedDate));

          localStorage.setItem("InsertText", JSON.stringify(true));
          if (storedValue?.BreakTimer) {
            localStorage.setItem("BreakTimer", true);
          } else {
            localStorage.setItem("BreakTimer", false);
          }
          localStorage.setItem("AdvancedMode", true);
          localStorage.setItem("TextSearch", true);

          chrome.storage.local.set({ AdvancedMode: true });

          const previousUsers = await getSyncStorageData("LoggedInUsers");
          if (previousUsers?.length > 0) {
            await chrome.storage.sync.set({
              LoggedInUsers: [LoggedInUser, ...previousUsers],
            }); // Syncing LoginTime to chrome.storage.sync
          } else {
            await chrome.storage.sync.set({
              LoggedInUsers: [LoggedInUser],
            }); // Syncing LoginTime to chrome.storage.sync
          }
          props.setActivePage("APP");
          await SETDOC("Users", MatchUsername.ID, {
            ...MatchUsername,
            LastUpdate: formattedDate,
          });
          // await SETDOC("backUp", MatchUsername.ID, {
          //   ...MatchUsername,
          //   LastUpdate: formattedDate,
          // });
        } else {
          CreateToast("كلمة مرور خاطئة", "error");
        }
      } else {
        CreateToast("لا يوجد مستخدم", "error");
      }
    }
  };
  useEffect(() => {
    const removeDuplicates = (arr) => {
      const seen = new Set();
      return arr.filter((item) => {
        const key = `${item.UserName}-${item.Password}`;
        if (!seen.has(key)) {
          seen.add(key);
          return true;
        }
        return false;
      });
    };
    const checkPreviousUsers = () => {
      chrome.storage.sync.get(["LoggedInUsers"], (result) => {
        if (result.LoggedInUsers.length > 0) {
          setPreviousUsers(removeDuplicates(result.LoggedInUsers));
        } else {
          setPreviousUsers([]);
        }
      });
    };
    checkPreviousUsers();
  }, []);
  const renderPreviousUsers = previousUsers?.map((User) => {
    return (
      <div className="PreviousUser">
        <h2
          onClick={() => {
            setLoggedInUser(User);
            handleLogin(User);
          }}
        >
          {User.UserName}
        </h2>
        <button
          onClick={() => {
            deleteUser(User.UserName);
          }}
        >
          delete
        </button>
      </div>
    );
  });
  const deleteUser = async (userName) => {
    // Retrieve the stored users from chrome.storage.sync

    // Save the updated users list to chrome.storage.sync
    const saveUsers = (users) => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ LoggedInUsers: users }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    };

    try {
      const updatedUsers = previousUsers.filter(
        (user) => user.UserName !== userName
      );

      await saveUsers(updatedUsers);
      setPreviousUsers(updatedUsers);
      console.log(`User '${userName}' has been deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <form
      className="Form"
      onSubmit={(e) => {
        handleLogin(null, e);
      }}
    >
      <h1 style={{ textAlign: "center" }}>Welcome Back</h1>

      <CustomInput
        label="username"
        type="text"
        name="UserName"
        value={LoggedInUser.UserName}
        onChangeFunction={handleInput}
      />

      <CustomInput
        label="Password:"
        type="password"
        name="Password"
        value={LoggedInUser.Password}
        onChangeFunction={handleInput}
      />

      <div className="button-wrapper">
        <button className="bn632-hover bn24">Login</button>
        <p
          onClick={() => {
            props.setActivePage("SIGNUP");
          }}
        >
          dont have an account?
          <span className="gradient-text"> Sign Up</span>
        </p>
      </div>

      <div className="QuickLogin">
        <h1>Quick Login</h1>

        <p style={{ textAlign: "center", fontSize: "1rem" }} className="info">
          Quick login saves your details for faster access, removing the need to
          re-enter them each time, until you choose to delete them.
        </p>

        {renderPreviousUsers}
      </div>
    </form>
  );
}
