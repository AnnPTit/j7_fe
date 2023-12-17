import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import style from "./updateRoom.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Card from "react-bootstrap/Card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Autocomplete, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  Box,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SvgIcon,
  OutlinedInput,
  InputAdornment,
  Checkbox,
  Select,
  InputLabel,
  Grid,
  Typography,
  Slider,
  Divider,
  IconButton,
} from "@mui/material";

const cx = classNames.bind(style);

function UpdateBlog() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [blogImages, setBlogImages] = useState([]);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [blogUpdate, setBlogUpdate] = useState({
    id: "",
    title: "",
    content: "",
  });
  const [comment, setComment] = useState([]);

  const loadComment = async () => {
    try {
      const response = await axios.get(`http://localhost:2003/api/home/blog/comment?blogId=${id}`);

      if (response) {
        const data = response.data;
        console.log(data);
        setComment(data);
      } else {
        console.error("Response or content is undefined.");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const formatDate2 = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));

    return formattedDate;
  };

  const handleOpenDateDialog = () => {
    setOpenDateDialog(true);
  };
  useEffect(() => {
    loadComment();
  }, [id]);

  const handleCloseDateDialog = () => {
    setOpenDateDialog(false);
  };
  const MAX_IMAGE_COUNT = 6; // Giới hạn số lượng ảnh tối đa

  const handleSubmit = async (event, id, blogUpdate, selectedImages) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    const formData = new FormData();

    // Append room information to formData
    formData.append("id", id);
    formData.append("title", blogUpdate.title);
    formData.append("content", blogUpdate.content);

    // Append each image file to formData
    selectedImages.forEach((image) => {
      formData.append("photos", image);
    });

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return false;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
      const response = await axios.put(
        `http://localhost:2003/api/admin/blog/update/${id}`,
        formData
      );
      // toast.success("Cập nhật thành công!", {
      //   position: toast.POSITION.BOTTOM_LEFT,
      // });
      console.log(response); //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/blog";
        return true;
        // Thực hiện các hành động khác sau khi API thành công
      } else {
        // Xử lý khi API gặp lỗi
        console.log("API call failed");
        return false;
        // Thực hiện các hành động khác khi gọi API thất bại
      }
    } catch (error) {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      if (error.response) {
        // Xử lý response lỗi
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
          return false;
        } else if (error.response.status === 400) {
          console.log(error.response.data);
          toast.error(error.response.data);
          const isTiltleError = error.response.data.title === undefined;
          const isContentError = error.response.data.content === undefined;

          // Kiểm tra nếu tất cả các trường không bị thiếu, hiển thị thông báo lỗi cho cả 3 trường
          if (!isTiltleError && !isContentError) {
            toast.error(error.response.data.title, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            toast.error(error.response.data.content, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            return false;
          } else {
            // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
            // và hiển thị thông báo lỗi cho các trường còn lại
            if (!isTiltleError) {
              alert(error.response.data.title);
              toast.error(error.response.data.title, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
            if (!isContentError) {
              toast.error(error.response.data.content, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
            return false;
          }
        } else {
          alert("Có lỗi xảy ra trong quá trình gọi API");
          return false;
        }
      } else {
        console.log("Không thể kết nối đến API");
        return false;
      }
    }
  };

  const handleDeleteComent = async (id) => {
    console.log(id);
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      console.log("Bạn chưa đăng nhập");
      return false;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.get(`http://localhost:2003/api/home/blog/comment/${id}`);
    console.log(response); //
    loadComment();
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imageUrls = [];
    const selectedImagesCopy = [...selectedImages];

    // Convert files object to an array
    const fileList = Array.from(files);

    // Calculate the number of images that can be added without exceeding the limit
    const remainingImageCount = MAX_IMAGE_COUNT - selectedImagesCopy.length;

    // Check if there are already preloaded images
    const preloadedImageCount = blogImages.length;

    // If the total number of images (preloaded + selected) exceeds the limit, show an error
    if (preloadedImageCount + fileList.length > MAX_IMAGE_COUNT) {
      toast.error(`Chỉ được chọn tối đa ${MAX_IMAGE_COUNT} ảnh!`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    // Create an array of URLs for the selected images
    for (let i = 0; i < Math.min(fileList.length, remainingImageCount); i++) {
      const url = URL.createObjectURL(fileList[i]);
      imageUrls.push(url);
    }

    // Update the selectedImages state with the new image files
    setSelectedImages([...selectedImagesCopy, ...fileList.slice(0, remainingImageCount)]);
    // Update the roomImages state with new image URLs
    setBlogImages([...blogImages, ...imageUrls]);
  };

  useEffect(() => {
    async function fetchBlogImages() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(`http://localhost:2003/api/admin/blog/photo/${id}`);
        console.log("Response data:", response.data);
        const photos = response.data; // Assuming the API response returns a list of photo URLs directly

        setBlogImages(photos); // Set the roomImages state with the array of photo URLs
      } catch (error) {
        console.log("Error fetching room images:", error);
      }
    }
    fetchBlogImages();
  }, [id]);

  //Hàm detail
  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          console.log("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/blog/detail/${id}`);
        console.log("Room", response.data);
        setBlogUpdate(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);

  const handleDeleteImage = async (photoId, index) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Find the photo based on the photoId
      const photoToDelete = blogImages.find((photo) => photo.id === photoId);

      if (photoId && !photoToDelete) {
        console.log("Photo not found in roomImages.");
        return;
      }

      // If the photoId exists, delete the image using the API
      if (photoId) {
        const response = await axios.delete(
          `http://localhost:2003/api/admin/blog/delete-photo/${photoId}`
        );

        if (response.status === 200) {
          // If the image is successfully deleted from the server, remove it from the client-side state
          const updatedImages = blogImages.filter((photo) => photo.id !== photoId);
          setBlogImages(updatedImages);
          toast.success("Image deleted successfully!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } else {
        // If the photoId does not exist, remove the image using the provided index
        const updatedImages = [...blogImages];
        updatedImages.splice(index, 1);
        setBlogImages(updatedImages);
        toast.success("Image deleted successfully!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      console.log("Error deleting image:", error);
      // console.error("Error deleting image:", error.response.data);

      toast.error("Error deleting image!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <h1>Cập Nhật Bài Viết</h1>
      <div className="form-floating mt-5 mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="title"
          value={blogUpdate.title}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Tiêu đề</label>
      </div>
      <br></br>
      <div className="form-floating">
        <textarea
          style={{ height: "150px" }}
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="content"
          value={blogUpdate.content}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              content: e.target.value,
            }));
          }}
        ></textarea>
        <label htmlFor="floatingPassword">Nội dung</label>
      </div>
      <br></br>
      <div>
        <input
          ref={fileInputRef}
          name="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      <label
        className="icon-container d-flex justify-content-center align-items-center"
        onClick={() => fileInputRef.current.click()}
        htmlFor="photosInput"
        style={{ cursor: "pointer" }}
      >
        <CloudUploadIcon style={{ fontSize: "7rem" }} />
      </label>

      <br />
      <div className="image-container d-flex justify-content-center flex-wrap mb-4">
        {blogImages.map((photo, index) => (
          <Card
            key={index}
            style={{
              marginTop: 20,
              marginRight: 20,
              position: "relative",
              display: "inline-block",
            }}
          >
            <Card.Img
              src={typeof photo === "string" ? photo : photo.url}
              style={{ width: 250 }}
              alt={`Room Image ${index}`}
            />
            <Card.Body style={{ padding: "0rem" }}>
              <button
                onClick={() => handleDeleteImage(photo.id, index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "20%",
                  cursor: "pointer",
                  padding: "10px",
                }}
              >
                X
              </button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <br></br>
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Bạn chắc chắn muốn cập nhật?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Cập nhật!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, id, blogUpdate, selectedImages);
              if (isSubmitSuccess) {
                Swal.fire("Cập nhật!", "Cập nhật thành công", "success");
                toast.success("Cập nhật thành công!");
              }
            }
          });
        }}
        style={{
          position: "absolute",
          right: 200,
          width: 150,
          height: 45,
        }}
      >
        Cập nhật
      </button>
      <button className={(cx("input-btn"), "btn btn-primary")} onClick={handleOpenDateDialog}>
        Xem bình luận{" "}
      </button>
      <ToastContainer />

      <Dialog
        open={openDateDialog}
        fullWidth
        PaperProps={{
          style: {
            maxWidth: "35%",
          },
        }}
      >
        <DialogTitle>Bình Luận</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDateDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          style={{
            marginTop: 15,
            // display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally
          }}
        >
          {comment.map((commentItem, id) => (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p>
                {" "}
                {commentItem.username} : {commentItem.content} {formatDate2(commentItem.createdAt)}
              </p>
              <button
                className={(cx("input-btn"), "btn btn-primary")}
                onClick={() => {
                  handleCloseDateDialog();
                  Swal.fire({
                    title: "Bạn có chắc chắn muốn xóa ? ",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Hủy",
                    confirmButtonText: "Xóa!",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const isSubmitSuccess = await handleDeleteComent(commentItem.id);
                      if (isSubmitSuccess) {
                        Swal.fire("Xóa thành công !", "success");
                        toast.success("Xóa Thành Công !");
                      }
                    }
                  });
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateDialog} variant="outlined" color="error">
            Hủy
          </Button>
          <Button
            onClick={() => {
              {
              }
            }}
            variant="outlined"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
UpdateBlog.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateBlog;
