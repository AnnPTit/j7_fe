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
import Link from "next/link";

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
              <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Mã</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Giá theo ngày</TableCell>
                <TableCell>Giá theo giờ</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Người lớn</TableCell>
                <TableCell>Trẻ em</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chức năng</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((typeRoom, index) => {
                const hrefUpdate = `/update/updateTypeRoom/updateTypeRoom?id=${typeRoom.id}`;
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
                return (
                  <TableRow hover key={typeRoom.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        {typeRoom.photoDTOS && typeRoom.photoDTOS.length > 0 && (
                          // Check if photoList is not null/undefined and not empty
                          <img
                            key={typeRoom.photoDTOS[0]} // Use key from the first photo
                            src={`${typeRoom.photoDTOS[0]}`} // Use URL from the first photo
                            width={200}
                            height={200}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{typeRoom.typeRoomCode}</TableCell>
                    <TableCell>{typeRoom.typeRoomName}</TableCell>
                    <TableCell>{formatPrice(typeRoom.pricePerDay)} VND</TableCell>
                    <TableCell>{formatPrice(typeRoom.pricePerHours)} VND</TableCell>
                    <TableCell>{typeRoom.capacity}</TableCell>
                    <TableCell>{typeRoom.adult}</TableCell>
                    <TableCell>{typeRoom.children}</TableCell>
                    <TableCell>{typeRoom.note}</TableCell>
                    <TableCell>{typeRoom.status == 1 ? "Hoạt động" : "Unactive"}</TableCell>
                    <TableCell>
                      <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                        <SvgIcon fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                      </Link>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
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
