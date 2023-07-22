import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Input,
  TextField,
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

export const AccountTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const accountCodeInput = document.querySelector('input[name="accountCode"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const fullNameInput = document.querySelector('input[name="fullName"]');
  const genderdInput = document.querySelector('input[name="gender"]');
  const birthdayInput = document.querySelector('input[name="birthday"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const citizenIdInput = document.querySelector('input[name="citizenId"]');


  const accountCode = accountCodeInput?.value;
  const password = passwordInput?.value;
  const gender = genderdInput?.value;
  const fullName = fullNameInput?.value;
  const email = emailInput?.value;
  const phoneNumber = phoneInput?.value;
  const birthday = birthdayInput?.value;
  const citizenId = citizenIdInput?.value;
  // const position = positionIdInput?.value;

  const payload = {
    accountCode,
    password,
    gender,
    fullName,
    email,
    phoneNumber,
    birthday,
    citizenId,
    // position,
  };
  // console.log(payload);

  const [accountData, setAccountData] = useState([payload]);
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
                <TableCell>Account Code</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Citizen Id</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((account, index) => {
                const birthday = moment(account.birthday).format("DD/MM/YYYY");
                const isSelected = selected.includes(account.id);
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
                      handleDelete(account.id);
                      toast.success("Delete Successfully!");
                    }
                  });
                };
                return editState === account.id ? (
                  <EditAccount
                    key={account.id}
                    account={account}
                    accountData={accountData}
                    setAccountData={setAccountData} />
                ) : (
                  <TableRow hover key={account.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <div key={index}>
                        <span>{index + props.pageNumber * 5 + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.accountCode}</TableCell>
                    <TableCell>{account.fullname}</TableCell>
                    <TableCell>{account.gender ? "Nam" : "Nữ"}</TableCell>
                    <TableCell>{birthday}</TableCell>
                    <TableCell>{account.phoneNumber}</TableCell>
                    <TableCell>{account.citizenId}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.position.positionName}</TableCell>
                    <TableCell>{account.status == 1 ? "Hoạt động" : "Unactive"}</TableCell>
                    <TableCell>
                      <button className="btn btn-primary" onClick={() => handleEdit(account.id)}>
                        Edit
                      </button>
                      <button className="btn btn-danger m-xl-2" onClick={alertDelete}>
                        Delete
                      </button>
                      <ToastContainer />
                    </TableCell>
                  </TableRow>
                );
                function EditAccount({ account, accountData, setAccountData }) {
                  const [editedAccount, setEditedAccount] = useState({ ...account });

                  function handleAccountCode(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, accountCode: name }));
                  }

                  function handleFullName(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, fullname: name }));
                  }

                  function handleGender(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, gender: name }));
                  }

                  function handleBirthday(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, birthday: name }));
                  }

                  function handlePhoneNumber(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, phoneNumber: name }));
                  }

                  function handleCitizenId(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, citizenId: name }));
                  }

                  function handleEmail(event) {
                    const name = event.target.value;
                    setEditedAccount((prevAccount) => ({ ...prevAccount, email: name }));
                  }



                  // Tương tự cho các trường dữ liệu khác
                  const handleUpdate = async () => {
                    try {
                      await axios.put(`http://localhost:2003/api/admin/account/update/${editedAccount.id}`, editedAccount);
                      const updatedData = accountData.map((f) => (f.id === editedAccount.id ? editedAccount : f));
                      setAccountData(updatedData);
                      window.location.href = "/account";
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
                          onChange={handleAccountCode}
                          name="accountCode"
                          value={editedAccount.accountCode}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleFullName}
                          name="fullname"
                          value={editedAccount.fullname}
                        />
                      </TableCell>
                      <TableCell>
                        <TableCell>
                          Nam
                          <Input type="radio"
                            onChange={handleGender}
                            name="gender"
                            value="true"
                            aria-label="Nam"
                          />
                        </TableCell>
                        <TableCell>
                          Nu
                          <Input type="radio"
                            onChange={handleGender}
                            name="gender"
                            value="false"
                          />
                        </TableCell>
                      </TableCell>
                      <TableCell>
                        <Input type="Date"
                          onChange={handleBirthday}
                          name="birthday"
                          value={editedAccount.birthday}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handlePhoneNumber}
                          name="phoneNumber"
                          value={editedAccount.phoneNumber}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleCitizenId}
                          name="citizenId"
                          value={editedAccount.citizenId}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          onChange={handleEmail}
                          name="email"
                          value={editedAccount.email}
                        />
                      </TableCell>
                      <TableCell>{account.position.positionName}</TableCell>
                      <TableCell>{account.status == 1 ? "Hoạt động" : "Unactive"}</TableCell>
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
