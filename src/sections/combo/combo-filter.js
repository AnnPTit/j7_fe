import { MenuItem, Select } from "@mui/material";

function ComboFilter({ service, serviceChoses, setServiceChoses }) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {service.length > 0 ? (
        <Select
          style={{
            width: 500,
            marginLeft: 20,
          }}
          value={serviceChoses}
          onChange={(e) => setServiceChoses(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {service.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.serviceName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ComboFilter;
