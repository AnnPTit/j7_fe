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

const cx = classNames.bind(style);

const handleSubmit = async (event, id, roomUpdate, selectedImages) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  const floorIput = document.querySelector('select[name="floor"]');
  const typeRoomIput = document.querySelector('select[name="typeRoom"]');
  const floor = floorIput?.value;
  const typeRoom = typeRoomIput?.value;

  let floorObj = {
    id: floor,
  };

  let typeRoomObj = {
    id: typeRoom,
  };

  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    ...roomUpdate,
    id: id,
    roomCode: roomUpdate.roomCode,
    roomName: roomUpdate.roomName,
    note: roomUpdate.note,
    floor: floorObj,
    typeRoom: typeRoomObj,
  };
  console.log("payload ", payload);

  const formData = new FormData();

  // Append room information to formData
  formData.append("id", id);
  formData.append("roomCode", roomUpdate.roomCode);
  formData.append("roomName", roomUpdate.roomName);
  formData.append("note", roomUpdate.note);
  formData.append("typeRoom", roomUpdate.typeRoom.id);
  formData.append("floor", roomUpdate.floor.id);

  // Append each image file to formData
  selectedImages.forEach((image) => {
    formData.append("photos", image);
  });

  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return false;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.put(`http://localhost:2003/api/admin/room/update/${id}`, formData); // Gọi API /api/room-type/save với payload và access token
    toast.success("Cập nhật thành công!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/room";
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

        const isRoomNameError = error.response.data.roomName === undefined;
        const isRoomCodeError = error.response.data.roomCode === undefined;
        const isNoteError = error.response.data.note === undefined;

        // Kiểm tra nếu tất cả các trường không bị thiếu, hiển thị thông báo lỗi cho cả 3 trường
        if (!isRoomNameError && !isRoomCodeError && !isNoteError) {
          toast.error(error.response.data.roomName, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.roomCode, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.note, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return false;
        } else {
          // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
          // và hiển thị thông báo lỗi cho các trường còn lại
          if (!isRoomNameError) {
            alert(error.response.data.roomName);
            toast.error(error.response.data.roomName, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isRoomCodeError) {
            toast.error(error.response.data.roomCode, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isNoteError) {
            toast.error(error.response.data.note, {
              position: toast.POSITION.BOTTOM_RIGHT,
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

function UpdateRoom() {
  const [typeRoom, setTypeRoom] = useState([]);
  const [floor, setFloor] = useState([]);
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [roomImages, setRoomImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [roomUpdate, setRoomUpdate] = useState({
    id: "",
    roomCode: "",
    roomName: "",
    note: "",
    createAt: "",
    floor: {},
    typeRoom: {},
  });

  const MAX_IMAGE_COUNT = 6; // Giới hạn số lượng ảnh tối đa

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imageUrls = [];
    const selectedImagesCopy = [...selectedImages];

    // Convert files object to an array
    const fileList = Array.from(files);

    // Calculate the number of images that can be added without exceeding the limit
    const remainingImageCount = MAX_IMAGE_COUNT - selectedImagesCopy.length;

    // Check if there are already preloaded images
    const preloadedImageCount = roomImages.length;

    // If the total number of images (preloaded + selected) exceeds the limit, show an error
    if (preloadedImageCount + fileList.length > MAX_IMAGE_COUNT) {
      toast.error(`Chỉ được chọn tối đa ${MAX_IMAGE_COUNT} ảnh!`, {
        position: toast.POSITION.BOTTOM_RIGHT,
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
    setRoomImages([...roomImages, ...imageUrls]);
  };

  // Lấy data cho combobox;
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get("http://localhost:2003/api/admin/type-room/getList");
        const response2 = await axios.get("http://localhost:2003/api/admin/floor/getList");
        setTypeRoom(response.data);
        setFloor(response2.data);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchRoomImages() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(`http://localhost:2003/api/admin/room/photo/${id}`);
        console.log("Response data:", response.data);
        const photos = response.data; // Assuming the API response returns a list of photo URLs directly

        setRoomImages(photos); // Set the roomImages state with the array of photo URLs
      } catch (error) {
        console.log("Error fetching room images:", error);
      }
    }
    // Call the fetchRoomImages function inside useEffect
    fetchRoomImages();
  }, [id]);

  //Hàm detail
  useEffect(() => {
    // Định nghĩa hàm fetchData bên trong useEffect
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        // Kiểm tra xem accessToken có tồn tại không
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/room/detail/${id}`);
        console.log("Room", response.data);

        if (response.data) {
          setRoomUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  const handleDeleteImage = async (photoId, index) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Find the photo based on the photoId
      const photoToDelete = roomImages.find((photo) => photo.id === photoId);

      if (photoId && !photoToDelete) {
        console.log("Photo not found in roomImages.");
        return;
      }

      // If the photoId exists, delete the image using the API
      if (photoId) {
        const response = await axios.delete(
          `http://localhost:2003/api/admin/room/delete-photo/${photoId}`
        );

        if (response.status === 200) {
          // If the image is successfully deleted from the server, remove it from the client-side state
          const updatedImages = roomImages.filter((photo) => photo.id !== photoId);
          setRoomImages(updatedImages);
          toast.success("Image deleted successfully!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      } else {
        // If the photoId does not exist, remove the image using the provided index
        const updatedImages = [...roomImages];
        updatedImages.splice(index, 1);
        setRoomImages(updatedImages);
        toast.success("Image deleted successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (error) {
      console.log("Error deleting image:", error);
      toast.error("Error deleting image!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <h1>Cập Nhật Phòng</h1>
      <div className="form-floating mt-5 mb-3">
        <input
          disabled
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="roomCode"
          value={roomUpdate.roomCode}
          onChange={(e) => {
            setRoomUpdate((prev) => ({
              ...prev,
              roomCode: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Mã phòng</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="roomName"
          value={roomUpdate.roomName}
          onChange={(e) => {
            setRoomUpdate((prev) => ({
              ...prev,
              roomName: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tên phòng</label>
      </div>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="note"
          value={roomUpdate.note}
          onChange={(e) => {
            setRoomUpdate((prev) => ({
              ...prev,
              note: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br></br>
      <p>Loại phòng</p>
      <select
        className="form-select"
        aria-label="Default select example"
        name="typeRoom"
        value={roomUpdate.typeRoom.id} // Thiết lập giá trị value cho select
        onChange={(e) => {
          setRoomUpdate((prev) => ({
            ...prev,
            typeRoom: e.target.value, // Cập nhật giá trị typeRoom khi select thay đổi
          }));
        }}
      >
        {typeRoom.map((typeRoom) => (
          <option key={typeRoom.id} value={typeRoom.id}>
            {typeRoom.typeRoomName}
          </option>
        ))}
      </select>
      <br></br>
      <p>Tầng</p>
      <select
        className="form-select"
        aria-label="Default select example"
        name="floor"
        value={roomUpdate.floor.id} // Thiết lập giá trị value cho select
        onChange={(e) => {
          setRoomUpdate((prev) => ({
            ...prev,
            floor: e.target.value, // Cập nhật giá trị floor khi select thay đổi
          }));
        }}
      >
        {floor.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.floorName}
          </option>
        ))}
      </select>
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
        {roomImages.map((photo, index) => (
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
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, id, roomUpdate, selectedImages);
              if (isSubmitSuccess) {
                Swal.fire("Update!", "Your data has been Update.", "success");
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
      <ToastContainer />
    </div>
  );
}
UpdateRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateRoom;