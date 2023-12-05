import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

export const DiscountProgramSearch = ({ textSearch, setTextSearch }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={textSearch}
      fullWidth
      placeholder="Tìm kiếm theo mã, tên..."
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setTextSearch(e.target.value);
      }}
    />
  </Card>
);
