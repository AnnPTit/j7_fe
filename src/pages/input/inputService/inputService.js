import classNames from "classnames/bind";
import style from "./inputService.module.scss";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(style);
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn sự kiện submit mặc định
  // Lấy giá trị từ các trường nhập liệu
  const serviceCodeInpt = document.querySelector('input[name="serviceCode"]');
  const serviceNameInpt = document.querySelector('input[name="serviceName"]');
  const descriptionInpt = document.querySelector('input[name="description"]');
  const priceInpt = document.querySelector('input[name="price"]');
  const unitIput = document.querySelector('select[name="unit"]');
  const serviceTypeIput = document.querySelector('select[name="serviceType"]');

  const serviceCode = serviceCodeInpt?.value;
  const serviceName = serviceNameInpt?.value;
  const description = descriptionInpt?.value;
  const price = priceInpt?.value;
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
    serviceCode,
    serviceName,
    description,
    unit: unitObj,
    serviceType: serviceTypeObj,
    price: price,
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

    const response = await axios.post("http://localhost:2003/api/admin/service/save", payload); // Gọi API /api/service-type/save với payload và access token
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
        console.log(error.response.data);

        const isServiceNameError = error.response.data.serviceName === undefined;
        const isServiceCodeError = error.response.data.serviceCode === undefined;
        const isPriceError = error.response.data.price === undefined;

        // Kiểm tra nếu tất cả các trường không bị thiếu, hiển thị thông báo lỗi cho cả 3 trường
        if (!isServiceNameError && !isServiceCodeError && !isPriceError) {
          toast.error(error.response.data.serviceName, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.serviceCode, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          toast.error(error.response.data.price, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          // Nếu có ít nhất một trường bị thiếu, xóa thông báo lỗi cho trường đó nếu có
          // và hiển thị thông báo lỗi cho các trường còn lại
          if (!isServiceNameError) {
            toast.error(error.response.data.serviceName, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isServiceCodeError) {
            toast.error(error.response.data.serviceCode, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
          if (!isPriceError) {
            toast.error(error.response.data.price, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        }
      } else {
        alert("Có lỗi xảy ra trong quá trình gọi API");
      }
    } else {
      console.log("Không thể kết nối đến API");
    }
  }
};

function InputService() {
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);

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
        console.log(response.data);
        console.log(response2.data);
        setServiceType(response.data);
        setUnit(response2.data);
      } catch (error) {
        console.log(error);
      }
    }

    // Gọi hàm fetchData ngay lập tức
    fetchData();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <h1>Add Service</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Default input"
          aria-label="default input example"
          name="serviceCode"
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
        />
        <label htmlFor="floatingPassword">Tên dịch vụ</label>
      </div>
      <br></br>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          name="price"
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
        />
        <label htmlFor="floatingPassword">Mô tả</label>
      </div>
      <br></br>
      <p>Loại Dịch Vụ</p>
      <select className="form-select" aria-label="Default select example" name="serviceType">
        {serviceType.map((serviceType) => (
          <option key={serviceType.id} value={serviceType.id}>
            {serviceType.serviceTypeName}
          </option>
        ))}
      </select>
      <br></br>
      <p>Đơn Vị Tính </p>
      <select className="form-select" aria-label="Default select example" name="unit">
        {unit.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.unitName}
          </option>
        ))}
      </select>
      <br></br>
      <button className={(cx("input-btn"), "btn btn-primary")} onClick={handleSubmit}>
        Update
      </button>
      <ToastContainer />
    </div>
  );
}
InputService.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputService;
