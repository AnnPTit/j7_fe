import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useState, useEffect } from "react";
import axios from "axios";

const now = new Date();

const Page = () => {
  const [countCustomer, setCountCustomer] = useState("");
  const [countCancel, setCountCancel] = useState("");
  const [countWait, setCountWait] = useState("");
  const [countConfirm, setCountConfirm] = useState("");
  const [countAccept, setCountAccept] = useState("");
  const [revenueMonth, setRevenueMonth] = useState("");
  const [revenueYear, setRevenueYear] = useState("");
  const [revenue, setRevenue] = useState([]);
  const [booking, setBooking] = useState("");
  const [topRoom, setTopRoom] = useState([]);
  const [order, setOrder] = useState([]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  // Count Customer
  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
         console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const countCustomer = await axios.get(
          "http://localhost:2003/api/admin/customer/countByStatus"
        );
        setCountCustomer(countCustomer.data);
        const countCancel = await axios.get("http://localhost:2003/api/order/countByCancel");
        setCountCancel(countCancel.data);
        const countWait = await axios.get("http://localhost:2003/api/order/countByWait");
        setCountWait(countWait.data);
        const countConfirm = await axios.get("http://localhost:2003/api/order/countByConfirm");
        setCountConfirm(countConfirm.data);
        const countAccept = await axios.get("http://localhost:2003/api/order/countByAccept");
        setCountAccept(countAccept.data);
        const revenueMonth = await axios.get("http://localhost:2003/api/order/getRevenueMonth");
        setRevenueMonth(revenueMonth.data);
        const revenueYear = await axios.get("http://localhost:2003/api/order/getRevenueYear");
        setRevenueYear(revenueYear.data);
        const booking = await axios.get("http://localhost:2003/api/order-detail/getBooking");
        setBooking(booking.data);
        const topRoom = await axios.get("http://localhost:2003/api/admin/room/topRoom");
        setTopRoom(topRoom.data);
        const order = await axios.get("http://localhost:2003/api/order/getList");
        setOrder(order.data);
        const revenue = await axios.get("http://localhost:2003/api/order/getRevenue");
        setRevenue(revenue.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const thisYearData = Array(12).fill(0);

  revenue.forEach((item) => {
    thisYearData[item.month - 1] = item.revenue;
  });

  const lastYearData = thisYearData.map((value) => value * 0.5);

  return (
    <>
      <Head>
        <title>Thống kê | Armani Hotel</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              {revenueYear === "" ? (
                <OverviewBudget difference={0} positive sx={{ height: "100%" }} value="0" />
              ) : (
                <OverviewBudget
                  difference={12}
                  positive
                  sx={{ height: "100%" }}
                  value={formatPrice(revenueYear)}
                />
              )}
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              {isNaN(countCustomer) ? null : (
                <OverviewTotalCustomers
                  difference={16}
                  positive={false}
                  sx={{ height: "100%" }}
                  value={countCustomer.toString()}
                />
              )}
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              {isNaN(booking) ? null : (
                <OverviewTasksProgress sx={{ height: "100%" }} value={parseInt(booking)} />
              )}
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              {revenueMonth === "" ? (
                <OverviewTotalProfit difference={1} positive sx={{ height: "100%" }} value="0" />
              ) : (
                <OverviewTotalProfit
                  difference={12}
                  positive
                  sx={{ height: "100%" }}
                  value={formatPrice(revenueMonth)}
                />
              )}
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This month",
                    data: thisYearData,
                  },
                  {
                    name: "Last month",
                    data: lastYearData,
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[countConfirm, countAccept, countWait, countCancel]}
                labels={["Đã nhận phòng", "Đã trả phòng", "Chờ xác nhận", "Đã hủy"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts
                products={topRoom.slice(0, 5).map((room) => ({
                  id: room.id,
                  image: room.photoList.length > 0 ? room.photoList[0].url : "/default-image.jpg",
                  name: room.roomName,
                  updatedAt: room.updatedAt,
                }))}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders
                orders={order.slice(0, 7).map((order) => ({
                  ref: order.orderCode,
                  id: order.typeOfOrder,
                  amount: order.totalMoney,
                  customer: {
                    name: order.customer.fullname,
                  },
                  createdAt: order.createAt,
                  status: order.status,
                }))}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
