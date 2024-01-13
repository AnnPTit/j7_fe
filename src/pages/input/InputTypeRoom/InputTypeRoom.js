import classNames from "classnames/bind";
import style from "./InputTypeRoom.module.scss";
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

function InputTypeRoom() {
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const typeRoomCodeInput = document.querySelector('input[name="typeRoomCode"]');
    const typeRoomNameInput = document.querySelector('input[name="typeRoomName"]');
    const pricePerDayInput = document.querySelector('input[name="pricePerDay"]');
    const pricePerHoursInput = document.querySelector('input[name="pricePerHours"]');
    const capacityInput = document.querySelector('input[name="capacity"]');
    const noteInput = document.querySelector('textarea[name="note"]');
    const adultInput = document.querySelector('input[name="adult"]');
    const childrenInput = document.querySelector('input[name="children"]');

    const typeRoomCode = typeRoomCodeInput?.value;
    const typeRoomName = typeRoomNameInput?.value;
    const pricePerDay = pricePerDayInput?.value;
    const pricePerHours = pricePerHoursInput?.value;
    const capacity = capacityInput?.value;
    const note = noteInput?.value;
    const adult = adultInput?.value;
    const children = childrenInput?.value;

    const formData = new FormData();

    formData.append("typeRoomCode", typeRoomCode);
    formData.append("typeRoomName", typeRoomName);
    formData.append("pricePerDay", pricePerDay);
    formData.append("pricePerHours", pricePerHours);
    formData.append("capacity", capacity);
    formData.append("note", note);
    formData.append("adult", adult);
    formData.append("children", children);
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

      console.log("formData: ", formData);
      const response = await axios.post("http://localhost:2003/api/admin/type-room/save", formData); // Gọi API /api/customers/save với payload và access token
      console.log(response);

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/input/inputRoom/inputRoom";
        toast.success("Thêm thành công!");
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
          toast.error(error.response);
      if (
            error.response.data.typeRoomCode == undefined &&
            error.response.data.typeRoomName == undefined
          ) {
            toast.error(error.response.data);
          }
          toast.error(error.response.data.typeRoomCode, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.typeRoomName, {
            position: toast.POSITION.BOTTOM_RIGHT,
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
    <div className={cx("wrapper")}>
      <h1>Thêm loại phòng</h1>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="typeRoomCode"
        />
        <label htmlFor="floatingPassword">Mã loại phòng</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="typeRoomName"
        />
        <label htmlFor="floatingPassword">Tên loại phòng</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="number"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="pricePerDay"
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
          style={{ height: "150px" }}
        ></textarea>
        <label htmlFor="floatingTextarea">Ghi chú</label>
      </div>
      <br />
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
          {/* <input
              id="photosInput"
              type="button"
              value="Choose Files"
               // Trigger the hidden file input on button click
            /> */}
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
      <hr />
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
      >
        Thêm
      </button>
      <ToastContainer />
    </div>
  );
}
InputTypeRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputTypeRoom;
