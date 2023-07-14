import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export const ServiceType = (props) => {
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>ServiceType Code</TableCell>
                <TableCell>ServiceType Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((serviceType) => {
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

                return (
                  <TableRow hover key={serviceType.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(serviceType.id);
                          } else {
                            onDeselectOne?.(serviceType.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{serviceType.serviceTypeCode}</TableCell>
                    <TableCell>{serviceType.serviceTypeName}</TableCell>
                    <TableCell>{serviceType.description}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary">Edit</button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        Delete
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
      {/* 
      <div>
        <nav aria-label="...">
          <ul className="pagination">
            <li className="page-item disabled">
              <button className="page-link">Previous</button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => {
                  props.setPageNumber(0);
                }}
              >
                1
              </button>
            </li>
            <li className="page-item active" aria-current="page">
              <button
                className="page-link"
                onClick={() => {
                  props.setPageNumber(1);
                }}
              >
                2
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => {
                  props.setPageNumber(2);
                }}
              >
                3
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => {
                  props.setPageNumber(3);
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div> */}
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
