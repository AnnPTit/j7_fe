import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Container, Stack, SvgIcon } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BlogSearch } from "src/sections/blog/blog-search";
import { BlogTable } from "src/sections/blog/blog-table";
import { applyPagination } from "src/utils/apply-pagination";
import MyPagination from "src/components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { SideNavItem } from "src/layouts/dashboard/side-nav-item";
import { usePathname } from "next/navigation";

const useRoom = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("data : ", data);
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useRoomIds = (room) => {
  return useMemo(() => {
    return room.map((room) => room.id);
  }, [room]);
};

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [dataChange, setDataChange] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const room = useRoom(data, page, rowsPerPage);
  const roomIds = useRoomIds(room);
  const roomSelection = useSelection(roomIds);
  const [pageNumber, setPageNumber] = useState(0);

  // Search
  const [textSearch, setTextSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pathname = usePathname();
  const item = {
    title: "Thêm mới",
    path: "blog/add",
    icon: (
      <SvgIcon fontSize="small">
        <PlusIcon />
      </SvgIcon>
    ),
  };
  const active = item.path ? pathname === item.path : false;

  // Delete room
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2003/api/admin/blog/delete/${id}`);
      setDataChange(!dataChange);
    } catch (error) {
      console.log(error);
    }
  };

  // Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        console.log(accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        let Api = `http://localhost:2003/api/admin/blog/loadAndSearch?current_page=${pageNumber}`;
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
        <title>Bài viết | Armani Hotel</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={0}></Stack>
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
            <BlogSearch textSearch={textSearch} setTextSearch={setTextSearch} />

            <div style={{ minHeight: 500 }}>
              {" "}
              <BlogTable
                items={room}
                selected={roomSelection.selected}
                onDelete={handleDelete} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
                setPageNumber={setPageNumber}
                totalElements={totalElements}
                pageNumber={pageNumber} // Thêm prop onDelete và truyền giá trị của handleDelete vào đây
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
