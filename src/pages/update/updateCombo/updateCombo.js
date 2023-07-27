import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import style from "./updateCombo.module.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const cx = classNames.bind(style);

const handleSubmit = async (event, id, comboUpdate, selectedServiceCodes) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Tạo payload dữ liệu để gửi đến API
  const payload = {
    ...comboUpdate,
    id: id,
    comboCode: comboUpdate.comboCode,
    comboName: comboUpdate.comboName,
    note: comboUpdate.note,
  };
  console.log("Payload ", payload);
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    // Kiểm tra xem accessToken có tồn tại không
    if (!accessToken) {
      alert("Bạn chưa đăng nhập");
      return false;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
    const response = await axios.put(`http://localhost:2003/api/admin/combo/update/${id}`, payload); // Gọi API /api/combo/save với payload và access token 
    toast.success("Update Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = "/combo";
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
        console.log(error.response);
        // alert(error.response.data.comboCode);
        toast.error(error.response.data.comboName, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        toast.error(error.response.data.comboCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
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

function Updatecombo() {
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [selectedServiceCodes, setSelectedServiceCodes] = useState([]);
  const [dataService, setDataService] = useState([]);

  const [comboUpdate, setcomboUpdate] = useState({
    comboCode: "",
    comboName: "",
    note: "",
    price: 0,
    comboServiceList: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
        const response = await axios.get(`http://localhost:2003/api/admin/service/getAll`); // Thay đổi URL API của bạn tại đây
        setDataService(response.data);
      } catch (error) {
        if (error.response) {
          // Xử lý response lỗi
          if (error.response.status === 403) {
            alert("Bạn không có quyền truy cập vào trang này");
            window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
          } else {
            alert("Có lỗi xảy ra trong quá trình gọi API");
          }
        } else {
          console.log("Không thể kết nối đến API");
        }
      }
    };
    fetchData();
  }, []);
  const handleChange = (idService) => {
    setSelectedServiceCodes((prev) => {
      const isChecked = selectedServiceCodes.includes(idService);
      if (isChecked) {
        const fetchData = async () => {
          try {
            const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
            const response = await axios.delete(
              `http://localhost:2003/api/admin/combo-service/delete/combo-service?combo-id=${id}&service-id=${idService}`
            ); // Thay đổi URL API của bạn tại đây
          } catch (error) {
            if (error.response) {
              // Xử lý response lỗi
              if (error.response.status === 403) {
                alert("Bạn không có quyền truy cập vào trang này");
                window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
              } else {
                alert("Có lỗi xảy ra trong quá trình gọi API");
              }
            } else {
              console.log("Không thể kết nối đến API");
            }
          }
        };
        fetchData();
        return selectedServiceCodes.filter((item) => item !== idService);
      } else {
        const fetchData = async () => {
          try {
            const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
            const response = await axios.post(
              `http://localhost:2003/api/admin/combo-service/save/combo-service?combo-id=${id}&service-id=${idService}`
            ); // Thay đổi URL API của bạn tại đây
          } catch (error) {
            if (error.response) {
              // Xử lý response lỗi
              if (error.response.status === 403) {
                alert("Bạn không có quyền truy cập vào trang này");
                window.location.href = "/auth/login"; // Thay đổi "/dang-nhap" bằng đường dẫn đến trang đăng nhập của bạn
              } else {
                alert("Có lỗi xảy ra trong quá trình gọi API");
              }
            } else {
              console.log("Không thể kết nối đến API");
            }
          }
        };
        fetchData();
        return [...prev, idService];
      }
    });
  };
  // Hàm detail
  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("Bạn chưa đăng nhập");
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await axios.get(`http://localhost:2003/api/admin/combo/detail/${id}`);
        console.log("Combo", response.data);
        setcomboUpdate(response.data);
        // Khởi tạo một mảng tạm để kiểm tra trùng lặp
        const tempSelectedServiceCodes = [];

        // Duyệt qua mảng comboServiceList và gọi setSelectedServiceCodes() cho từng phần tử trong mảng
        response.data.comboServiceList.forEach((service) => {
          const serviceCode = service.service.id; // Thay yourServiceCodeProperty bằng thuộc tính chứa mã dịch vụ của bạn trong đối tượng service

          // Kiểm tra xem phần tử đã tồn tại trong mảng tạm hay chưa
          if (!tempSelectedServiceCodes.includes(serviceCode)) {
            tempSelectedServiceCodes.push(serviceCode);
          }
        });

        // Đã loại bỏ các phần tử trùng lặp, gán mảng tạm vào SelectedServiceCodes
        setSelectedServiceCodes(tempSelectedServiceCodes);
      } catch (error) {
        console.log(error);
      }
    }
    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h1>Cập nhật Loại Dịch Vụ</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="comboCode"
          value={comboUpdate.comboCode}
          onChange={(e) => {
            setcomboUpdate((prev) => ({
              ...prev,
              comboCode: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingInput">Mã loại dịch vụ</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="comboName"
          value={comboUpdate.comboName}
          onChange={(e) => {
            setcomboUpdate((prev) => ({
              ...prev,
              comboName: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tên loại dịch vụ</label>
      </div>
      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="note"
          value={comboUpdate.note}
          onChange={(e) => {
            setcomboUpdate((prev) => ({
              ...prev,
              note: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Ghi Chú</label>
      </div>

      <br />
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="price"
          value={comboUpdate.price}
          onChange={(e) => {
            setcomboUpdate((prev) => ({
              ...prev,
              price: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Đơn giá</label>
      </div>
      <br />
      <p
        style={{
          marginLeft: 10,
        }}
      >
        Dịch vụ
      </p>
      <FormGroup>
        {dataService.map((service) => (
          <FormControlLabel
            key={service.id}
            control={
              <Checkbox
                checked={selectedServiceCodes.includes(service.id)}
                onChange={() => handleChange(service.id)}
                name={service.id}
              />
            }
            label={service.serviceName}
          />
        ))}
      </FormGroup>
      <br />
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(
                event,
                id,
                comboUpdate,
                selectedServiceCodes
              );
              if (isSubmitSuccess) {
                Swal.fire("Update!", "Your data has been Update.", "success");
              }
            }
          });
        }}
      >
        Cập nhật
      </button>
      <ToastContainer />
    </div>
  );
}

Updatecombo.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Updatecombo;
