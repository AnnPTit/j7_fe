import { MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";

function AccountFilter({
  position,
  positionChose,
  setPositionChose,
}) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {position.length > 0 ? (
        <Select
          style={{
            width: 500,
            marginLeft: 20,
          }}
          value={positionChose}
          onChange={(e) => setPositionChose(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {position.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.positionName === "ROLE_ADMIN" ? "Quản lý" : "Nhân Viên"}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AccountFilter;
