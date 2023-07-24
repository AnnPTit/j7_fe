import classNames from "classnames/bind";
import style from "./updateService.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter từ Next.js
import "bootstrap/dist/css/bootstrap.min.css";

const cx = classNames.bind(style);

function UpdateService() {
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);
  const router = useRouter(); // Sử dụng useRouter để truy cập router của Next.js
  const { id } = router.query; // Lấy thông tin từ URL qua router.query
  const [serviceUpdate, setServiceUpdate] = useState({
    id: "",
    serviceCode: "",
    serviceName: "",
    description: "",
    unit: {},
    serviceType: {},
    price: "",
    createAt: "",
  });
  // const [serviceName, setServiceName] = useState("");
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
        const response = await axios.get("http://localhost:2003/api/admin/service-type/getAll");
        const response2 = await axios.get("http://localhost:2003/api/admin/unit/getAll");
        setServiceType(response.data);
        setUnit(response2.data);
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

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
        const response = await axios.get(`http://localhost:2003/api/admin/service/detail/${id}`);
        console.log("Service", response.data);

        if (response.data) {
          setServiceUpdate(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
    const unitIput = document.querySelector('select[name="unit"]');
    const serviceTypeIput = document.querySelector('select[name="serviceType"]');
    const unit = unitIput?.value;
    const serviceType = serviceTypeIput?.value;

    let unitObj = {
      id: unit,
    };

    let serviceTypeObj = {
      id: serviceType,
    };

    // Tạo payload dữ liệu để gửi đến API
    const payload = {
      id: id,
      serviceCode: serviceUpdate.serviceCode,
      serviceName: serviceUpdate.serviceName,
      description: serviceUpdate.description,
      unit: unitObj,
      serviceType: serviceTypeObj,
      price: serviceUpdate.price,
      createAt: serviceUpdate.createAt,
    };
    console.log("payload ", payload);

    try {
      const accessToken = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
      // Kiểm tra xem accessToken có tồn tại không
      if (!accessToken) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Thêm access token vào tiêu đề "Authorization"
      const response = await axios.put(
        `http://localhost:2003/api/admin/service/update/${id}`,
        payload
      ); // Gọi API /api/service-type/save với payload và access token
      toast.success("Add Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(response); //

      if (response.status === 200) {
        // Xử lý khi API thành công
        console.log("API call successful");

        window.location.href = "/service";
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
            error.response.data.price == undefined &&
            error.response.data.serviceName == undefined
          ) {
            toast.error(error.response.data);
          }
          toast.error(error.response.data.price, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.serviceName, {
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

  return (
    <div className={cx("wrapper")}>
      <h1>Update Service</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="serviceCode"
          value={serviceUpdate.serviceCode}
          onChange={(e) => {
            setServiceUpdate((prev) => ({
              ...prev,
              serviceCode: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Mã dịch vụ</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="serviceName"
          value={serviceUpdate.serviceName}
          onChange={(e) => {
            setServiceUpdate((prev) => ({
              ...prev,
              serviceName: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Tên dịch vụ</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="number"
          placeholder="Default input"
          aria-label="default input example"
          name="price"
          value={serviceUpdate.price}
          onChange={(e) => {
            setServiceUpdate((prev) => ({
              ...prev,
              price: e.target.value,
            }));
          }}
        />

        <label htmlFor="floatingInput">Đơn giá </label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="description"
          value={serviceUpdate.description}
          onChange={(e) => {
            setServiceUpdate((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br></br>
      <p>Loại Dịch Vụ</p>
      <select
        className="form-select"
        aria-label="Default select example"
        name="serviceType"
        value={serviceUpdate.serviceType.id} // Thiết lập giá trị value cho select
        onChange={(e) => {
          setServiceUpdate((prev) => ({
            ...prev,
            serviceType: e.target.value, // Cập nhật giá trị serviceType khi select thay đổi
          }));
        }}
      >
        {serviceType.map((serviceType) => (
          <option key={serviceType.id} value={serviceType.id}>
            {serviceType.serviceTypeName}
          </option>
        ))}
      </select>

      <br></br>
      <p>Đơn Vị Tính</p>
      <select
        className="form-select"
        aria-label="Default select example"
        name="unit"
        value={serviceUpdate.unit.id} // Thiết lập giá trị value cho select
        onChange={(e) => {
          setServiceUpdate((prev) => ({
            ...prev,
            unit: e.target.value, // Cập nhật giá trị unit khi select thay đổi
          }));
        }}
      >
        {unit.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.unitName}
          </option>
        ))}
      </select>

      <br></br>
      <button className={(cx("input-btn"), "btn btn-primary")} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
UpdateService.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateService;
