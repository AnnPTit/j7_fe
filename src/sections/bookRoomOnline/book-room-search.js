import { Card, Grid, OutlinedInput } from "@mui/material";
import React from "react";

export const BookRoomSearch = ({ textSearch, setTextSearch }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container my={2.5}>
        <OutlinedInput
          fullWidth
          value={textSearch}
          placeholder="Tìm kiếm theo hóa đơn và thông tin khách hàng"
          sx={{ maxWidth: 500 }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
      </Grid>
    </Card>
  );
};
