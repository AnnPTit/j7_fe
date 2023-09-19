import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import TVIcon from "@heroicons/react/24/solid/TVIcon";
import ScaleIcon from "@heroicons/react/24/solid/ScaleIcon";
import BuildingLibraryIcon from "@heroicons/react/24/solid/BuildingLibraryIcon";
import MinusSmallIcon from "@heroicons/react/24/solid/MinusSmallIcon";
import QueueListIcon from "@heroicons/react/24/solid/QueueListIcon";
import ClipboardIcon from "@heroicons/react/24/solid/ClipboardIcon";
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
    title: "Quản lý giao dịch",
    path: "/deal",
    icon: (
      <SvgIcon fontSize="small">
        <ScaleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý phòng",
    icon: (
      <Accordion style={{ width: 230, background: "none", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "darkgray", padding: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <BuildingLibraryIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: "bold" }}>Quản lý phòng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Use the Next.js Link component for navigation */}
            <Link href="/room">
              <Typography
                component="a"
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
          </Typography>
          <br />
          <Typography>
            <Link href="/type-room">
              <Typography
                component="a"
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
          </Typography>
          <br />
          <Typography>
            <Link href="/floor">
              <Typography
                component="a"
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
          </Typography>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: "Quản lý dịch vụ",
    icon: (
      <Accordion style={{ width: 230, background: "none", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "darkgray", padding: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <QueueListIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: "bold" }}>Quản lý dịch vụ</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Use the Next.js Link component for navigation */}
            <Link href="/service">
              <Typography
                component="a"
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
          </Typography>
          <br />
          <Typography>
            <Link href="/serviceType">
              <Typography
                component="a"
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
          </Typography>
          <br />
          <Typography>
            <Link href="/combo">
              <Typography
                component="a"
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
          </Typography>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: "Quản lý tài khoản",
    icon: (
      <Accordion style={{ width: 230, background: "none", boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="room-management-content"
          id="room-management-header"
          style={{ width: 230, color: "darkgray", padding: 0, margin: 0 }}
        >
          <SvgIcon fontSize="small" style={{ marginRight: 15 }}>
            <UsersIcon />
          </SvgIcon>
          <Typography style={{ fontWeight: "bold" }}>Quản lý tài khoản</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/* Use the Next.js Link component for navigation */}
            <Link href="/account" passHref>
              <Typography
                component="a"
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
          </Typography>
          <br />
          <Typography>
            <Link href="/customers">
              <Typography
                component="a"
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
          </Typography>
        </AccordionDetails>
      </Accordion>
    ),
  },
  {
    title: "Unit",
    path: "/unit",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardIcon />
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
