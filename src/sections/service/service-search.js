import { Card, OutlinedInput } from "@mui/material";

export const ServiceSearch = ({ textSearch, setTextSearch }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={textSearch}
      fullWidth
      placeholder="Tìm kiếm theo mã hoặc tên"
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setTextSearch(e.target.value);
      }}
    />
  </Card>
);
