import { useState } from "react";
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
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";

export const ServiceType = (props) => {
  const { items = [], selected = [] } = props;
  const serviceTypeCodeInput = document.querySelector('input[name="serviceTypeCode"]');
  const serviceTypeNameInput = document.querySelector('input[name="serviceTypeName"]');
  const descriptionInput = document.querySelector('input[name="description"]');
  const serviceTypeCode = serviceTypeCodeInput?.value;
  const serviceTypeName = serviceTypeNameInput?.value;
  const description = descriptionInput?.value;

  const payload = {
    serviceTypeCode,
    serviceTypeName,
    description,
  };
  const [serviceTypeData, setServiceTypeData] = useState([payload]);
  const [editState, setEditState] = useState(-1);

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
                <TableCell>Mã loại dịch vụ</TableCell>
                <TableCell>Tên loại dịch vụ</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Hành động </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((serviceType, index) => {
                const hrefUpdate = `/update/updateServiceType/updateServiceType?id=${serviceType.id}`;
                const isSelected = selected.includes(serviceType.id);
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa ? ",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Xóa!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Xóa thành công !", "Xóa thành công !", "success");
                      handleDelete(serviceType.id);
                      toast.success("Xóa thành công !");
                    }
                  });
                };

                return (
                  <TableRow key={serviceType.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{serviceType.serviceTypeCode}</TableCell>
                    <TableCell>{serviceType.serviceTypeName}</TableCell>
                    <TableCell>{serviceType.description}</TableCell>
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

ServiceType.propTypes = {
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
