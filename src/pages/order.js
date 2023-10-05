import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, TextField, Container, Grid, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OrderTable } from "src/sections/order/order-table";
import { OrderSearch } from "src/sections/order/order-search";
import { applyPagination } from "src/utils/apply-pagination";
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderFilter from "src/sections/order/order-filter";

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
  const [typeOfOrderChoose, setTypeOfOrderChoose] = useState("");
  const [statusChoose, setStatusChoose] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [valueTo, setValueTo] = useState(null);
  const [valueFrom, setValueFrom] = useState(null);

  const handleFromDateChange = (newValue) => {
    setValueFrom(newValue);
    if (newValue > valueTo) {
      setValueTo(newValue); // Update valueTo if the selected date is greater than the current valueTo
    }
  };

  const handleToDateChange = (newValue) => {
    setValueTo(newValue);
    if (newValue < valueFrom) {
      setValueFrom(newValue); // Update valueFrom if the selected date is smaller than the current valueFrom
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Return an empty string for null date values
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
        if (typeOfOrderChoose !== "") {
          Api = Api + `&typeOfOrder=${typeOfOrderChoose}`;
        }
        if (statusChoose !== "") {
          Api = Api + `&status=${statusChoose}`;
        }
        if (valueFrom) {
          const valueFromDate = new Date(valueFrom);
          valueFromDate.setDate(valueFromDate.getDate() + 1);
          const formattedValueFrom = valueFromDate.toISOString().slice(0, 10); // Lấy phần yyyy-MM-dd
          Api = Api + `&startDate=${formattedValueFrom}`;
          // console.log("Value from: ", formattedValueFrom);
        }
        if (valueTo) {
          const valueToDate = new Date(valueTo);
          valueToDate.setDate(valueToDate.getDate() + 1);
          const formattedValueTo = valueToDate.toISOString().slice(0, 10); // Lấy phần yyyy-MM-dd
          Api = Api + `&endDate=${formattedValueTo}`;
          // console.log("Value to: ", formattedValueTo);
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
  }, [pageNumber, dataChange, textSearch, typeOfOrderChoose, statusChoose, valueFrom, valueTo]);

  return (
    <>
      <Head>
        <title>Quản lý hóa đơn | Armani Hotel</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack>
            <OrderSearch textSearch={textSearch} setTextSearch={setTextSearch} />
            <div style={{ display: "flex", marginLeft: 530, marginTop: -128 }}>
              <Grid item xs={12} ml={2} mr={2} sm={12} xl={2} lg={3}>
                <DatePicker
                  label="Từ ngày"
                  value={valueFrom}
                  onChange={handleFromDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        value: formatDate(valueFrom), // Format the value here
                        readOnly: true, // Prevent manual input
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} xl={2} lg={3}>
                <DatePicker
                  label="Đến ngày"
                  value={valueTo}
                  onChange={handleToDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        value: formatDate(valueTo), // Format the value here
                        readOnly: true, // Prevent manual input
                      }}
                    />
                  )}
                />
              </Grid>
            </div>
            <p
              style={{
                marginLeft: 20,
              }}
            ></p>
            <OrderFilter
              typeOfOrderChoose={typeOfOrderChoose}
              statusChoose={statusChoose}
              setTypeOfOrderChoose={setTypeOfOrderChoose}
              setStatusChoose={setStatusChoose}
            />
            <div style={{ minHeight: 350, marginTop: 50 }}>
              {" "}
              <OrderTable
                items={order}
                selected={orderSelection.selected}
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
