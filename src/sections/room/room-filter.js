import { MenuItem, Select } from "@mui/material";

function RoomFilter({
  floor,
  typeRoom,
  floorChose,
  typeRoomChose,
  setFloorChose,
  setTypeRoomChose,
}) {
  return (
    <div >
      <label style={{marginLeft: 20}}>Tầng:</label>
      {floor.length > 0 ? (
        <Select
          style={{
            width: 200,
            marginLeft: 20,
          }}
          value={floorChose}
          onChange={(e) => setFloorChose(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {floor.map((floor) => (
            <MenuItem key={floor.id} value={floor.id}>
              {floor.floorName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
      <label style={{marginLeft: 50}}>Loại phòng:</label>
      {typeRoom.length > 0 ? (
        <Select
          style={{
            width: 200,
            marginLeft: 20,
          }}
          value={typeRoomChose}
          onChange={(e) => setTypeRoomChose(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {typeRoom.map((typeRoom) => (
            <MenuItem key={typeRoom.id} value={typeRoom.id}>
              {typeRoom.typeRoomName}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RoomFilter;
