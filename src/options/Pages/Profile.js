import React, { useState } from "react";
import CustomInput from "../../Input/CustomInput";
import { CreateToast } from "../../popups/App";
import { QUERY, SETDOC } from "../../background";
import ConfirmDialog from "../Confirm";
const Profile = ({ User, setUser, SaveUser, oldData }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpen = () => {
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setConfirmOpen(false);
  };
  const handleConfirm = async () => {
    const updatedUser = { ...User, Notes: oldData.Notes };
    setConfirmOpen(false);
    await SaveUser(updatedUser);
    CreateToast("data restored", "success");
  };
  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const createBackUp = async () => {
    try {
      CreateToast("creating backup", "info");
      const checkInBackUp = await QUERY("backUp", "ID", "==", User.ID);
      if (checkInBackUp.length === 0) {
        await SETDOC("backUp", User.ID, User, true);
      } else {
        await SETDOC("backUp", User.ID, User, false);
      }
      CreateToast("backup done", "success");
    } catch (error) {
      console.error("Error creating backup:", error);
      CreateToast("backup failed", "error");
    }
  };
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginBottom: "20px",
        }}
      >
        <button className="button" onClick={createBackUp}>
          create backup
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>Last Backup Date:</p>
          <p>{oldData?.LastUpdate}</p>
        </div>
        <button
          className="button"
          onClick={() => {
            handleOpen();
          }}
        >
          Restore Notes
        </button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        title="Restore Old notes"
        body="are you sure you want to preform this action? this action is irreversible"
      />
    </div>
  );
};

export default Profile;
