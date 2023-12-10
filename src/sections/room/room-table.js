import { useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import Link from "next/link";

export const RoomTable = (props) => {
  const { items = [], selected = [] } = props;

  // useEffect(() => {
  //   // Định nghĩa hàm fetchData bên trong useEffect
  //   async function fetchData() {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
  //       // Kiểm tra xem accessToken có tồn tại không
  //       if (!accessToken) {
  //        console.log("Bạn chưa đăng nhập");
  //         return;
  //       }
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  //       const response = await axios.get("http://localhost:2003/api/admin/floor/getList");
  //       const response2 = await axios.get("http://localhost:2003/api/admin/type-room/getList");
  //       console.log(response.data);
  //       console.log(response2.data);
  //       setFloor(response.data);
  //       setTypeRoom(response2.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   // Gọi hàm fetchData ngay lập tức
  //   fetchData();
  // }, []);

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
                <TableCell>Mã phòng</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên phòng</TableCell>
                <TableCell>Loại phòng</TableCell>
                <TableCell>Tầng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((room, index) => {
                const hrefUpdate = `/update/updateRoom/updateRoom?id=${room.id}`;
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn chắc chắn muốn xóa chứ?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Chắc chắn!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Đã xóa!", "Dữ liệu đã được xóa.", "success");
                      handleDelete(room.id);
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
                            src={`${room.photoList[0].url}`} // Use URL from the first photo
                            width={200}
                            height={200}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{room.roomName}</TableCell>
                    <TableCell>{room.typeRoom.typeRoomName}</TableCell>
                    <TableCell>{room.floor.floorName}</TableCell>
                    <TableCell>
                      {room.status === 1
                        ? "Phòng trống"
                        : room.status === 2
                        ? "Phòng đã được đặt"
                        : room.status === 3
                        ? "Đang có người ở"
                        : "Trạng thái khác"}
                    </TableCell>
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
