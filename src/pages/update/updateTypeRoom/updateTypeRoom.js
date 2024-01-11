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

function updateTypeRoom() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [blogImages, setBlogImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [blogUpdate, setBlogUpdate] = useState({
    id: "",
    typeRoomCode: "",
    typeRoomName: "",
    pricePerDay: "",
    pricePerHours: "",
    capacity: "",
    note: "",
    adult: "",
    children: "",
  });

  const MAX_IMAGE_COUNT = 10; // Giới hạn số lượng ảnh tối đa

  const handleSubmit = async (event, id, blogUpdate, selectedImages) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    const formData = new FormData();

    // Append room information to formData
    formData.append("id", id);
    formData.append("typeRoomCode", blogUpdate.typeRoomCode);
    formData.append("typeRoomName", blogUpdate.typeRoomName);
    formData.append("pricePerDay", blogUpdate.pricePerDay);
    formData.append("pricePerHours", blogUpdate.pricePerHours);
    formData.append("capacity", blogUpdate.capacity);
    formData.append("note", blogUpdate.note);
    formData.append("adult", blogUpdate.adult);
    formData.append("children", blogUpdate.children);

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
        `http://localhost:2003/api/admin/type-room/update/${id}`,
        formData
      );
      // toast.success("Cập nhật thành công!", {
      //   position: toast.POSITION.BOTTOM_LEFT,
      // });
      console.log(response); //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/type-room";
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

          return false;
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
        const response = await axios.get(`http://localhost:2003/api/admin/type-room/photo/${id}`);
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
        const response = await axios.get(`http://localhost:2003/api/admin/type-room/detail/${id}`);
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
          `http://localhost:2003/api/admin/type-room/delete-photo/${photoId}`
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
      <h1>Cập Nhật loại Phòng</h1>
      <div className="form-floating mt-5 mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="typeRoomCode"
          value={blogUpdate.typeRoomCode}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              typeRoomCode: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Mã loại phòng</label>
      </div>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="typeRoomName"
          value={blogUpdate.typeRoomName}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              typeRoomName: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tên loại phòng</label>
      </div>
      <br/>
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="pricePerDay"
          value={blogUpdate.pricePerDay}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              pricePerDay: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Giá theo ngày</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="pricePerHours"
          value={blogUpdate.pricePerHours}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              pricePerHours: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Giá theo giờ</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="capacity"
          value={blogUpdate.capacity}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              capacity: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Sức chứa</label>
      </div>
      <br />
      <div className="row g-3 align-items-center">
        <div className="form-floating col-6">
          <input
            type="number"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="adult"
            value={blogUpdate.adult}
            onChange={(e) => {
              setBlogUpdate((prev) => ({
                ...prev,
                adult: e.target.value,
              }));
            }}
          />
          <label htmlFor="floatingPassword">Người lớn</label>
        </div>
        <div className="form-floating col-6">
          <input
            type="number"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="children"
            value={blogUpdate.children}
            onChange={(e) => {
              setBlogUpdate((prev) => ({
                ...prev,
                children: e.target.value,
              }));
            }}
          />
          <label htmlFor="floatingPassword">Trẻ em</label>
        </div>
      </div>
      <br />
      <div className="form-floating">
        <textarea
          className="form-control"
          id="floatingTextarea"
          placeholder="Description"
          name="note"
          value={blogUpdate.note}
          onChange={(e) => {
            setBlogUpdate((prev) => ({
              ...prev,
              note: e.target.value,
            }));
          }}
          style={{ height: "150px" }}
        ></textarea>
        <label htmlFor="floatingTextarea">Ghi chú</label>
      </div>
      <br />
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
      <hr></hr>
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
      <br/>
      <ToastContainer />
    </div>
  );
}
updateTypeRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default updateTypeRoom;
