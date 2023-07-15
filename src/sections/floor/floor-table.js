import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Input,
  TextField,
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

export const FloorTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const floorCodeInput = document.querySelector('input[name="floorCode"]');
  const floorNameInput = document.querySelector('input[name="floorName"]');
  const noteInput = document.querySelector('input[name="note"]');

  const floorCode = floorCodeInput?.value;
  const floorName = floorNameInput?.value;
  const note = noteInput?.value;

  const payload = {
    floorCode,
    floorName,
    note,
  };
  console.log(payload);

  const [floorData, setFloorData] = useState([payload]);
  const [editState, setEditState] = useState(-1);

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
                <TableCell>Floor Code</TableCell>
                <TableCell>Floor Name</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((floor, floor2) => {
                const created = moment(floor.createAt).format("DD/MM/YYYY - HH:mm:ss");
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
                      handleDelete(floor.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };
                return editState === floor.id ? (
                  <EditFloor floor={floor} floorData={floorData} setFloorData={setFloorData} />
                ) : (
                  <TableRow hover key={floor2.id}>
                    <TableCell>{floor.floorCode}</TableCell>
                    <TableCell>{floor.floorName}</TableCell>
                    <TableCell>{floor.note}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{floor.status == 1 ? "Active" : "Unactive"}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary" onClick={() => handleEdit(floor.id)}>
                        Edit
                      </button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        Delete
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
                function EditFloor({ floor, floorData, setFloorData }) {
                  const [editedFloor, setEditedFloor] = useState({ ...floor });

                  function handleFloorCode(event) {
                    const name = event.target.value;
                    setEditedFloor((prevFloor) => ({ ...prevFloor, floorCode: name }));
                  }

                  function handleFloorName(event) {
                    const name = event.target.value;
                    setEditedFloor((prevFloor) => ({ ...prevFloor, floorName: name }));
                  }

                  function handleNote(event) {
                    const note = event.target.value;
                    setEditedFloor((prevFloor) => ({ ...prevFloor, note: note }));
                  }

                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      await axios.put(`http://localhost:2003/api/floor/update/${editedFloor.id}`, editedFloor);
                      const updatedData = floorData.map((f) => (f.id === editedFloor.id ? editedFloor : f));
                      setFloorData(updatedData);
                      window.location.href = "/floor";
                    } catch (error) {
                      console.error(error);
                    }
                  };

                  const alertEdit = () => {
                    Swal.fire({
                      title: "Are you sure?",
                      icon: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, edit it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire("Edited!", "Your data has been edited.", "success");
                        handleUpdate();
                        toast.success("Edit Successfully!");
                      }
                    });
                  };

                  return (
                    <TableRow>
                      <TableCell>
                        <Input
                          onChange={handleFloorCode}
                          name="floorCode"
                          value={editedFloor.floorCode}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleFloorName}
                          name="floorName"
                          value={editedFloor.floorName}
                        />
                      </TableCell>
                      <TableCell>
                        <Input onChange={handleNote} name="note" value={editedFloor.note} />
                      </TableCell>
                      <TableCell>{created}</TableCell>
                      <TableCell>{floor.status == 1 ? "Active" : "Unactive"}</TableCell>
                      <TableCell>
                        <button className="btn btn-primary" onClick={alertEdit}>
                          Update
                        </button>
                        <button className="btn btn-danger m-xl-2" onClick={handldeCancel}>
                          Cancel
                        </button>
                        <ToastContainer />
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );

  function handleEdit(id) {
    setEditState(id);
  }

  function handldeCancel() {
    setEditState(false);
  }
};

FloorTable.propTypes = {
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
