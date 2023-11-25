import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import axios from "axios";
import Link from "next/link";
// import ChangePassword from "./ChangePasswordModal";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();


  const fullname = localStorage.getItem("fullName");
  const id = localStorage.getItem("idAccount");
  const hrefResetPassword = `/account/change-password?id=${id}`;



  const handleProfile = () => {
    onClose?.();
    router.push("/profile");
  };


  const handleSignOut = useCallback(() => {
    onClose?.();
    auth.signOut();
    router.push("/auth/login");
    localStorage.removeItem("accessToken");
  }, [onClose, auth, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Tài khoản</Typography>
        <Typography color="text.secondary" variant="body2">
          {fullname || "Loading..."}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleProfile}>Thông tin cá nhân</MenuItem>
        <Divider />
        <MenuItem>
          <Link
            style={{
              textDecoration: "none",
              color: "black",
            }}
            href={hrefResetPassword}
          >
            Đổi mật khẩu
          </Link>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>Đăng xuất</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
