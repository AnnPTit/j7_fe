import { useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import Link from "next/link";

export const BlogTable = (props) => {
  const { items = [], selected = [] } = props;
  const handleDelete = (id) => {
    props.onDelete(id);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Lượt thích</TableCell>
                <TableCell>Lượt Xem</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((room, index) => {
                const hrefUpdate = `/update/updateRoom/updateRoom?id=${room.id}`;
                const formatDate = (dateString) => {
                  const options = { day: "numeric", month: "numeric", year: "numeric" };
                  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
                  return formattedDate;
                };
                const alertDelete = () => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Deleted!", "Your data has been deleted.", "success");
                      handleDelete(room.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };

                return (
                  <TableRow hover key={room.id}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        {room.photoDTOS && room.photoDTOS.length > 0 && (
                          // Check if photoList is not null/undefined and not empty
                          <img
                            key={room.photoDTOS[0]} // Use key from the first photo
                            src={`${room.photoDTOS[0]}`} // Use URL from the first photo
                            width={200}
                            height={200}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{room.title}</TableCell>
                    <TableCell>{room.content}</TableCell>
                    <TableCell>{room.countLike}</TableCell>
                    <TableCell>{room.countView}</TableCell>
                    <TableCell>{formatDate(room.createAt)}</TableCell>
                    <TableCell>{room.createBy}</TableCell>
                    <TableCell>
                      <Link className="btn btn-primary m-xl-2" href={hrefUpdate}>
                        <SvgIcon fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                      </Link>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

BlogTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
