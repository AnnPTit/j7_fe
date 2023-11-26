import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
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
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

export const Unit = (props) => {
  const { items = [], selected = [] } = props;

  const unitNameInput = document.querySelector('input[name="unitName"]');

  const unitName = unitNameInput?.value;

  const payload = {
    unitName,
  };
  console.log(payload);
  const [unitData, setunitData] = useState([payload]);
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
                <TableCell>Tên Đơn Vị</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((unit, index) => {
                const isSelected = selected.includes(unit.id);
                // const created = moment(unit.createAt).format("DD/MM/YYYY - HH:mm:ss");
                const alertDelete = () => {
                  Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa ?",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire("Xóa thành công !", "Xóa thành công !", "success");
                      handleDelete(unit.id);
                      toast.success("Xóa thành công !");
                    }
                  });
                };
                return editState === unit.id ? (
                  <Editunit
                    key={unit.id}
                    unit={unit}
                    unitData={unitData}
                    setunitData={setunitData}
                  />
                ) : (
                  <TableRow key={unit.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{unit.unitName}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary" onClick={() => handleEdit(unit.id)}>
                        <SvgIcon>
                          <PencilSquareIcon />
                        </SvgIcon>
                      </button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        <SvgIcon>
                          <TrashIcon />
                        </SvgIcon>
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
                function Editunit({ unit, unitData, setunitData }) {
                  const [editedunit, setEditedunit] = useState({ ...unit });

                  function handleunitName(event) {
                    const name = event.target.value;
                    setEditedunit((prevunit) => ({ ...prevunit, unitName: name }));
                  }

                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      await axios.put(
                        `http://localhost:2003/api/admin/unit/update/${editedunit.id}`,
                        editedunit
                      );
                      const updatedData = unitData.map((f) =>
                        f.id === editedunit.id ? editedunit : f
                      );
                      setunitData(updatedData);
                      window.location.href = "/unit";
                    } catch (error) {
                      console.error(error);
                    }
                  };

                  const alertEdit = () => {
                    Swal.fire({
                      title: "Bạn có chắc chắn muốn cập nhật ?",
                      icon: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, edit it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire("Cập nhật thành công !", "Cập nhật thành công !", "success");
                        handleUpdate();
                        toast.success("Cập nhật thành công !");
                      }
                    });
                  };

                  return (
                    <TableRow selected={isSelected}>
                      <TableCell padding="checkbox">
                        <div key={index}>
                          <span>{index + props.pageNumber * 5 + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleunitName}
                          name="unitName"
                          value={editedunit.unitName}
                        />
                      </TableCell>
                      <TableCell>{unit.status == 1 ? "Active" : "Unactive"}</TableCell>
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

Unit.propTypes = {
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
