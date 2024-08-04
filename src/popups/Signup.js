import React from "react";
import { QUERY, SETDOC } from "../background/background";
import { CreateToast } from "./App";
import CustomInput from "../Input/CustomInput";
import { v4 as uuidv4 } from "uuid";

export default function Main(props) {
  const [NewUser, setNewUser] = React.useState({
    UserName: "",
    Password: "",
    Notes: [],
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSignup = async (e) => {
    if (NewUser.UserName === "" || NewUser.Password === "") {
      CreateToast("اسم المستخدم و كلمة المرور مطلوبين", "error", 2000);
      return;
    }
    e.preventDefault();
    let Matches = await QUERY("Users", "UserName", "==", NewUser.UserName);
    if (Matches.length > 0) {
      CreateToast("يوجد مستخدم بنفس الاسم", "error", 2000);
      return;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const localID = uuidv4();
    localStorage.setItem(
      "ActiveUser",
      JSON.stringify({ ...NewUser, ID: localID })
    );
    chrome.storage.local.set({ Notes: NewUser.Notes });

    localStorage.setItem("InsertText", JSON.stringify(true));
    localStorage.setItem("AdvancedMode", false);
    chrome.storage.local.set({ AdvancedMode: false });
    await SETDOC(
      "Users",
      localID,
      { ...NewUser, ID: localID, LastUpdate: formattedDate },
      true
    );
    props.setActivePage("APP");

    CreateToast("تم اضافة الحساب", "success", 2000);
  };
  return (
    <form className="Form" onSubmit={handleSignup}>
      <h1 style={{ textAlign: "center" }}>Sign up</h1>
      <CustomInput
        label="username"
        type="text"
        name="UserName"
        value={NewUser.UserName}
        onChangeFunction={handleInput}
      />

      <CustomInput
        label="Password:"
        type="password"
        name="Password"
        value={NewUser.Password}
        onChangeFunction={handleInput}
      />
      <div className="button-wrapper">
        <button className="bn632-hover bn24" onClick={handleSignup}>
          Sign up
        </button>
        <p
          onClick={() => {
            props.setActivePage("welcome");
          }}
        >
          already have an account?
          <span className="gradient-text"> Login now</span>
        </p>
      </div>
    </form>
  );
}
