import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

function OrderFilter({ typeOfOrderChoose, statusChoose, setTypeOfOrderChoose, setStatusChoose }) {
  return (
    <div style={{ marginTop: -110 }}>
      <FormControl variant="standard" style={{ marginLeft: 100 }} sx={{ minWidth: 180 }}>
        <InputLabel id="demo-simple-select-standard-label">Loại đơn</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Loại đơn"
          value={typeOfOrderChoose}
          onChange={(e) => setTypeOfOrderChoose(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value={0}>Online</MenuItem>
          <MenuItem value={1}>Tại quầy</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard" style={{ marginLeft: 50 }} sx={{ minWidth: 180 }}>
        <InputLabel id="demo-simple-select-standard-label">Trạng thái</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Trạng thái"
          value={statusChoose}
          onChange={(e) => setStatusChoose(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="0">Đã hủy</MenuItem>
          <MenuItem value="1">Chờ xác nhận</MenuItem>
          <MenuItem value="2">Đã nhận phòng</MenuItem>
          <MenuItem value="3">Đã trả phòng</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default OrderFilter;
