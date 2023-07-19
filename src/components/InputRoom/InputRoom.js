import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./InputRoom.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(style);

function InputRoom() {
  const [floors, setFloors] = useState([]);
  const [typeRooms, setTypeRooms] = useState([]);
  // const [selectedFloorId, setSelectedFloorId] = useState("");
  // const [selectedTypeRoomId, setSelectedTypeRoomId] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2003/api/floor/getList")
      .then((response) => {
        setFloors(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const roomCodeInput = document.querySelector('input[name="roomCode"]');
    const roomNameInput = document.querySelector('input[name="roomName"]');
    const noteTextarea = document.querySelector('textarea[name="note"]');
    const floorInput = document.querySelector('select[name="floor"]');
    const typeRoomInput = document.querySelector('select[name="typeRoom"]');

    const roomCode = roomCodeInput?.value;
    const roomName = roomNameInput?.value;
    const note = noteTextarea?.value;
    const floor = floorInput?.value;
    const typeRoom = typeRoomInput?.value;

    let floorObj = {
      id: floor,
    };

    let typeRoomObj = {
      id: typeRoom,
    };

    // Tạo payload dữ liệu để gửi đến API
    // const payload = {
    //   roomCode,
    //   roomName,
    //   note,
    //   floor: floorObj,
    //   typeRoom: typeRoomObj,
    // };
    // console.log("payload ", payload);
    const formData = new FormData(); // Create a new FormData object

    formData.append("roomCode", roomCode);
    formData.append("roomName", roomName);
    formData.append("note", note);
    formData.append("floor", floorObj.id);
    formData.append("typeRoom", typeRoomObj.id);

    // Append each file to the FormData object
    for (let i = 0; i < newPhotos.length; i++) {
      formData.append("photos", newPhotos[i]);
    }

    console.log("formData: ", formData);

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
      axios.defaults.headers.post["Content-Type"] = "multipart/form-data"; // Set the content type to 'multipart/form-data'

      const response = await axios.post("http://localhost:2003/api/room/save", formData); // Gọi API /api/room-type/save với payload và access token
      toast.success("Add Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(response); //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        // window.location.href = "/room";
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

          if (error.response.data.price == undefined && error.response.data.roomName == undefined) {
            toast.error(error.response.data);
          }
          toast.error(error.response.data.price, {
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
              <select name="floor">
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Type Room:</label>
              <select name="typeRoom">
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
                <button className={cx("input-btn")} onClick={handleSubmit}>
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
