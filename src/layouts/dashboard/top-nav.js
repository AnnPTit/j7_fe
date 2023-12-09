import PropTypes from "prop-types";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { NotificationPopover } from "./notification-popover";
import { useState,useEffect } from "react";
import axios from "axios";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();
  const notificationPopover = usePopover();
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchRecentOrders = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; 
        const response = await axios.get("http://localhost:2003/api/order/loadNotify");
        setRecentOrders(response.data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };
   if(accessToken!== undefined){
    fetchRecentOrders();
   }
  }, [])

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
            <Tooltip title="Search">
              <IconButton>
                <SvgIcon fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Thông báo">
              <Stack direction="row" spacing={2}>
                <IconButton
                  onClick={notificationPopover.handleOpen}
                  ref={notificationPopover.anchorRef}
                >
                  <Badge badgeContent={recentOrders.length} color="error">
                    <SvgIcon fontSize="small">
                      <BellIcon />
                    </SvgIcon>
                  </Badge>
                </IconButton>
              </Stack>
            </Tooltip>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              src="/assets/avatars/avatar-anika-visser.png"
            />
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
      <NotificationPopover
        anchorEl={notificationPopover.anchorRef.current}
        open={notificationPopover.open || hasNewNotifications}
        onClose={notificationPopover.handleClose}
        recentOrders={recentOrders}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
