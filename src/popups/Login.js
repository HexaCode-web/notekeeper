import React from "react";
import { GETCOLLECTION, SETDOC } from "../background/index";
import { CreateToast } from "./App";
import CustomInput from "../Input/CustomInput";

export default function Main(props) {
  const [LoggedInUser, setLoggedInUser] = React.useState({
    UserName: "",
    Password: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setLoggedInUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!LoggedInUser.UserName) {
      return;
    } else {
      const oldUsers = await GETCOLLECTION("Users");
      const MatchUsername = oldUsers.find((user) => {
        return user.UserName === LoggedInUser.UserName;
      });
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

  return (
    <form className="Form" onSubmit={handleLogin}>
      <h1 style={{ textAlign: "center" }}>Login</h1>

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
        <button
          class="bn632-hover bn28"
          onClick={() => {
            props.setActivePage("welcome");
          }}
        >
          Return
        </button>
      </div>
    </form>
  );
}
