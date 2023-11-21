import { Box, Divider, Popover, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import format from "date-fns/format";
import Link from "next/link";

export const NotificationPopover = (props) => {
  const { anchorEl, onClose, open, recentOrders } = props;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
    >
      <Box sx={{ py: 1.5, px: 2 }}>
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <Box key={order.id}>
              <Typography>Có khách đặt phòng. Check ngay</Typography>
              <Link href="/book-room-online">
                <Typography onClick={handleLinkClick}>{order.orderCode} / {order.customer.fullname}</Typography>
              </Link>
              <Typography>{format(new Date(order.createAt), "EEEE, dd/MM/yyyy")}</Typography>
              <hr />
            </Box>
          ))
        ) : (
          <Typography variant="h4">Không có lượt đặt phòng nào mới...</Typography>
        )}
      </Box>
      <Divider />
    </Popover>
  );
};

NotificationPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  recentOrders: PropTypes.array.isRequired,
};
