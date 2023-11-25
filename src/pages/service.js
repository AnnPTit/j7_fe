import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ServiceSearch } from "src/sections/service/service-search";
import ServiceFilter from "src/sections/service/service-filter";
import { Service } from "src/sections/service/service-table";
import { applyPagination } from "src/utils/apply-pagination";
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
import { usePathname } from "next/navigation";
import PriceRangeSlider from "src/sections/service/price-slider";

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
  const [priceRange, setPriceRange] = useState([0, 5000000]);

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
    path: `input/inputService/inputService?code=DV_${randomString}`,
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
         console.log("Bạn chưa đăng nhập");
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
        if (priceRange.length !== 0) {
          Api = Api + `&start=${priceRange[0]}` + `&end=${priceRange[1]}`;
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
  }, [pageNumber, dataChange, textSearch, serviceTypeChose, unitChose, priceRange]);

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
                <Typography variant="h4">Dịch Vụ </Typography>
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
              Lọc Loại Dịch Vụ - Đơn Vị Tính:
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <ServiceFilter
                  serviceType={serviceType}
                  unit={unit}
                  serviceTypeChose={serviceTypeChose}
                  unitChose={unitChose}
                  setServiceTypeChose={setServiceTypeChose}
                  setUnitChose={setUnitChose}
                />
              </div>
              <div
                style={{
                  minWidth: 200,
                }}
              >
                {" "}
                <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} />
              </div>
            </div>
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
