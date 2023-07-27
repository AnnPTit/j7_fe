import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Combo } from "src/sections/combo/combo-table";
import { ComboSearch } from "src/sections/combo/combo-search";
import { applyPagination } from "src/utils/apply-pagination";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(data, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [pageNumber, setPageNumber] = useState(0);
  const [textSearch, setTextSearch] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    const randomChars = Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );

    return randomChars.join("");
  }
  let randomString = generateRandomString(10); // Sinh chuỗi ngẫu nhiên có độ dài 10

  const pathname = usePathname();
  const item = {
    title: "Add",
    path: `input/inputCombo/inputCombo?code=CB_${randomString}`,
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  // Delete Customer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/combo/delete/${id}`);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
    }
  };

  // // Tim kiem
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
  //       console.log(accessToken);
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

  //       const response = await axios.get(
  //         `http://localhost:2003/api/admin/combo/search?key=${encodeURIComponent(textSearch)}`
  //       ); // Thay đổi URL API của bạn tại đây
  //       console.log(response.data);
  //       setTotalPages(response.data.totalPages);
  //       setTotalElements(response.data.totalElements);
  //       setData(response.data.content);
  //     } catch (error) {
  //       if (error.response) {
  //         // Xử lý response lỗi
  //         if (error.response.status === 403) {
  //           alert("Bạn không có quyền truy cập vào trang này");
  //           window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
  //         } else {
  //           alert("Có lỗi xảy ra trong quá trình gọi API");
  //         }
  //       } else {
  //         console.log("Không thể kết nối đến API");
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [textSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

        const response = await axios.get(
          `http://localhost:2003/api/admin/combo/load?current_page=${pageNumber}`
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
  }, [pageNumber, dataChange]);

  return (
    <>
      <Head>
        <title>Combo | Hotel Finder</title>
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
                <Typography variant="h4"> Combo dịch vụ </Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
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
              </div>
            </Stack>
            <ComboSearch textSearch={textSearch} setTextSearch={setTextSearch} />

            <div style={{ minHeight: 500 }}>
              {" "}
              <Combo
                items={customers}
                selected={customersSelection.selected}
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
