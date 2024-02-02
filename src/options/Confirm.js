import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = ({
  open,
  handleClose,
  handleConfirm,
  title,
  body,
  cancelButtonText,
  ConfirmButtonText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title ? title : "Confirm Action"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body ? body : "Are you sure you want to perform this action?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {cancelButtonText ? cancelButtonText : "Cancel"}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          {ConfirmButtonText ? ConfirmButtonText : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
