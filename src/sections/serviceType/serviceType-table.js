import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

export const ServiceType = (props) => {
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
                <TableCell>ServiceType Code</TableCell>
                <TableCell>ServiceType Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((serviceType, index) => {
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
