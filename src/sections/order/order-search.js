import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Button,
  Grid,
  TextField,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import React from "react";
import { useState } from "react";

export const OrderSearch = () => {
  const [dataForm, setDataForm] = React.useState({
    dateFrom: new Date(),
    dateTo: new Date(),
  });

  const [valueTo, setValueTo] = useState(null);
  const [valueFrom, setValueFrom] = useState(null);

  const handleFromDateChange = (newValue) => {
    setValueFrom(newValue);
    if (newValue > valueTo) {
      setValueTo(newValue); // Update valueTo if the selected date is greater than the current valueTo
    }
  };

  const handleToDateChange = (newValue) => {
    setValueTo(newValue);
    if (newValue < valueFrom) {
      setValueFrom(newValue); // Update valueFrom if the selected date is smaller than the current valueFrom
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Return an empty string for null date values
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container my={2.5}>
        <OutlinedInput
          fullWidth
          defaultValue=""
          placeholder="Tìm kiếm"
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
            label="Từ ngày"
            value={valueFrom}
            onChange={handleFromDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: formatDate(valueFrom), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} xl={2} lg={3}>
          <DatePicker
            disablePast
            label="Đến ngày"
            minDate={dataForm.dateFrom}
            value={valueTo}
            onChange={handleToDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  value: formatDate(valueTo), // Format the value here
                  readOnly: true, // Prevent manual input
                }}
              />
            )}
          />
        </Grid>
        <Grid>
          <Button
            className="btn btn-primary"
            style={{
              height: 55,
              width: 170,
              marginLeft: 160,
              backgroundColor: "dimgray",
              color: "white",
            }}
          >
            <SvgIcon style={{ marginRight: 10 }} fontSize="small">
              <PlusIcon />
            </SvgIcon>
            Tạo Hóa Đơn
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
