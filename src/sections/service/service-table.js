import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter từ Next.js
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
  Select,
  MenuItem,
  SvgIcon,
} from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import Bars4Icon from "@heroicons/react/24/solid/Bars4Icon";

export const Service = (props) => {
  const { items = [], selected = [] } = props;
  const serviceCodeInput = document.querySelector('input[name="serviceCode"]');
  const serviceNameInput = document.querySelector('input[name="serviceName"]');
  const descriptionInput = document.querySelector('input[name="description"]');
  const serviceCode = serviceCodeInput?.value;
  const serviceName = serviceNameInput?.value;
  const description = descriptionInput?.value;

  const [serviceTypeU, setServiceTypeU] = useState([]);
  const [unit, setUnit] = useState([]);

  const payload = {
    serviceCode,
    serviceName,
    description,
  };
  const [serviceData, setServiceData] = useState([payload]);
  const [editState, setEditState] = useState(-1);
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/admin/service-type/getAll");
        const response2 = await axios.get("http://localhost:2003/api/admin/unit/getAll");
        console.log(response.data);
        console.log(response2.data);
        setServiceTypeU(response.data);
        setUnit(response2.data);
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

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
                <TableCell>Mã dịch vụ</TableCell>
                <TableCell>Tên dịch vụ</TableCell>
                <TableCell>Loại dịch vụ</TableCell>
                <TableCell>Đơn vị tính</TableCell>
                <TableCell>Đơn giá </TableCell>
                <TableCell>Mô Tả </TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((service, index) => {
                const isSelected = selected.includes(service.id);
                const hrefUpdate = `/update/updateService/updateService?id=${service.id}`;
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
                      {service.unit && service.unit.unitName ? service.unit.unitName : "Null"}
                    </TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      {/* <button className="btn btn-primary" onClick={() => handleEdit(service.id)}>
                        Edit
                      </button> */}
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

                function EditService({ service, serviceData, setServiceData }) {
                  const [editedService, setEditedService] = useState({ ...service });

                  console.log(editedService);

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

                  function handleDescription(event) {
                    const description = event.target.value;
                    setEditedService((prevService) => ({
                      ...prevService,
                      description: description,
                    }));
                  }
                  function handlePrice(event) {
                    const price = event.target.value;
                    setEditedService((prevService) => ({
                      ...prevService,
                      price: price,
                    }));
                  }
                  function handleServiceType(event) {
                    const selectedId = event.target.value; // Lấy ra id của phần tử được chọn trong dropdown
                    // Tìm kiếm đối tượng serviceType tương ứng với selectedId trong mảng serviceTypeU (nếu cần)
                    const selectedServiceType = serviceTypeU.find(
                      (serviceType) => serviceType.id === selectedId
                    );
                    // alert(selectedServiceType.serviceTypeName); // Hiển thị id bằng cách sử dụng hàm alert hoặc làm bất kỳ xử lý nào bạn muốn với selectedId ở đây
                    setEditedService((prevService) => ({
                      ...prevService,
                      serviceType: selectedServiceType,
                    }));
                  }
                  function handleUnit(event) {
                    const selectedId = event.target.value; // Lấy ra id của phần tử được chọn trong dropdown
                    // Tìm kiếm đối tượng serviceType tương ứng với selectedId trong mảng serviceTypeU (nếu cần)
                    const selectedUnit = unit.find((unit) => unit.id === selectedId);
                    alert(selectedUnit.unitName); // Hiển thị id bằng cách sử dụng hàm alert hoặc làm bất kỳ xử lý nào bạn muốn với selectedId ở đây
                    setEditedService((prevService) => ({
                      ...prevService,
                      unit: selectedUnit,
                    }));
                  }

                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
                      console.log(accessToken);
                      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

                      await axios.put(
                        `http://localhost:2003/api/admin/service/update/${editedService.id}`,
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
                      <TableCell></TableCell>
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
                        <Select
                          name="serviceType"
                          value={editedService.serviceType.id} // Đảm bảo rằng giá trị value của Select là id của editedService.serviceType
                          onChange={handleServiceType} // Sử dụng onChange thay vì onClick để xử lý sự kiện khi người dùng chọn một tùy chọn mới
                        >
                          {serviceTypeU.map((serviceType) => (
                            <MenuItem key={serviceType.id} value={serviceType.id}>
                              {serviceType.serviceTypeName}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          name="unit"
                          value={editedService.unit.id} // Đảm bảo rằng giá trị value của Select là id của editedService.serviceType
                          onChange={handleUnit} // Sử dụng onChange thay vì onClick để xử lý sự kiện khi người dùng chọn một tùy chọn mới
                        >
                          {unit.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {unit.unitName}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Input onChange={handlePrice} name="price" value={editedService.price} />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleDescription}
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
