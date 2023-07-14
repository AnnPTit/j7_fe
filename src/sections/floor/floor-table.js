import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Input,
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
import { Form } from "formik";

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
  // console.log(payload);

  // const [floorData, setFloorData] = useState({floorCode: '', floorName: '', note: ''});
  const [editState, setEditState] = useState(-1);

  const handleUpdateFloor = async (id) => {
    try {
      await axios.put(`http://localhost:2003/api/floor/update/${id}`, payload);
      window.location.href = "/floor";
    } catch (error) {
      console.error(error);
    }
  };

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
                return editState === floor.id ? (<EditFloor />) : (
                  <TableRow hover key={floor.id}>
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
              function EditFloor() {
                  // function handleFloorName(event) {
                  //     const name = event.target.value;
                  //     const updatedData = data.map((d) => d.id === floor.id ? {...d, floorName:name} : d);
                  //     setData(updatedData);
                  // }
                  return (
                    <TableRow hover key={floor2.id}>
                      <TableCell><Input name="floorCode" value={floor2.floorCode}></Input></TableCell>
                      <TableCell><Input name="floorName" value={floor2.floorName}></Input></TableCell>
                      <TableCell><Input name="note" value={floor2.note}></Input></TableCell>
                      <TableCell>{created}</TableCell>
                      <TableCell>{floor2.status == 1 ? "Active" : "Unactive"}</TableCell>
                      <TableCell>
                        <button className="btn btn-primary" onClick={() => handleUpdateFloor(floor2.id)}>Update</button>
                        <button className="btn btn-danger m-xl-2" onClick={handldeCancel}>Cancel</button>
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
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );

  function handleUpdate() {
    return (
      setEditState(-1)
    )
  }
  
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
