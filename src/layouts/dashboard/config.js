import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import HeartIcon from "@heroicons/react/24/solid/HeartIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import TVIcon from "@heroicons/react/24/solid/TVIcon";
import AdjustmentsVerticalIcon from "@heroicons/react/24/solid/AdjustmentsVerticalIcon";
import { SvgIcon } from "@mui/material";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React, { useState } from "react";
import Link from "next/link";

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
    title: "Đặt phòng tại quầy",
    path: "/book-room-offline",
    icon: (
      <SvgIcon fontSize="small">
        <TVIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý hóa đơn",
    path: "/order",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý phòng", // Đổi tiêu đề
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon /> {/* Đổi icon thành biểu tượng của phòng */}
      </SvgIcon>
    ),
    children: [
      // Thêm danh sách con cho "Quản lý phòng"
      {
        title: "Phòng",
        path: "/room",
        icon: (
          <SvgIcon fontSize="small">
            <HomeIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Loại phòng",
        path: "/type-room",
        icon: (
          <SvgIcon fontSize="small">
            <LockClosedIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Tầng",
        path: "/floor",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: "Customers",
    path: "/customers",
    icon: (
      <Tippy content="Hello">
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      </Tippy>
    ),
  },
  {
    title: "Nhân viên",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <HeartIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Phòng",
  //   path: "/room",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <HomeIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Loại phòng",
  //   path: "/type-room",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Tầng",
  //   path: "/floor",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ChartBarIcon />
  //     </SvgIcon>
  //   ),
  // },
  {
    title: "Service",
    path: "/service",
    icon: (
      <SvgIcon fontSize="small">
        <DocumentIcon />
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
    title: "Combo",
    path: "/combo",
    icon: (
      <SvgIcon fontSize="small">
        <AdjustmentsVerticalIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Webcam",
    path: "/webcam",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Unit",
    path: "/unit",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
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

export const YourMenuComponent = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div>
      <div onClick={toggleSubMenu}>
        {items[2].icon} {/* Hiển thị biểu tượng của "Quản lý phòng" */}
        <span>{items[2].title}</span>
      </div>
      {isSubMenuOpen && (
        <ul>
          {items[2].children.map((child) => (
            <li key={child.title}>
              <Link href={child.path}>
                <a>{child.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {/* Hiển thị các mục con nếu biến isSubMenuOpen là true */}
    </div>
  );
};