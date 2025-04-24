import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const BookmarkMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', verticalAlign: 'center' }}>
      <IconButton
        style={{ marginRight: "3px" }} variant="contained" color="primary" 
        onClick={handleClick}
        sx={{ cursor: "pointer" }} // Aggiunta del cursore a forma di mano
      >
        <BookmarkIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem selected={props.selectedItem === 0} onClick={() => {props.goToContent(null, 0); handleClose();}}>{props.labels[0]}</MenuItem>
        <MenuItem selected={props.selectedItem === 1} onClick={() => {props.goToContent(null, 1); handleClose();}}>{props.labels[1]}</MenuItem>
        <MenuItem selected={props.selectedItem === 2} onClick={() => {props.goToContent(null, 2); handleClose();}}>{props.labels[2]}</MenuItem>
        <MenuItem selected={props.selectedItem === 3} onClick={() => {props.goToContent(null, 3); handleClose();}}>{props.labels[3]}</MenuItem>
        <MenuItem selected={props.selectedItem === 4} onClick={() => {props.goToContent(null, 4); handleClose();}}>{props.labels[4]}</MenuItem>
      </Menu>
    </div>
  );
};

export default BookmarkMenu;
