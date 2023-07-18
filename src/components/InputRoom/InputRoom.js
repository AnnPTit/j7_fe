import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./InputRoom.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);

// const handleSubmit = async (event) => {
//   event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
//   // Lấy giá trị từ các trường nhập liệu
//   const roomCodeInput = document.querySelector('input[name="roomCode"]');
//   const roomNameInput = document.querySelector('input[name="roomName"]');
//   const noteInput = document.querySelector('input[name="note"]');

//   const roomCode = roomCodeInput?.value;
//   const roomName = roomNameInput?.value;
//   const note = noteInput?.value;

//   // Tạo payload dữ liệu để gửi đến API
//   const payload = {
//     roomCode,
//     roomName,
//     note,
//   };
//   console.log(payload);

//   try {
//     const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage

//     console.log(accessToken);
//     // Kiểm tra xem accessToken có tồn tại không
//     if (!accessToken) {
//       alert("Bạn chưa đăng nhập");
//       return;
//     }

//     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

//     const response = await axios.post("http://localhost:2003/api/room/save", payload); // Gọi API /api/customers/save với payload và access token
//     console.log(response);

//     if (response.status === 200) {
//       // Xử lý khi API thành công
//       console.log("API call successful");
//       window.location.href = "/room";
//       toast.success("Add Successfully!");
//       // Thực hiện các hành động khác sau khi API thành công
//     } else {
//       // Xử lý khi API gặp lỗi
//       console.log("API call failed");
//       // Thực hiện các hành động khác khi gọi API thất bại
//     }
//   } catch (error) {
//     // Xử lý khi có lỗi xảy ra trong quá trình gọi API
//     if (error.response) {
//       // Xử lý response lỗi
//       if (error.response.status === 403) {
//         alert("Bạn không có quyền truy cập vào trang này");
//         window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
//       } else if (error.response.status === 400) {
//         console.log(error.response);
//         // alert(error.response.data.serviceTypeCode);
//         if (
//           error.response.data.roomCode == undefined &&
//           error.response.data.roomName == undefined
//         ) {
//           toast.error(error.response.data);
//         }
//         toast.error(error.response.data.roomCode, {
//           position: toast.POSITION.BOTTOM_RIGHT,
//         });
//         toast.error(error.response.data.roomName, {
//           position: toast.POSITION.BOTTOM_RIGHT,
//         });
//       } else {
//         alert("Có lỗi xảy ra trong quá trình gọi API");
//       }
//     } else {
//       console.log("Không thể kết nối đến API");
//     }
//   }
// };

const alertSave = () => {
  Swal.fire({
    title: "Are you sure?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, add!",
  }).then((result) => {
    if (result.isConfirmed) {
      createRoom();
      Swal.fire("Added!", "Your data has been added.", "success");
      toast.success("Add Successfully!");
    }
  });
};

function InputRoom() {
  const [floors, setFloors] = useState([]);
  const [typeRooms, setTypeRooms] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [selectedTypeRoomId, setSelectedTypeRoomId] = useState("");

  useEffect(() => {
    // Gọi API để lấy danh sách các tầng
    axios
      .get("http://localhost:2003/api/floor/getList")
      .then((response) => {
        setFloors(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Gọi API để lấy danh sách các loại phòng
    axios
      .get("http://localhost:2003/api/type-room/getList")
      .then((response) => {
        setTypeRooms(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomCode: "",
    roomName: "",
    note: "",
    photos: [],
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const createRoom = async () => {
    const formData = new FormData();
    formData.append("roomCode", newRoom.roomCode);
    formData.append("roomName", newRoom.roomName);
    formData.append("floorId", selectedFloorId); // Thay selectedFloorId bằng giá trị được chọn từ combobox Floor
    formData.append("typeRoomId", selectedTypeRoomId);
    formData.append("note", newRoom.note);
    for (let i = 0; i < newPhotos.length; i++) {
      formData.append("photos", newPhotos[i]);
    }

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage

      console.log(accessToken);
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

      await axios.post("http://localhost:2003/api/room/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // setNewRoom({
      //   roomCode: "",
      //   roomName: "",
      //   note: "",
      //   photos: [],
      // });
      // setNewPhotos([]);
      // setPreviewImages([]);

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/room";
        toast.success("Add Successfully!");
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
          // alert(error.response.data.serviceTypeCode);
          if (
            error.response.data.roomCode == undefined &&
            error.response.data.roomName == undefined
          ) {
            toast.error(error.response.data);
          }
          toast.error(error.response.data.roomCode, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.roomName, {
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

  // const handleInputChange = (event) => {
  //   setNewRoom({ ...newRoom, [event.target.name]: event.target.value });
  // };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const images = Array.from(files);

    setNewPhotos(images);

    const imagePreviews = images.map((image) => URL.createObjectURL(image));
    setPreviewImages(imagePreviews);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("text")}>Room</div>
        <ToastContainer />
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="roomCode" />
              <div className={cx("underline")}></div>
              <label>Room Code</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="roomName" />
              <div className={cx("underline")}></div>
              <label>Room Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div>
              <label>Floor:</label>
              <select value={selectedFloorId} onChange={(e) => setSelectedFloorId(e.target.value)}>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Type Room:</label>
              <select
                value={selectedTypeRoomId}
                onChange={(e) => setSelectedTypeRoomId(e.target.value)}
              >
                {typeRooms.map((typeRoom) => (
                  <option key={typeRoom.id} value={typeRoom.id}>
                    {typeRoom.typeRoomName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data textarea")}>
              <textarea rows="8" cols="80" name="note"></textarea>
              <br />
              <div className={cx("underline")}></div>
              <br />
            </div>
          </div>
          <div className={cx("form-row")}>
            <input type="file" name="photos" multiple onChange={handleFileChange} />
            <div>
              {previewImages &&
                previewImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Photo ${index}`}
                    style={{ width: "150px", height: "auto" }}
                  />
                ))}
            </div>
          </div>
          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={createRoom}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputRoom;
