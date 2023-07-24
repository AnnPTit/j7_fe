import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "src/components/scrollbar";
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
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import Bars4Icon from "@heroicons/react/24/solid/Bars4Icon";

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
                      handleDelete(serviceType.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };

                return editState === serviceType.id ? (
                  <EditServiceType
                    key={serviceType.id}
                    serviceType={serviceType}
                    serviceTypeData={serviceTypeData}
                    setServiceTypeData={setServiceTypeData}
                  />
                ) : (
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
                function EditServiceType({ serviceType, serviceTypeData, setServiceTypeData }) {
                  const [editedServiceType, setEditedServiceType] = useState({ ...serviceType });

                  function handleServiceTypeCode(event) {
                    const name = event.target.value;
                    setEditedServiceType((prevServiceType) => ({
                      ...prevServiceType,
                      serviceTypeCode: name,
                    }));
                  }

                  function handleServiceTypeName(event) {
                    const name = event.target.value;
                    setEditedServiceType((prevServiceType) => ({
                      ...prevServiceType,
                      serviceTypeName: name,
                    }));
                  }

                  function handleNote(event) {
                    const description = event.target.value;
                    setEditedServiceType((prevServiceType) => ({
                      ...prevServiceType,
                      description: description,
                    }));
                  }

                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
                      console.log(accessToken);
                      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

                      await axios.put(
                        `http://localhost:2003/api/service-type/update/${editedServiceType.id}`,
                        editedServiceType
                      );
                      const updatedData = serviceTypeData.map((f) =>
                        f.id === editedServiceType.id ? editedServiceType : f
                      );
                      setServiceTypeData(updatedData);
                      window.location.href = "/serviceType";
                    } catch (error) {
                      console.error(error);
                    }
                  };

                  const alertEdit = () => {
                    Swal.fire({
                      title: "Are you sure?",
                      icon: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, edit it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire("Edited!", "Your data has been edited.", "success");
                        handleUpdate();
                        toast.success("Edit Successfully!");
                      }
                    });
                  };

                  return (
                    <TableRow>
                      <TableCell padding="checkbox">
                        <div key={index}>
                          <span>{index + props.pageNumber * 5 + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleServiceTypeCode}
                          name="serviceTypeCode"
                          value={editedServiceType.serviceTypeCode}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleServiceTypeName}
                          name="serviceTypeName"
                          value={editedServiceType.serviceTypeName}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleNote}
                          name="description"
                          value={editedServiceType.description}
                        />
                      </TableCell>

                      <TableCell>{serviceType.status == 1 ? "Active" : "Unactive"}</TableCell>
                      <TableCell>
                        <button className="btn btn-primary" onClick={alertEdit}>
                          Update
                        </button>
                        <button className="btn btn-danger m-xl-2" onClick={handldeCancel}>
                          Cancel
                        </button>
                        <ToastContainer />
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
  function handleEdit(id) {
    setEditState(id);
  }

  function handldeCancel() {
    setEditState(false);
  }
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
