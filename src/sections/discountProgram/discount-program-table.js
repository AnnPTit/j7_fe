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

export const DiscountProgramTable = (props) => {
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
                <TableCell>Mã</TableCell>
                <TableCell>Tên Chương Trình</TableCell>
                <TableCell>Hóa Đơn Tối Thiểu</TableCell>
                <TableCell>Giá trị giảm (%)</TableCell>
                <TableCell>Giá Trị Giảm Tối Đa</TableCell>
                <TableCell>Số Lượng</TableCell>
                <TableCell>Ngày Áp Dụng</TableCell>
                <TableCell>Ngày Kết Thúc</TableCell>
                <TableCell>Trạng Thái CTGG</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((discountProgram, index) => {
                const startDay = moment(discountProgram.startDay).format("DD/MM/YYYY");
                const endDate = moment(discountProgram.endDate).format("DD/MM/YYYY");
                const isSelected = selected.includes(discountProgram.id);
                const hrefUpdate = `/discount-program/update?id=${discountProgram.id}`;
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
                      handleDelete(discountProgram.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };
                return (
                  <TableRow hover key={discountProgram.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{discountProgram.code}</TableCell>
                    <TableCell>{discountProgram.name}</TableCell>
                    <TableCell>{discountProgram.minimumInvoice}</TableCell>
                    <TableCell>{discountProgram.reduceValue}</TableCell>
                    <TableCell>{discountProgram.maximumReductionValue}</TableCell>
                    <TableCell>{discountProgram.numberOfApplication}</TableCell>
                    <TableCell>{startDay}</TableCell>
                    <TableCell>{endDate}</TableCell>
                    <TableCell>{discountProgram.textStatus}</TableCell>
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

DiscountProgramTable.propTypes = {
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
