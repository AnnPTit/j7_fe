import { Card, OutlinedInput } from '@mui/material';

export const RoomSearch = ({ textSearch, setTextSearch }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={textSearch}
      fullWidth
      placeholder="Tìm kiếm theo mã, tên"
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setTextSearch(e.target.value);
      }}
    />
  </Card>
);
