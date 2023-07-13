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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const order = useOrder(data, page, rowsPerPage);
  const orderIds = useOrderIds(order);
  const orderSelection = useSelection(orderIds);
  const [inputModal, setInputModal] = useState(false);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openModelInput = () => {
    setInputModal(!inputModal);
  };

  // Delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/order/delete/${id}`);
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

        const response = await axios.get("http://localhost:2003/api/order/load"); // Thay đổi URL API của bạn tại đây
        setData(response.data);
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
  }, []);

  return (
    <>
      <Head>
        <title>Order | Devias Kit</title>
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
                <Typography variant="h4">Order</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              
            </Stack>
            <OrderSearch />
            <OrderTable
              count={data.length}
              items={order}
              onDeselectAll={orderSelection.handleDeselectAll}
              onDeselectOne={orderSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={orderSelection.handleSelectAll}
              onSelectOne={orderSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={orderSelection.selected}
              onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
