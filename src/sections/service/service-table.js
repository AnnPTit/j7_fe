import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "src/components/scrollbar";
import { Input, Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export const Service = (props) => {
  const { items = [], selected = [] } = props;
  const serviceCodeInput = document.querySelector('input[name="serviceCode"]');
  const serviceNameInput = document.querySelector('input[name="serviceName"]');
  const descriptionInput = document.querySelector('input[name="description"]');
  const serviceCode = serviceCodeInput?.value;
  const serviceName = serviceNameInput?.value;
  const description = descriptionInput?.value;

  const payload = {
    serviceCode,
    serviceName,
    description,
  };
  const [serviceData, setServiceData] = useState([payload]);
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
                <TableCell>Service Code</TableCell>
                <TableCell>Service Name</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((service, index) => {
                const isSelected = selected.includes(service.id);
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
                      handleDelete(service.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };

                return editState === service.id ? (
                  <EditService
                    key={service.id}
                    service={service}
                    serviceData={serviceData}
                    setServiceData={setServiceData}
                  />
                ) : (
                  <TableRow key={service.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{service.serviceCode}</TableCell>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>
                      {service.serviceType && service.serviceType.serviceTypeName
                        ? service.serviceType.serviceTypeName
                        : "Null"}
                    </TableCell>
                    <TableCell>
                      {service.unit && service.unit.unitName ? service.unit.unitName : "NULL"}
                    </TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary" onClick={() => handleEdit(service.id)}>
                        Edit
                      </button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        Delete
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
                function EditService({ service, serviceData, setServiceData }) {
                  const [editedService, setEditedService] = useState({ ...service });

                  function handleServiceCode(event) {
                    const name = event.target.value;
                    setEditedService((prevService) => ({
                      ...prevService,
                      serviceCode: name,
                    }));
                  }

                  function handleServiceName(event) {
                    const name = event.target.value;
                    setEditedService((prevService) => ({
                      ...prevService,
                      serviceName: name,
                    }));
                  }

                  function handleNote(event) {
                    const description = event.target.value;
                    setEditedService((prevService) => ({
                      ...prevService,
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
                        `http://localhost:2003/api/admin/admin/service/update/${editedService.id}`,
                        editedService
                      );
                      const updatedData = serviceData.map((f) =>
                        f.id === editedService.id ? editedService : f
                      );
                      setServiceData(updatedData);
                      window.location.href = "/service";
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
                      <TableCell>
                        <Input
                          onChange={handleServiceCode}
                          name="serviceCode"
                          value={editedService.serviceCode}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleServiceName}
                          name="serviceName"
                          value={editedService.serviceName}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleNote}
                          name="description"
                          value={editedService.description}
                        />
                      </TableCell>

                      <TableCell>{service.status == 1 ? "Active" : "Unactive"}</TableCell>
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

Service.propTypes = {
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
