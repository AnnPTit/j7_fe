import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "src/components/scrollbar";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
} from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import Bars4Icon from "@heroicons/react/24/solid/Bars4Icon";

export const Combo = (props) => {
  const { items = [], selected = [] } = props;
  function formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  }

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
                <TableCell>Mã Combo dịch vụ</TableCell>
                <TableCell>Tên Combo dịch vụ</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Dịch vụ bên trong</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Hành động </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((combo, index) => {
                const hrefUpdate = `/update/updateCombo/updateCombo?id=${combo.id}`;
                const isSelected = selected.includes(combo.id);
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
                      handleDelete(combo.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };

                return (
                  <TableRow key={combo.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{combo.comboCode}</TableCell>
                    <TableCell>{combo.comboName}</TableCell>
                    <TableCell>{formatCurrency(combo.price)}</TableCell>
                    <TableCell>
                      <ul>
                        {combo.comboServiceList.map((comboService) => (
                          <li key={comboService.id}>
                            <p>
                              {" "}
                              {comboService.service.serviceName}
                              {/* {formatCurrency(comboService.service.price)} */}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{combo.note}</TableCell>
                    <TableCell>
                      <a className="btn btn-info m-xl-2" href={hrefUpdate}>
                        <SvgIcon fontSize="small">
                          <Bars4Icon />
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

Combo.propTypes = {
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
