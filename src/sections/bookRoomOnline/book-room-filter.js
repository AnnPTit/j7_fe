import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

function BookRoomOnlineFilter({ statusChoose, setStatusChoose }) {
  return (
    <div style={{ marginTop: -90 }}>
      <FormControl variant="standard" style={{ marginLeft: 550 }} sx={{ minWidth: 180 }}>
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
          <MenuItem value="4">Xác nhận thông tin</MenuItem>
          <MenuItem value="5">Thanh toán tiền cọc</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default BookRoomOnlineFilter;
