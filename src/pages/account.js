import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountTable } from "src/sections/account/account-table";
import { AccountSearch } from "src/sections/account/account-search";
import { applyPagination } from "src/utils/apply-pagination";
import InputAccount from "src/components/InputAccount/InputAccount";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const useAccount = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useAccountIds = (account) => {
  return useMemo(() => {
    return account.map((account) => account.id);
  }, [account]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const account = useAccount(data, page, rowsPerPage);
  const accountIds = useAccountIds(account);
  const accountSelection = useSelection(accountIds);
  const [inputModal, setInputModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [textSearch, setTextSearch] = useState("");
  const [totalElements, setTotalElements] = useState(0);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const openModelInput = () => {
    setInputModal(!inputModal);
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/account/delete/${id}`);
      const updatedData = data.filter((account) => account.id !== id);
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

    // Tim kiem
    useEffect(() => {
      const fetchData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
          console.log(accessToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  
          const response = await axios.get(
            `http://localhost:2003/api/admin/account/search?key=${encodeURIComponent(textSearch)}`
          ); // Thay đổi URL API của bạn tại đây
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
    }, [textSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

        const response = await axios.get(
          `http://localhost:2003/api/admin/account/load?current_page=${pageNumber}`
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
        <title>Account |  Hotel Finder</title>
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
                <Typography variant="h4">Account</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
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
            <AccountSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            {inputModal && <InputAccount />}
            <div style={{ minHeight: 500 }}>
              {" "}
              <AccountTable
                items={account}
                selected={accountSelection.selected}
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
