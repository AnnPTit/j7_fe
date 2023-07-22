import PropTypes from "prop-types";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";

export const RoomTable = (props) => {
  const { items = [], selected = [] } = props;

  const imageUrlBase = "http://localhost:2003";

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const handleDelete = (id) => {
    props.onDelete(id);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Room Code</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Type Room</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((room, index) => {
                // const created = moment(room.createAt).format("DD/MM/YYYY - HH:mm:ss");
                // const updated = moment(room.updateAt).format("DD/MM/YYYY - HH:mm:ss");
                const alertDelete = () => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Deleted!", "Your data has been deleted.", "success");
                      handleDelete(room.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };

                return (
                  <TableRow hover key={room.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{room.roomCode}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        {room.photoList.length > 0 && ( // Check if photoList is not empty
                          <img
                            key={room.photoList[0].id} // Use key from the first photo
                            src={`${imageUrlBase}${room.photoList[0].url}`} // Use URL from the first photo
                            width={100}
                            height={100}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{room.roomName}</TableCell>
                    <TableCell>{room.typeRoom.typeRoomName}</TableCell>
                    <TableCell>{room.floor.floorName}</TableCell>
                    <TableCell>{room.note}</TableCell>
                    <TableCell>{room.status == 1 ? "Active" : "Unactive"}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary">Edit</button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        Delete
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

RoomTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
