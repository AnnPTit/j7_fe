import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ServiceSearch } from "src/sections/service/service-search";
import ServiceFilter from "src/sections/service/service-filter";
import { Service } from "src/sections/service/service-table";
import { applyPagination } from "src/utils/apply-pagination";
import Pagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
import { usePathname } from "next/navigation";

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
  // const [inputModal, setInputModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  // Search
  const [textSearch, setTextSearch] = useState("");
  // filter
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [serviceTypeChose, setServiceTypeChose] = useState("");
  const [unitChose, setUnitChose] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pathname = usePathname();

  const item = {
    title: "Add",
    path: "input/inputService/inputService",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  const openModelInput = () => {
    // setInputModal(!inputModal);
  };
  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/service/delete/${id}`);
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
        const response = await axios.get("http://localhost:2003/api/admin/service-type/getAll");
        const response2 = await axios.get("http://localhost:2003/api/admin/unit/getAll");
        console.log(response.data);
        console.log(response2.data);
        setServiceType(response.data);
        setUnit(response2.data);
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

        let Api = `http://localhost:2003/api/admin/service/loadAndSearch?current_page=${pageNumber}`;

        if (textSearch !== "") {
          Api = Api + `&key=${textSearch}`;
        }
        if (serviceTypeChose !== "") {
          Api = Api + `&serviceTypeId=${serviceTypeChose}`;
        }
        if (unitChose !== "") {
          Api = Api + `&unitId=${unitChose}`;
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
  }, [pageNumber, dataChange, textSearch, serviceTypeChose, unitChose]);

  return (
    <>
      <Head>
        <title>Service | Hotel Finder</title>
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
                <Typography variant="h4">Service </Typography>
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
            <ServiceSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <p
              style={{
                marginLeft: 20,
              }}
            >
              {" "}
              Filter:
            </p>
            <ServiceFilter
              serviceType={serviceType}
              unit={unit}
              serviceTypeChose={serviceTypeChose}
              unitChose={unitChose}
              setServiceTypeChose={setServiceTypeChose}
              setUnitChose={setUnitChose}
            />
            {/* {inputModal && <InputService />} */}
            <div style={{ minHeight: 500 }}>
              {" "}
              <Service
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
