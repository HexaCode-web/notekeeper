import React, { useState } from "react";
import CustomInput from "../../Input/CustomInput";
import { CreateToast } from "../../popups/App";
import { QUERY, SETDOC } from "../../background/background";
const Profile = ({ User, setUser }) => {
  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // const createBackUp = async () => {
  //   try {
  //     CreateToast("creating backup", "info");
  //     const checkInBackUp = await QUERY("backUp", "ID", "==", User.ID);
  //     if (checkInBackUp.length === 0) {
  //       await SETDOC("backUp", User.ID, User, true);
  //     } else {
  //       await SETDOC("backUp", User.ID, User, false);
  //     }
  //     CreateToast("backup done", "success");
  //   } catch (error) {
  //     console.error("Error creating backup:", error);
  //     CreateToast("backup failed", "error");
  //   }
  // };
  return (
    <div className="General">
      <p>User ID:{User.ID}</p>
      <CustomInput
        customWidth="50%"
        value={User.UserName}
        label="Username"
        onChangeFunction={handleUserChange}
        name="UserName"
      />
      <CustomInput
        customWidth="50%"
        value={User.Password}
        label="Password"
        type="password"
        onChangeFunction={handleUserChange}
        name="Password"
      />
    </div>
  );
};

export default Profile;
