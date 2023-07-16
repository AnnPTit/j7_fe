import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, Grid, TextField, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

export const OrderSearch = () => {
  const [dataForm, setDataForm] = React.useState({
    dateFrom: new Date(),
    dateTo: new Date(),
  });

  return (
    <Card sx={{ p: 2 }}>
      <Grid container my={2.5}>
        <OutlinedInput 
          fullWidth
          defaultValue=""
          placeholder="Search order"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
          
        />
        
        <Grid item xs={12} ml={2} mr={2} sm={12} xl={2} lg={3}>
          <DatePicker
            disablePast
            label="Date From"
            onChange={(newValue) => {
              setDataForm({ ...dataForm, dateFrom: newValue });
            }}
            renderInput={(params) => <TextField {...params}/>}
          />
        </Grid>
        <Grid item xs={12} sm={12} xl={2} lg={3}>
          <DatePicker
            disablePast
            label="Date To"
            minDate={dataForm.dateFrom}
            onChange={(newValue) => {
              setDataForm({ ...dataForm, dateTo: newValue });
            }}
            renderInput={(params) => <TextField {...params}/>}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
