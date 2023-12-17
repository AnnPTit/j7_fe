import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
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
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";

export const AccountTable = (props) => {
  const { items = [], selected = [] } = props;

  const handleDelete = (id) => {
    props.onDelete(id);
  };

  const handleResetPassword = (id) => {
    props.onResetPassword(id);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">STT</TableCell>
                <TableCell>Mã nhân viên</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Số ĐT</TableCell>
                <TableCell>Căn cước công dân</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((account, index) => {
                const birthday = moment(account.birthday).format("DD/MM/YYYY");
                const isSelected = selected.includes(account.id);
                const hrefUpdate = `/update/updateAccount/updateAccount?id=${account.id}`;
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
                      handleDelete(account.id);
                      toast.success("Xóa thành công!");
                    }
                  });
                };
                const alertResetPassword = () => {
                  Swal.fire({
                    title: "Bạn chắc chắn muốn đặt lại mật khẩu?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Đặt lại!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Đặt lại mật khẩu!", "Đặt lại mật khẩu thành công.", "success");
                      handleResetPassword(account.id);
                      toast.success("Đặt lại mật khẩu thành công!");
                    }
                  });
                };
                return (
                  <TableRow hover key={account.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.accountCode}</TableCell>
                    <TableCell>{account.fullname}</TableCell>
                    <TableCell>{account.gender ? "Nam" : "Nữ"}</TableCell>
                    <TableCell>{account.birthday}</TableCell>
                    <TableCell>{account.phoneNumber}</TableCell>
                    <TableCell>{account.citizenId}</TableCell>
                    <TableCell>
                      {account.provinces} - {account.districts} - {account.wards}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      {account.position.positionName === "ROLE_ADMIN" ? "Quản lý" : "Nhân Viên"}
                    </TableCell>
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
                      <button className="btn btn-success m-xl-2" onClick={alertResetPassword}>
                      <RotateLeftIcon />
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

AccountTable.propTypes = {
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
