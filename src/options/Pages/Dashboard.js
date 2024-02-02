import React, { useEffect, useState } from "react";
import {
  DELETEDOC,
  GETCOLLECTION,
  GETDOC,
  QUERY,
  SETDOC,
} from "../../background";
import DataTable from "react-data-table-component";
import ConfirmDialog from "../Confirm";
import { CreateToast } from "../../popups/App";
import CustomInput from "../../Input/CustomInput";

const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [operation, setOperation] = useState(null);
  const [SecretKey, setSecretKey] = useState(null);
  const [secretKeyPassed, setSecretKeyPassed] = useState(false);
  const handleOpen = () => {
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setTargetUser(null);
    setOperation(null);
    setConfirmOpen(false);
  };
  const handleConfirm = async () => {
    handleClose();

    switch (operation) {
      case "delete":
        await deleteUser();
        break;
      case "restore":
        await restoreUser();
        break;
      case "backup":
        backupUser();
        break;
      case "reset":
        resetUser();
        break;

      default:
        break;
    }
    setUsers(await GETCOLLECTION("Users"));
  };
  const deleteUser = async () => {
    CreateToast(`deleting ${targetUser.UserName}`, "info");
    await DELETEDOC("Users", targetUser.ID);
    CreateToast(`deleted ${targetUser.UserName}`, "success");
  };
  const restoreUser = async () => {
    CreateToast(`restoring notes for  ${targetUser.UserName}`, "info");
    const oldUser = await QUERY("backUp", "ID", "==", targetUser.ID);
    await SETDOC(
      "Users",
      targetUser.ID,
      { ...targetUser, Notes: oldUser[0].Notes },
      false
    );
    CreateToast(`restored notes for ${targetUser.UserName}`, "success");
  };
  const backupUser = async () => {
    CreateToast(`backing up notes for  ${targetUser.UserName}`, "info");
    const oldUser = await QUERY("backUp", "ID", "==", targetUser.ID);
    if (oldUser.length > 0) {
      await SETDOC("backUp", targetUser.ID, targetUser, false);
    } else {
      await SETDOC("backUp", targetUser.ID, targetUser, true);
    }
    CreateToast(`backing up  notes for ${targetUser.UserName}`, "success");
  };
  const resetUser = async () => {
    CreateToast(`resting password for   ${targetUser.UserName}`, "info");

    await SETDOC(
      "Users",
      targetUser.ID,
      { ...targetUser, Password: "123456" },
      false
    );

    CreateToast("password has been reset", "success");
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: "Notes",
      selector: (row) => row.Notes,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Last Updated",
      selector: (row) => row.LU,
      sortable: true,
      sortType: (a, b) => {
        return new Date(b.LU) - new Date(a.LU);
      },
      center: true,
    },
    {
      name: "Options",
      selector: (row) => row.Options,
    },
  ];

  const data = users?.map((user) => {
    return {
      Name: user.UserName,
      ID: user.ID,
      Notes: user.Notes.length,
      LU: user.LastUpdate?.split(" ")[0],
      Options: (
        <div className="button-wrapper">
          <button
            className="button danger"
            onClick={() => {
              setConfirmTitle(`backup ${user.UserName}`);
              setTargetUser(user);
              setOperation("backup");
              handleOpen();
            }}
          >
            backup
          </button>
          <button
            className="button danger"
            onClick={() => {
              setConfirmTitle(`reset password for ${user.UserName}`);
              setTargetUser(user);
              setOperation("reset");
              handleOpen();
            }}
          >
            Reset
          </button>
          <button
            className="button danger"
            onClick={() => {
              setConfirmTitle(`restore back up for ${user.UserName}`);
              setTargetUser(user);
              setOperation("restore");
              handleOpen();
            }}
          >
            Restore
          </button>
          <button
            className="button danger"
            onClick={() => {
              setConfirmTitle(`delete ${user.UserName}`);
              setTargetUser(user);
              setOperation("delete");
              handleOpen();
            }}
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  useEffect(() => {
    const fetchAllUsers = async () => {
      setUsers(await GETCOLLECTION("Users"));
    };
    fetchAllUsers();
  }, []);
  // const createDBBackUp = async () => {
  //   try {
  //     CreateToast("creating backup", "info");
  //     const currentUsers = await GETCOLLECTION("Users");

  //     const backupPromises = currentUsers.map(async (user) => {
  //       const checkInBackUp = await QUERY("backUp", "ID", "==", user.ID);
  //       if (checkInBackUp.length === 0) {
  //         await SETDOC("backUp", user.ID, user, true);
  //       } else {
  //         await SETDOC("backUp", user.ID, user, false);
  //       }
  //     });

  //     await Promise.all(backupPromises);

  //     CreateToast("backup done", "success");
  //   } catch (error) {
  //     console.error("Error creating backup:", error);
  //     // Handle the error as needed
  //     CreateToast("backup failed", "error");
  //   }
  // };
  const validateSecretKey = async () => {
    const serverSecretKey = await GETDOC("secretKey", "secretKey");
    if (serverSecretKey.secretKey == SecretKey) {
      setSecretKeyPassed(true);
    }
  };
  return (
    <div className="Dashboard">
      {!secretKeyPassed && (
        <div className="validation">
          <CustomInput
            label="Secret Key"
            type="password"
            value={SecretKey}
            name="SecretKey"
            onChangeFunction={(event) => {
              setSecretKey(event.target.value);
            }}
            customWidth="70%"
          />
          <button className="button" onClick={validateSecretKey}>
            open Dashboard
          </button>
        </div>
      )}
      {secretKeyPassed && (
        <DataTable columns={columns} data={data} pagination />
      )}
      <ConfirmDialog
        open={confirmOpen}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        title={confirmTitle}
        body="are you sure you want to perform this action? this action is not revisable"
      />
    </div>
  );
};

export default Dashboard;
