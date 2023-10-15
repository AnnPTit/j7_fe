import { Card, OutlinedInput } from "@mui/material";

export const CustomerSearch = ({ searchCustomer, setSearchCustomer }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={searchCustomer}
      fullWidth
      placeholder="Tìm kiếm khách hàng"
      sx={{ maxWidth: 500 }}
      onChange={(e) => {
        setSearchCustomer(e.target.value);
      }}
    />
  </Card>
);
