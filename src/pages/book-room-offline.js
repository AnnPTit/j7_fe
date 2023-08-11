import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BookRoomTable } from "src/sections/bookRoomOffline/book-room-table";
import { BookRoomSearch } from "src/sections/bookRoomOffline/book-room-search";
import { applyPagination } from "src/utils/apply-pagination";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const bookRoom = useBookRoom(data, page, rowsPerPage);
  const bookRoomIds = useBookRoomIds(bookRoom);
  const bookRoomSelection = useSelection(bookRoomIds);
  const [inputModal, setInputModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // Delete bookRoom
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/order/delete/${id}`);
      const updatedData = data.filter((bookRoom) => bookRoom.id !== id);
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

        const response = await axios.get(
          `http://localhost:2003/api/admin/order/loadByStatus?current_page=${pageNumber}`
        ); // Thay đổi URL API của bạn tại đây
        setTotalPages(response.data.totalPages);
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
  }, [pageNumber]);

  return (
    <>
      <Head>
        <title>Đặt phòng tại quầy | Hotel Finder</title>
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
            <BookRoomSearch />
            <div style={{ minHeight: 500 }}>
              {" "}
              <BookRoomTable
                count={data.length}
                items={bookRoom}
                onDeselectAll={bookRoomSelection.handleDeselectAll}
                onDeselectOne={bookRoomSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={bookRoomSelection.handleSelectAll}
                onSelectOne={bookRoomSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={bookRoomSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                setPageNumber={setPageNumber}
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
