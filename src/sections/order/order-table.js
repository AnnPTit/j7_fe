import PropTypes from "prop-types";
import moment from "moment";
import Swal from 'sweetalert2'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";

export const OrderTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
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
                <TableCell>Order Code</TableCell>
                <TableCell>Book Room</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Money</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {items.map((order) => {
                const created = moment(order.createAt).format("DD/MM/YYYY - hh:mm:ss");
                // const alertDelete = () => {
                //   Swal.fire({
                //     title: 'Are you sure?',
                //     text: "You won't be able to revert this!",
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonColor: '#3085d6',
                //     cancelButtonColor: '#d33',
                //     confirmButtonText: 'Yes, delete it!'
                //   }).then((result) => {
                //     if (result.isConfirmed) {
                //       Swal.fire(
                //         'Deleted!',
                //         'Your data has been deleted.',
                //         'success'
                //       )
                //       handleDelete(floor.id);
                //       toast.success("Delete Successfully!");
                //     }
                //   })
                // }
              
                return (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.bookRoom.bookRoomName}</TableCell>
                    <TableCell>{order.account.fullname}</TableCell>
                    <TableCell>{order.customer.fullname}</TableCell>
                    <TableCell>{order.totalMoney}</TableCell>
                    <TableCell>{order.note}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{order.status == 1 ? 'Active' : 'Unactive'}</TableCell>
                    {/* <TableCell>
                      <button className="btn btn-primary">Edit</button>
                      <button className="btn btn-danger m-xl-2">Delete</button>
                      <ToastContainer/>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

OrderTable.propTypes = {
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
