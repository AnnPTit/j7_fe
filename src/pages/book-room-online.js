import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BookRoomTable } from "src/sections/bookRoomOnline/book-room-table";
import { BookRoomSearch } from "src/sections/bookRoomOnline/book-room-search";
import { applyPagination } from "src/utils/apply-pagination";
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import BookRoomOnlineFilter from "src/sections/bookRoomOnline/book-room-filter";

const useBookRoom = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useBookRoomIds = (bookRoom) => {
  return useMemo(() => {
    return bookRoom.map((bookRoom) => bookRoom.id);
  }, [bookRoom]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const bookRoom = useBookRoom(data, page, rowsPerPage);
  const bookRoomIds = useBookRoomIds(bookRoom);
  const bookRoomSelection = useSelection(bookRoomIds);
  const [pageNumber, setPageNumber] = useState(0);
  const [textSearch, setTextSearch] = useState("");
  const [statusChoose, setStatusChoose] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Delete bookRoom
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/order/delete/${id}`);
      const updatedData = data.filter((bookRoom) => bookRoom.id !== id);
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  // Change status
  const changeStatus = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:2003/api/manage-booking/change-status/${id}`
      );
      console.log(result);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Có lỗi xảy ra", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  // Change Wait Room
  const changeWaitRoom = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:2003/api/manage-booking/change-wait-room/${id}`
      );
      console.log(result);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Có lỗi xảy ra", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  // Change status
  const changeCancel = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:2003/api/manage-booking/change-cancel/${id}`
      );
      console.log(result);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error("Có lỗi xảy ra", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        const payload = {
          key: textSearch,
          status: statusChoose,
        };
        let Api = `http://localhost:2003/api/manage-booking/load?current_page=${pageNumber}`; // Thay đổi URL API của bạn tại đây
        const response = await axios.post(Api, payload); // Thay đổi URL API của bạn tại đây
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
  }, [pageNumber, dataChange, textSearch, statusChoose]);

  return (
    <>
      <Head>
        <title>Quản lý Booking | Armani Hotel</title>
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
            <BookRoomSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <BookRoomOnlineFilter statusChoose={statusChoose} setStatusChoose={setStatusChoose} />
            <div style={{ minHeight: 500 }}>
              {" "}
              <BookRoomTable
                items={bookRoom}
                selected={bookRoomSelection.selected}
                // onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                onChangeStatus={changeStatus} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                onChangeWaitRoom={changeWaitRoom}
                onChangeCancel={changeCancel}
                setPageNumber={setPageNumber}
                totalElements={totalElements}
                pageNumber={pageNumber}
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
