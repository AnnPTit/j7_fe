import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Input,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import Bars4Icon from "@heroicons/react/24/solid/Bars4Icon";

export const CustomerTable = (props) => {
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
                <TableCell>Mã khách hàng</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Số ĐT</TableCell>
                <TableCell>Căn cước công dân</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((customer, index) => {
                const birthday = moment(customer.birthday).format("DD/MM/YYYY");
                const isSelected = selected.includes(customer.id);
                const hrefUpdate = `/update/updateCustomer/updateCustomer?id=${customer.id}`;
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn chắc chắn muốn xóa?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Xóa!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Xóa!", "Xóa thành công.", "success");
                      handleDelete(customer.id);
                      toast.success("Xóa thành công!");
                    }
                  });
                };
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.customerCode}</TableCell>
                    <TableCell>{customer.username}</TableCell>
                    <TableCell>{customer.fullname}</TableCell>
                    <TableCell>{customer.gender ? "Nam" : "Nữ"}</TableCell>
                    <TableCell>{birthday}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>{customer.citizenId}</TableCell>
                    <TableCell>
                      {customer.provinces} - {customer.districts} - {customer.wards}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <a className="btn btn-primary m-xl-2" href={hrefUpdate}>
                        <SvgIcon fontSize="small">
                          <PencilSquareIcon />
                        </SvgIcon>
                      </a>
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

CustomerTable.propTypes = {
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
