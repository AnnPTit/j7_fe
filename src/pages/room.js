import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RoomSearch } from "src/sections/room/room-search";
import RoomFilter from "src/sections/room/room-filter";
import { RoomTable } from "src/sections/room/room-table";
import { applyPagination } from "src/utils/apply-pagination";
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const useRoom = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useRoomIds = (room) => {
  return useMemo(() => {
    return room.map((room) => room.id);
  }, [room]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const room = useRoom(data, page, rowsPerPage);
  const roomIds = useRoomIds(room);
  const roomSelection = useSelection(roomIds);
  const [pageNumber, setPageNumber] = useState(0);

  // Search
  const [textSearch, setTextSearch] = useState("");
  // Filter
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");
  const [statusChoose, setStatusChoose] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pathname = usePathname();

  const item = {
    title: "Thêm mới",
    path: "room/add",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  // Delete room
  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:2003/api/admin/room/delete/${id}`);
      console.log(result);
      setDataChange(!dataChange);
      Swal.fire("Đã xóa!", "Dữ liệu đã được xóa.", "success");
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Phòng đang nằm trong hóa đơn không thể xóa", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };
  //change status
  const changeStatus = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:2003/api/admin/room/change-status/${id}`);
      console.log(result);
      setDataChange(!dataChange);
      Swal.fire("Thành công!", "Dữ liệu phòng đã được cập nhật.", "success");
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Có lỗi xảy ra", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  // get data for filter
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/admin/floor/getList");
        const response2 = await axios.get("http://localhost:2003/api/admin/type-room/getList");
        console.log(response.data);
        console.log(response2.data);
        setFloor(response.data);
        setTypeRoom(response2.data);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  // Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

        let Api = `http://localhost:2003/api/admin/room/loadAndSearch?current_page=${pageNumber}`;

        if (textSearch !== "") {
          Api = Api + `&key=${textSearch}`;
        }
        if (floorChose !== "") {
          Api = Api + `&floorId=${floorChose}`;
        }
        if (typeRoomChose !== "") {
          Api = Api + `&typeRoomId=${typeRoomChose}`;
        }
        if (statusChoose !== "") {
          Api = Api + `&status=${statusChoose}`;
        }
        // console.warn(Api);
        const response = await axios.get(Api); // Thay đổi URL API của bạn tại đây
        console.log(response.data);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setData(response.data.content);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };

    fetchData();
  }, [pageNumber, dataChange, textSearch, floorChose, typeRoomChose, statusChoose]);

  return (
    <>
      <Head>
        <title>Phòng | Armani Hotel</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={0}></Stack>
              <div>
                <SideNavItem
                  style={{ backgroundColor: "red" }}
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                  btn={true}
                />
              </div>
            </Stack>
            <RoomSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <RoomFilter
              floor={floor}
              typeRoom={typeRoom}
              floorChose={floorChose}
              typeRoomChose={typeRoomChose}
              statusChoose={statusChoose}
              setFloorChose={setFloorChose}
              setTypeRoomChose={setTypeRoomChose}
              setStatusChoose={setStatusChoose}
            />
            <div style={{ minHeight: 500, marginBottom: 20 }}>
              {" "}
              <RoomTable
                items={room}
                selected={roomSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                onChangeStatus={changeStatus} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                setPageNumber={setPageNumber}
                totalElements={totalElements}
                pageNumber={pageNumber} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
              />
            </div>
          </Stack>
          <MyPagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            setPageNumber={setPageNumber}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
