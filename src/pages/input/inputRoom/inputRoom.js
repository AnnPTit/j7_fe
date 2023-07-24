import classNames from "classnames/bind";
import style from "./inputRoom.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const cx = classNames.bind(style);

function InputRoom() {
  const [typeRoom, setTypeRoom] = useState([]);
  const [floor, setFloor] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    // Lấy giá trị từ các trường nhập liệu
    const roomCodeInpt = document.querySelector('input[name="roomCode"]');
    const roomNameInpt = document.querySelector('input[name="roomName"]');
    const noteInpt = document.querySelector('input[name="note"]');
    const floorIput = document.querySelector('select[name="floor"]');
    const typeRoomIput = document.querySelector('select[name="typeRoom"]');
  
    const roomCode = roomCodeInpt?.value;
    const roomName = roomNameInpt?.value;
    const note = noteInpt?.value;
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
      roomCode,
      roomName,
      note,
      floor: floorObj,
      typeRoom: typeRoomObj,
    };
    console.log("payload ", payload);
  
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
  
    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
  
      const response = await axios.post("http://localhost:2003/api/admin/room/save", formData); // Gọi API /api/room-type/save với payload và access token
      toast.success("Add Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(response); //
      console.log("formData: ", formData);
  
      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");
        window.location.href = "/room";
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
          if (
            error.response.data.roomCode == undefined &&
            error.response.data.roomName == undefined &&
            error.response.data.note == undefined
          ) {
            toast.error(error.response.data, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          // toast.error(error.response.data.roomCode, {
          //   position: toast.POSITION.BOTTOM_RIGHT,
          // });
          // toast.error(error.response.data.roomName, {
          //   position: toast.POSITION.BOTTOM_RIGHT,
          // });
        } else {
          alert("Có lỗi xảy ra trong quá trình gọi API");
        }
      } else {
        console.log("Không thể kết nối đến API");
      }
    }
  };

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
        console.log(response.data);
        console.log(response2.data);
        setTypeRoom(response.data);
        setFloor(response2.data);
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const images = Array.from(files);

    setNewPhotos(images);

    const imagePreviews = images.map((image) => URL.createObjectURL(image));
    setPreviewImages(imagePreviews);
  };

  return (
    <div className={cx("wrapper")}>
      <h1>Add Service</h1>
      <div className="form-floating mb-4">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="roomCode"
        />
        <label htmlFor="floatingPassword">Mã phòng</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="roomName"
        />
        <label htmlFor="floatingPassword">Tên phòng</label>
      </div>
      <br></br>
      <select
        className="form-select"
        style={{ height: 60 }}
        aria-label="Default select example"
        name="typeRoom"
      >
        {typeRoom.map((typeRoom) => (
          <option key={typeRoom.id} value={typeRoom.id}>
            {typeRoom.typeRoomName}
          </option>
        ))}
      </select>
      <br></br>
      <select
        className="form-select"
        style={{ height: 60 }}
        aria-label="Default select example"
        name="floor"
      >
        {floor.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.floorName}
          </option>
        ))}
      </select>
      <br></br>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="note"
        ></input>
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br></br>
      <div className="form-floating">
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
      <br></br>
      <button className={(cx("input-btn"), "btn btn-primary")} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

InputRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputRoom;
