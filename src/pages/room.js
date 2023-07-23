import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RoomSearch } from "src/sections/room/room-search";
import RoomFilter from "src/sections/room/room-filter";
import { RoomTable } from "src/sections/room/room-table";
import { applyPagination } from "src/utils/apply-pagination";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import InputRoom from "src/components/InputRoom/InputRoom";

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
  const [inputModal, setInputModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const [textSearch, setTextSearch] = useState("");
  // filter
  const [floor, setFloor] = useState([]);
  const [typeRoom, setTypeRoom] = useState([]);
  const [floorChose, setFloorChose] = useState("");
  const [typeRoomChose, setTypeRoomChose] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const openModelInput = () => {
    setInputModal(!inputModal);
  };

  // Delete room
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/room/delete/${id}`);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
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
          alert("Bạn chưa đăng nhập");
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
        console.warn(Api);
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
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };

    fetchData();
  }, [pageNumber, dataChange, textSearch, floorChose, typeRoomChose]);

  return (
    <>
      <Head>
        <title>Room | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Room</Typography>
              </Stack>
              <div>
                <Button
                  onClick={openModelInput}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <RoomSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <RoomFilter
              floor={floor}
              typeRoom={typeRoom}
              floorChose={floorChose}
              typeRoomChose={typeRoomChose}
              setFloorChose={setFloorChose}
              setTypeRoomChose={setTypeRoomChose}
            />
            {inputModal && <InputRoom />}
            <div style={{ minHeight: 500 }}>
              {" "}
              <RoomTable
                items={room}
                selected={roomSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                setPageNumber={setPageNumber}
                totalElements={totalElements}
                pageNumber={pageNumber} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
              />
            </div>
          </Stack>
          <Pagination
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
