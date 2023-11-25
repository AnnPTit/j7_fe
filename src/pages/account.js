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
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
import { usePathname } from "next/navigation";
import AccountFilter from "src/sections/account/account-filter";

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
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const account = useAccount(data, page, rowsPerPage);
  const accountIds = useAccountIds(account);
  const accountSelection = useSelection(accountIds);

  const [pageNumber, setPageNumber] = useState(0);

  const [textSearch, setTextSearch] = useState("");

  const [position, setPosition] = useState([]);
  const [positionChose, setPositionChose] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pathname = usePathname();

  const item = {
    title: "Add",
    path: "input/InputAccount/inputAccount",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/account/delete/${id}`);
      console.log(id);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
    }
  };

    // ResetPassword
    const handleResetPassword = async (id) => {
      try {
        await axios.put(`http://localhost:2003/api/admin/account/resetPassword/${id}`);
        console.log(id);
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
        const response = await axios.get("http://localhost:2003/api/position/getAll");
        console.log(response.data);
        setPosition(response.data);
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

        let Api = `http://localhost:2003/api/admin/account/loadAndSearch?current_page=${pageNumber}`;

        if (textSearch !== "") {
          Api = Api + `&key=${textSearch}`;
        }
        if (positionChose !== "") {
          Api = Api + `&positionId=${positionChose}`;
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
  }, [pageNumber, dataChange, textSearch, positionChose]);

  return (
    <>
      <Head>
        <title>Nhân Viên |  Armani Hotel</title>
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
                <Typography variant="h4">Nhân viên</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
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
            <AccountSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <p
              style={{
                marginLeft: 20,
              }}
            >
              {" "}
              Lọc:
            </p>
            <AccountFilter
              position={position}
              positionChose={positionChose}
              setPositionChose={setPositionChose}
            />
            <div style={{ minHeight: 500 }}>
              {" "}
              <AccountTable
                items={account}
                selected={accountSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                onResetPassword={handleResetPassword} 
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
