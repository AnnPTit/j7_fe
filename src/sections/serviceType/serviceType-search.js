import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

export const ServiceTypeSearch = ({ textSearch, setTextSearch }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={textSearch}
      defaultValue=""
      fullWidth
      placeholder="Search Service Type"
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setTextSearch(e.target.value);
      }}
    />
  </Card>
);
