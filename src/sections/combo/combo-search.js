import { Card, OutlinedInput } from "@mui/material";

export const ComboSearch = ({ textSearch, setTextSearch }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={textSearch}
      fullWidth
      placeholder="Search Combo"
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setTextSearch(e.target.value);
      }}
    />
  </Card>
);
