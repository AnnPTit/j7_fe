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
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";

export const TypeRoomTable = (props) => {
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

  const typeRoomCodeInput = document.querySelector('input[name="typeRoomCode"]');
  const typeRoomNameInput = document.querySelector('input[name="typeRoomName"]');
  const pricePerDayInput = document.querySelector('input[name="pricePerDay"]');
  const pricePerHoursInput = document.querySelector('input[name="pricePerHours"]');
  const pricePerDaytimeInput = document.querySelector('input[name="pricePerDaytime"]');
  const pricePerNighttimeInput = document.querySelector('input[name="pricePerNighttime"]');
  const priceOvertimeInput = document.querySelector('input[name="priceOvertime"]');
  const capacityInput = document.querySelector('input[name="capacity"]');
  const noteInput = document.querySelector('input[name="note"]');

  const typeRoomCode = typeRoomCodeInput?.value;
  const typeRoomName = typeRoomNameInput?.value;
  const pricePerDay = pricePerDayInput?.value;
  const pricePerHours = pricePerHoursInput?.value;
  const pricePerDaytime = pricePerDaytimeInput?.value;
  const pricePerNighttime = pricePerNighttimeInput?.value;
  const priceOvertime = priceOvertimeInput?.value;
  const capacity = capacityInput?.value;
  const note = noteInput?.value;

  const payload = {
    typeRoomCode,
    typeRoomName,
    pricePerDay,
    pricePerHours,
    pricePerDaytime,
    pricePerNighttime,
    priceOvertime,
    capacity,
    note,
  };
  // console.log(payload);

  const formatPrice = (price) => {
    if (typeof price !== "number") {
      return price;
    }

    return price.toLocaleString({ style: "currency", currency: "VND" }).replace(/\D00(?=\D*$)/, "");
  };

  const [typeRoomData, setTypeRoomData] = useState([payload]);
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
                <TableCell>Mã</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Giá theo ngày</TableCell>
                <TableCell>Giá theo giờ</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chức năng</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((typeRoom) => {
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa ? ",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Xóa!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      
                      handleDelete(typeRoom.id);
                      // toast.success("Xóa thành công !");
                    }
                  });
                };
                return editState === typeRoom.id ? (
                  <EditTypeRoom
                    key={typeRoom.id}
                    typeRoom={typeRoom}
                    typeRoomData={typeRoomData}
                    setTypeRoomData={setTypeRoomData}
                  />
                ) : (
                  <TableRow hover key={typeRoom.id}>
                    <TableCell>{typeRoom.typeRoomCode}</TableCell>
                    <TableCell>{typeRoom.typeRoomName}</TableCell>
                    <TableCell>{formatPrice(typeRoom.pricePerDay)}</TableCell>
                    <TableCell>{formatPrice(typeRoom.pricePerHours)}</TableCell>
                    <TableCell>{typeRoom.capacity}</TableCell>
                    <TableCell>{typeRoom.note}</TableCell>
                    <TableCell>{typeRoom.status == 1 ? "Hoạt động" : "Unactive"}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary" onClick={() => handleEdit(typeRoom.id)}>
                        <SvgIcon fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                      </button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
                function EditTypeRoom({ typeRoom, typeRoomData, setTypeRoomData }) {
                  const [editedTypeRoom, setEditedTypeRoom] = useState({ ...typeRoom });

                  function handleTypeRoomCode(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, typeRoomCode: name }));
                  }

                  function handleTypeRoomName(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, typeRoomName: name }));
                  }

                  function handlePricePerDay(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, pricePerDay: name }));
                  }

                  function handlePricePerHours(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, pricePerHours: name }));
                  }

                  function handlePricePerDaytime(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({
                      ...prevTypeRoom,
                      pricePerDaytime: name,
                    }));
                  }

                  function handlePricePerNighttime(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({
                      ...prevTypeRoom,
                      pricePerNighttime: name,
                    }));
                  }

                  function handlePriceOvertime(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, priceOvertime: name }));
                  }

                  function handleCapacity(event) {
                    const name = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, capacity: name }));
                  }

                  function handleNote(event) {
                    const note = event.target.value;
                    setEditedTypeRoom((prevTypeRoom) => ({ ...prevTypeRoom, note: note }));
                  }

                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      await axios.put(
                        `http://localhost:2003/api/admin/type-room/update/${editedTypeRoom.id}`,
                        editedTypeRoom
                      );
                      const updatedData = typeRoomData.map((f) =>
                        f.id === editedTypeRoom.id ? editedTypeRoom : f
                      );
                      setTypeRoomData(updatedData);
                      window.location.href = "/type-room";
                    } catch (error) {
                      console.error(error);
                    }
                  };

                  const alertEdit = () => {
                    Swal.fire({
                      title: "Bạn có chắc chắn muốn cập nhật ?",
                      icon: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, edit it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire("Cập nhật thành công !", "Cập nhật thành công !", "success");
                        handleUpdate();
                        toast.success("Cập nhật thành công !");
                      }
                    });
                  };

                  return (
                    <TableRow>
                      <TableCell>
                        <Input name="typeRoomCode" value={editedTypeRoom.typeRoomCode} />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleTypeRoomName}
                          name="typeRoomName"
                          value={editedTypeRoom.typeRoomName}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handlePricePerDay}
                          name="pricePerDay"
                          value={editedTypeRoom.pricePerDay}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handlePricePerHours}
                          name="pricePerHours"
                          value={editedTypeRoom.pricePerHours}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleCapacity}
                          name="capacity"
                          value={editedTypeRoom.capacity}
                        />
                      </TableCell>
                      <TableCell>
                        <Input onChange={handleNote} name="note" value={editedTypeRoom.note} />
                      </TableCell>
                      <TableCell>{typeRoom.status == 1 ? "Hoạt động" : "Unactive"}</TableCell>
                      <TableCell>
                        <button className="btn btn-primary" onClick={alertEdit}>
                          <SvgIcon fontSize="small">
                            <PencilSquareIcon />
                          </SvgIcon>
                        </button>
                        <button className="btn btn-danger m-xl-2" onClick={handldeCancel}>
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
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

TypeRoomTable.propTypes = {
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
