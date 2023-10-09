// import React, { useEffect, useState } from "react";
// // import classNames from "classnames/bind";
// // import style from "./InputRoom.module.scss";
// // import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
// // import axios from "axios";
// // import Swal from "sweetalert2";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const cx = classNames.bind(style);
// function InputRoom() {
// const [floors, setFloors] = useState([]);
// const [typeRooms, setTypeRooms] = useState([]);
// // const [selectedFloorId, setSelectedFloorId] = useState("");
// // const [selectedTypeRoomId, setSelectedTypeRoomId] = useState("");
// const [newPhotos, setNewPhotos] = useState([]);
// const [previewImages, setPreviewImages] = useState([]);

// //   useEffect(() => {
// //     axios
// //       .get("http://localhost:2003/api/admin/floor/getList")
// //       .then((response) => {
// //         setFloors(response.data);
// //         console.log(response.data);
// //       })
// //       .catch((error) => {
// //         console.log(error);
// //       });

// //     axios
// //       .get("http://localhost:2003/api/admin/type-room/getList")
// //       .then((response) => {
// //         setTypeRooms(response.data);
// //         console.log(response.data);
// //       })
// //       .catch((error) => {
// //         console.log(error);
// //       });
// //   }, []);

// //   const handleSubmit = async (event) => {
// //     event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
// //     // Lấy giá trị từ các trường nhập liệu
// //     const roomCodeInput = document.querySelector('input[name="roomCode"]');
// //     const roomNameInput = document.querySelector('input[name="roomName"]');
// //     const noteTextarea = document.querySelector('textarea[name="note"]');
// //     const floorInput = document.querySelector('select[name="floor"]');
// //     const typeRoomInput = document.querySelector('select[name="typeRoom"]');

// //     const roomCode = roomCodeInput?.value;
// //     const roomName = roomNameInput?.value;
// //     const note = noteTextarea?.value;
// //     const floor = floorInput?.value;
// //     const typeRoom = typeRoomInput?.value;

// //     let floorObj = {
// //       id: floor,
// //     };

// //     let typeRoomObj = {
// //       id: typeRoom,
// //     };

// //     // Tạo payload dữ liệu để gửi đến API
// //     // const payload = {
// //     //   roomCode,
// //     //   roomName,
// //     //   note,
// //     //   floor: floorObj,
// //     //   typeRoom: typeRoomObj,
// //     // };
// // console.log("payload ", payload);
// const formData = new FormData(); // Create a new FormData object

// formData.append("roomCode", roomCode);
// formData.append("roomName", roomName);
// formData.append("note", note);
// formData.append("floor", floorObj.id);
// formData.append("typeRoom", typeRoomObj.id);

// // Append each file to the FormData object
// for (let i = 0; i < newPhotos.length; i++) {
//   formData.append("photos", newPhotos[i]);
// }

// try {
//   const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
//   // Kiểm tra xem accessToken có tồn tại không
//   if (!accessToken) {
//     alert("Bạn chưa đăng nhập");
//   }

//   axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
//   axios.defaults.headers.post["Content-Type"] = undefined;

//   // const response = await axios.post("http://localhost:2003/api/admin/room/save", formData, {
//   //   headers: { "Content-Type": undefined },
//   // }); // Gọi API /api/room-type/save với payload và access token
//   toast.success("Add Successfully!", {
//     position: toast.POSITION.BOTTOM_RIGHT,
//   });
//   console.log(response); //
//   console.log("formData: ", formData);

//   if (response.status === 200) {
//     // Xử lý khi API thành công
//     console.log("API call successful");
//     // window.location.href = "/room";
//     // Thực hiện các hành động khác sau khi API thành công
//   } else {
//     // Xử lý khi API gặp lỗi
//     console.log("API call failed");
//     // Thực hiện các hành động khác khi gọi API thất bại
//   }
// } catch (error) {
//   // Xử lý khi có lỗi xảy ra trong quá trình gọi API
//   if (error.response) {
//     // Xử lý response lỗi
//     if (error.response.status === 403) {
//       alert("Bạn không có quyền truy cập vào trang này");
//       window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
//     } else if (error.response.status === 400) {
//       console.log(error.response);

//       if (
//         error.response.data.roomCode == undefined &&
//         error.response.data.roomName == undefined &&
//         error.response.data.note == undefined
//       ) {
//         toast.error(error.response.data, {
//           position: toast.POSITION.BOTTOM_RIGHT,
//         });
//       }
//       // toast.error(error.response.data.roomCode, {
//       //   position: toast.POSITION.BOTTOM_RIGHT,
//       // });
//       // toast.error(error.response.data.roomName, {
//       //   position: toast.POSITION.BOTTOM_RIGHT,
//       // });
//     } else {
//       alert("Có lỗi xảy ra trong quá trình gọi API");
//     }
//   } else {
//     console.log("Không thể kết nối đến API");
//   }
// }
// };

// const handleFileChange = (event) => {
//   const files = event.target.files;
//   const images = Array.from(files);

//   setNewPhotos(images);

//   const imagePreviews = images.map((image) => URL.createObjectURL(image));
//   setPreviewImages(imagePreviews);
// };

// //   return (
// //     <div className={cx("wrapper")}>
// //       <div className={cx("container")}>
// //         <div className={cx("text")}>Room</div>
// //         <ToastContainer />
// //         <form encType="multipart/form-data">
// //           <div className={cx("form-row")}>
// //             <div className={cx("input-data")}>
// //               <input type="text" required name="roomCode" />
// //               <div className={cx("underline")}></div>
// //               <label>Room Code</label>
// //             </div>
// //             <div className={cx("input-data")}>
// //               <input type="text" required name="roomName" />
// //               <div className={cx("underline")}></div>
// //               <label>Room Name</label>
// //             </div>
// //           </div>
// //           <div className={cx("form-row")}>
// //             <div>
// //               <label>Floor:</label>
// //               <select name="floor">
// //                 {floors.map((floor) => (
// //                   <option key={floor.id} value={floor.id}>
// //                     {floor.floorName}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label>Type Room:</label>
// //               <select name="typeRoom">
// //                 {typeRooms.map((typeRoom) => (
// //                   <option key={typeRoom.id} value={typeRoom.id}>
// //                     {typeRoom.typeRoomName}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //           <div className={cx("form-row")}>
// //             <div className={cx("input-data textarea")}>
// //               <textarea rows="8" cols="80" name="note"></textarea>
// //               <br />
// //               <div className={cx("underline")}></div>
// //               <br />
// //             </div>
// //           </div>
// //           <div className={cx("form-row")}>
// //             <input type="file" name="photos" multiple onChange={handleFileChange} />
// //             <div>
// //               {previewImages &&
// //                 previewImages.map((image, index) => (
// //                   <img
// //                     key={index}
// //                     src={image}
// //                     alt={`Photo ${index}`}
// //                     style={{ width: "150px", height: "auto" }}
// //                   />
// //                 ))}
// //             </div>
// //           </div>
// //           <div className={cx("form-row submit-btn")}>
// //             <div className={cx("input-data")}>
// //               <div className={cx("inner")}>
// //                 <button className={cx("input-btn")} onClick={handleSubmit}>
// //                   Save
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }
// // InputRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// // export default InputRoom;

// import classNames from "classnames/bind";
// import style from "./InputRoom.module.scss";
// import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";

// const cx = classNames.bind(style);
// const handleSubmit = async (event) => {
//   event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
//   // Lấy giá trị từ các trường nhập liệu
//   const roomCodeInpt = document.querySelector('input[name="roomCode"]');
//   const roomNameInpt = document.querySelector('input[name="roomName"]');
//   const noteInpt = document.querySelector('input[name="note"]');
//   const floorIput = document.querySelector('select[name="floor"]');
//   const typeRoomIput = document.querySelector('select[name="typeRoom"]');

//   const roomCode = roomCodeInpt?.value;
//   const roomName = roomNameInpt?.value;
//   const note = noteInpt?.value;
//   const floor = floorIput?.value;
//   const typeRoom = typeRoomIput?.value;

//   let floorObj = {
//     id: floor,
//   };

//   let typeRoomObj = {
//     id: typeRoom,
//   };

//   // Tạo payload dữ liệu để gửi đến API
//   const payload = {
//     roomCode,
//     roomName,
//     note,
//     floor: floorObj,
//     typeRoom: typeRoomObj,
//   };
//   console.log("payload ", payload);

//   try {
//     const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
//     // Kiểm tra xem accessToken có tồn tại không
//     if (!accessToken) {
//       alert("Bạn chưa đăng nhập");
//       return;
//     }

//     axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"

//     const response = await axios.post("http://localhost:2003/api/admin/room/save", payload); // Gọi API /api/room-type/save với payload và access token
//     toast.success("Add Successfully!", {
//       position: toast.POSITION.BOTTOM_RIGHT,
//     });
//     console.log(response); //

//     if (response.status === 200) {
//       // Xử lý khi API thành công
//       console.log("API call successful");

//       window.location.href = "/room";
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
//         if (
//           error.response.data.roomCode == undefined &&
//           error.response.data.roomName == undefined &&
//           error.response.data.note == undefined
//         ) {
//           toast.error(error.response.data, {
//             position: toast.POSITION.BOTTOM_RIGHT,
//           });
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

// function InputRoom() {
//   const [typeRoom, setTypeRoom] = useState([]);
//   const [floor, setFloor] = useState([]);

//   useEffect(() => {
//     // Định nghĩa hàm fetchData bên trong useEffect
//     async function fetchData() {
//       try {
//         const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
//         // Kiểm tra xem accessToken có tồn tại không
//         if (!accessToken) {
//           alert("Bạn chưa đăng nhập");
//           return;
//         }
//         axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
//         const response = await axios.get("http://localhost:2003/api/admin/type-room/getAll");
//         const response2 = await axios.get("http://localhost:2003/api/admin/floor/getAll");
//         console.log(response.data);
//         console.log(response2.data);
//         setTypeRoom(response.data);
//         setFloor(response2.data);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     // Gọi hàm fetchData ngay lập tức
//     fetchData();
//   }, []);

//   return (
//     <div className={cx("wrapper")}>
//       <h1>Add room</h1>
//       <div className="form-floating mb-3">
//         <input type="email" className="form-control" id="floatingInput" name="roomCode" />
//         <label htmlFor="floatingInput">Mã phòng</label>
//       </div>
//       <div className="form-floating">
//         <input
//           type="text"
//           className="form-control"
//           id="floatingPassword"
//           placeholder="Password"
//           name="roomName"
//         />
//         <label htmlFor="floatingPassword">Tên phòng</label>
//       </div>
//       <br></br>
//       <div className="form-floating mb-3">
//         <input type="email" className="form-control" id="floatingInput" name="price" />
//         <label htmlFor="floatingInput">Mô tả</label>
//       </div>
//       <div className="form-floating">
//         <input
//           type="text"
//           className="form-control"
//           id="floatingPassword"
//           placeholder="Password"
//           name="note"
//         />
//         <label htmlFor="floatingPassword">Mô tả</label>
//       </div>
//       <br></br>
//       <select className="form-select" aria-label="Default select example" name="typeRoom">
//         {typeRoom.map((typeRoom) => (
//           <option key={typeRoom.id} value={typeRoom.id}>
//             {typeRoom.typeRoomName}
//           </option>
//         ))}
//       </select>
//       <br></br>
//       <select className="form-select" aria-label="Default select example" name="floor">
//         {floor.map((floor) => (
//           <option key={floor.id} value={floor.id}>
//             {floor.floorName}
//           </option>
//         ))}
//       </select>
//       <br></br>
//       <button className={(cx("input-btn"), "btn btn-primary")} onClick={handleSubmit}>
//         Submit
//       </button>
//     </div>
//   );
// }
// InputRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default InputRoom;
