import classNames from "classnames/bind";
import style from "./inputRoom.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Card from "react-bootstrap/Card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);

function InputRoom() {
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const tiltleInpt = document.querySelector('input[name="blogTitle"]');
    const contentInpt = document.querySelector('textarea[name="blogContent"]');
    const tiltle = tiltleInpt?.value;
    const content = contentInpt?.value;

    const formData = new FormData(); // Create a new FormData object

    formData.append("title", tiltle);
    formData.append("content", content);
    // Append each file to the FormData object
    for (let i = 0; i < newPhotos.length; i++) {
      formData.append("photos", newPhotos[i]);
    }
    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        console.log("Bạn chưa đăng nhập");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
      const response = await axios.post("http://localhost:2003/api/admin/blog/save", formData); // Gọi API /api/room-type/save với payload và access token
      toast.success("Thêm thành công!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      console.log(response);
      console.log("formData: ", formData);

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/blog";
        // Thực hiện các hành động khác sau khi API thành công
      } else {
        // Xử lý khi API gặp lỗi
        console.log("API call failed");
        // Thực hiện các hành động khác khi gọi API thất bại
      }
    } catch (error) {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      if (error.response) {
        // Xử lý response lỗi
        if (error.response.status === 403) {
          alert("Bạn không có quyền truy cập vào trang này");
          window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        } else if (error.response.status === 400) {
          console.log(error.response);
          if (error.response.data.roomName == undefined && error.response.data.note == undefined) {
            toast.error(error.response.data, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
          // toast.error(error.response.data.roomCode, {
          //   position: toast.POSITION.BOTTOM_CENTER,
          // });
          toast.error(error.response.data.roomName, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          alert("Có lỗi xảy ra trong quá trình gọi API");
        }
      } else {
        console.log("Không thể kết nối đến API");
      }
    }
  };

  const handleDeleteImage = (index) => {
    // Remove the image at the given index from both newPhotos and previewImages arrays
    const updatedNewPhotos = [...newPhotos];
    const updatedPreviewImages = [...previewImages];
    updatedNewPhotos.splice(index, 1);
    updatedPreviewImages.splice(index, 1);
    setNewPhotos(updatedNewPhotos);
    setPreviewImages(updatedPreviewImages);
    if (updatedNewPhotos.length === 0) {
      fileInputRef.current.value = "";
    }
    setSelectedImagesCount(updatedNewPhotos.length);
  };

  const [selectedImagesCount, setSelectedImagesCount] = useState(0);

  const MAX_IMAGES = 6; // Maximum number of images allowed

  const handleFileChange = (event) => {
    const files = event.target.files;
    const images = Array.from(files);

    if (images.length + previewImages.length <= MAX_IMAGES) {
      setNewPhotos(images);

      const imagePreviews = images.map((image) => URL.createObjectURL(image));
      setPreviewImages((prevImages) => [...prevImages, ...imagePreviews]);
      setSelectedImagesCount((prevImages) => prevImages.length + imagePreviews.length);
    } else {
      // Notify user that maximum number of images is reached
      toast.error(`Bạn chỉ được thêm tối đa ${MAX_IMAGES} ảnh.`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div
      className={cx("wrapper")}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={cx("wrapper")}>
        <h1 style={{ marginBottom: 50 }}>Thêm bài viết</h1>
        <div className="d-flex mb-4">
          <div style={{ width: 490 }} className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="blogTitle"
            />
            <label htmlFor="floatingPassword">Tiêu đề</label>
          </div>
        </div>

        <div className="form-floating">
          <textarea
            className="form-control"
            id="floatingTextarea"
            placeholder="Description"
            name="blogContent"
            style={{ height: "150px" }}
          ></textarea>
          <label htmlFor="floatingTextarea">Nội dung</label>
        </div>
        <br></br>
        <hr />
        <div className="form-floating" style={{ textAlign: "center" }}>
          {/* Hide the original file input */}
          <input
            ref={fileInputRef}
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {/* Create a custom file input component */}
          <div>
            <label
              onClick={() => fileInputRef.current.click()}
              htmlFor="photosInput"
              style={{ cursor: "pointer" }}
            >
              <CloudUploadIcon style={{ fontSize: "7rem" }} />
            </label>
          </div>
          <div className="d-flex flex-wrap mb-4">
            {previewImages &&
              previewImages.map((image, index) => (
                <Card
                  key={index}
                  style={{ width: 250, marginRight: 20, marginLeft: 25, marginTop: 20 }}
                >
                  <Card.Img src={image} alt={`Photo ${index}`} style={{ height: "200px" }} />
                  <Card.Body style={{ padding: "0rem" }}>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      style={{
                        background: "red",
                        color: "white",
                        borderRadius: "20%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                      }}
                    >
                      X
                    </button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </div>
        <br></br>
        <hr />

        <br />
        <button
          className={(cx("input-btn"), "btn btn-primary")}
          onClick={() => {
            Swal.fire({
              title: "Bạn chắc chắn muốn thêm?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "Hủy",
              confirmButtonText: "Thêm",
            }).then(async (result) => {
              if (result.isConfirmed) {
                const isSubmitSuccess = await handleSubmit(event);
                if (isSubmitSuccess) {
                  Swal.fire("Thêm!", "Đã thêm vào danh sách.", "success");
                  toast.success("Thêm thành công!");
                }
              }
            });
          }}
          style={{
            position: "absolute",
            right: 250,
            width: 150,
            height: 45,
          }}
        >
          Thêm
        </button>
        <br />
        <br />
        <ToastContainer />
      </div>
    </div>
  );
}

InputRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputRoom;
