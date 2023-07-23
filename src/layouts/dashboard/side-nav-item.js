import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, btn, onUpdate } = props;
  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};
  const handleUpdate = () => {
    // Gọi hàm xử lý cập nhật dữ liệu đã được truyền vào thông qua prop onUpdate
    // Trong trường hợp này, chúng ta không cần truyền ID vào handleUpdate vì ID đã được lấy từ props khi component được gọi
    onUpdate();
    // Các xử lý khác (nếu có) khi người dùng nhấn nút "Update"
    Swal.fire("Update!", `Updating data...`, "info");
  };

  if (btn) {
    // Render the component with a different layout for btn=true
    return (
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "center", // Center the content horizontally
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "center", // Center the content vertically
          width: "100%",
          ...(active && {
            backgroundColor: "#6366f1",
          }),
          "&:hover": {
            backgroundColor: "#6366f1",
          },
        }}
        {...linkProps}
        onClick={handleUpdate} // Xử lý khi người dùng nhấn nút "Update"
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "red",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "black",
              }),
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "black",
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            ...(active && {
              color: "common.white",
            }),
            ...(disabled && {
              color: "neutral.500",
            }),
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    );
  }

  // Default rendering for btn=false
  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "primary.main",
              }),
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: "neutral.400",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "24px",
            whiteSpace: "nowrap",
            ...(active && {
              color: "common.white",
            }),
            ...(disabled && {
              color: "neutral.500",
            }),
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  btn: PropTypes.bool,
};
