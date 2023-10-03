import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

function DealFilter({ methodChoose, setMethodChoose}) {
  return (
    <div style={{ marginLeft: 450, marginTop: -70 }}>
      <FormControl variant="standard" style={{ marginLeft: 100 }} sx={{ minWidth: 180 }}>
        <InputLabel id="demo-simple-select-standard-label">Hình thức</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Hình thức"
          value={methodChoose}
          onChange={(e) => setMethodChoose(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value={0}>Chuyển khoản</MenuItem>
          <MenuItem value={1}>Tiền mặt</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default DealFilter;
