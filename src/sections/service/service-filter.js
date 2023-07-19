import { MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";

function ServiceFilter({
  serviceType,
  unit,
  serviceTypeChose,
  unitChose,
  setServiceTypeChose,
  setUnitChose,
}) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {serviceType.length > 0 ? (
        <Select
          style={{
            width: 500,
            marginLeft: 20,
          }}
          value={serviceTypeChose}
          onChange={(e) => setServiceTypeChose(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {serviceType.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.serviceTypeName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
      {unit.length > 0 ? (
        <Select
          style={{
            width: 500,
            marginLeft: 20,
          }}
          value={unitChose}
          onChange={(e) => setUnitChose(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {unit.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.unitName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ServiceFilter;
