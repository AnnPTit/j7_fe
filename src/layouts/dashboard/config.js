import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import TVIcon from "@heroicons/react/24/solid/TVIcon";
import WindowIcon from "@heroicons/react/24/solid/WindowIcon";
import ScaleIcon from "@heroicons/react/24/solid/ScaleIcon";
import BuildingLibraryIcon from "@heroicons/react/24/solid/BuildingLibraryIcon";
import MinusSmallIcon from "@heroicons/react/24/solid/MinusSmallIcon";
import QueueListIcon from "@heroicons/react/24/solid/QueueListIcon";
import ClipboardIcon from "@heroicons/react/24/solid/ClipboardIcon";
import Square3Stack3DIcon from "@heroicons/react/24/solid/Square3Stack3DIcon";
import { SvgIcon } from "@mui/material";
import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

export const items = [
  {
    title: "Thống kê",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sơ đồ phòng",
    path: "/room-plan",
    icon: (
      <SvgIcon fontSize="small">
        <Square3Stack3DIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Phòng đặt Online",
    path: "/book-room-online",
    icon: (
      <SvgIcon fontSize="small">
        <WindowIcon />
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
    title: "Lịch sử giao dịch",
    path: "/deal",
    icon: (
      <SvgIcon fontSize="small">
        <ScaleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "",
    icon: (
      <Accordion style={{ width: 230, background: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "#9DA4AE", padding: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <BuildingLibraryIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: 600, fontSize: 14 }}>Quản lý phòng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Link href="/room">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Phòng
            </Typography>
          </Link>
          <br />
          <Link href="/type-room">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Loại phòng
            </Typography>
          </Link>
          <br />
          <Link href="/floor">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Tầng
            </Typography>
          </Link>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: ".",
    icon: (
      <Accordion style={{ width: 230, background: "none", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "#9DA4AE", padding: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <QueueListIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: 600, fontSize: 14 }}>Quản lý dịch vụ</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Use the Next.js Link component for navigation */}
          <Link href="/service">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Dịch vụ
            </Typography>
          </Link>
          <br />
          <Link href="/serviceType">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Loại dịch vụ
            </Typography>
          </Link>
          <br />
          <Link href="/combo">
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Combo
            </Typography>
          </Link>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: ",",
    icon: (
      <Accordion style={{ width: 230, background: "none", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "#9DA4AE", padding: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <UsersIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: 600, fontSize: 14 }}>Quản lý tài khoản</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Use the Next.js Link component for navigation */}
          <Link href="/account" passHref>
            <Typography
              // component="a"
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Nhân viên
            </Typography>
          </Link>
          <br />
          <Link href="/customer">
            <Typography
              style={{
                display: "flex",
                alignItems: "center",
                color: "lightgray",
                textDecorationColor: "#1C2536",
              }}
            >
              <SvgIcon fontSize="small" style={{ marginRight: "8px" }}>
                <MinusSmallIcon />
              </SvgIcon>
              Khách hàng
            </Typography>
          </Link>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: "Đơn vị",
    path: "/unit",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardIcon />
      </SvgIcon>
    ),
  },
  ,
  {
    title: "Bài viết ",
    path: "/blog",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Error",
  //   path: "/404",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   ),
  // },
];
