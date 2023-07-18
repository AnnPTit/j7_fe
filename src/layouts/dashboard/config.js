import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import HeartIcon from "@heroicons/react/24/solid/HeartIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import Tippy from "@tippyjs/react";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Customers",
    icon: (
      <Tippy content="Hello">
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      </Tippy>
    ),
    type: "collapse",
    children: [
      {
        title: "Floor",
        path: "/floor",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
        type: "item",
      },
      // Thêm các mục con khác tại đây
    ],
  },
  {
    title: "Manager Order",
    path: "/order",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Account",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <HeartIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Room",
    path: "/room",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "TypeRoom",
    path: "/typeRoom",
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Floor",
    path: "/floor",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "ServiceType",
    path: "/serviceType",
    icon: (
      <SvgIcon fontSize="small">
        <Bars3Icon />
      </SvgIcon>
    ),
  },
  {
    title: "Companies",
    path: "/companies",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Account",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Settings",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Login",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Register",
    path: "/auth/register",
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Error",
    path: "/404",
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    ),
  },
];
