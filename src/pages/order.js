import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OrderTable } from "src/sections/order/order-table";
import { OrderSearch } from "src/sections/order/order-search";
import { applyPagination } from "src/utils/apply-pagination";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const useOrder = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useOrderIds = (order) => {
  return useMemo(() => {
    return order.map((order) => order.id);
  }, [order]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const order = useOrder(data, page, rowsPerPage);
  const orderIds = useOrderIds(order);
  const orderSelection = useSelection(orderIds);
  const [pageNumber, setPageNumber] = useState(0);
  const [textSearch, setTextSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/order/delete/${id}`);
      const updatedData = data.filter((order) => order.id !== id);
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
        let Api = `http://localhost:2003/api/admin/order/loadAndSearch?current_page=${pageNumber}`; // Thay đổi URL API của bạn tại đây
        if (textSearch !== "") {
          Api = Api + `&key=${textSearch}`;
        }
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
  }, [pageNumber, dataChange, textSearch]);

  return (
    <>
      <Head>
        <title>Quản lý hóa đơn | Hotel Finder</title>
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
                <Typography variant="h4">Hóa đơn</Typography>
              </Stack>
            </Stack>
            <OrderSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <div style={{ minHeight: 350 }}>
              {" "}
              <OrderTable
                items={order}
                selected={orderSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                setPageNumber={setPageNumber}
                totalElements={totalElements}
                pageNumber={pageNumber}
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
