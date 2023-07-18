import classNames from "classnames/bind";
import style from "./inputService.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

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
      <div className={cx("container")}>
        <div className={cx("text")}>Service </div>
        <form>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="serviceCode" />
              <div className={cx("underline")}></div>
              <label>Service Code</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="serviceName" />
              <div className={cx("underline")}></div>
              <label>Service Name</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <select name="serviceType">
                {serviceType.map((serviceType) => (
                  <option key={serviceType.id} value={serviceType.id}>
                    {serviceType.serviceTypeName}
                  </option>
                ))}
              </select>
              <div className={cx("underline")}></div>
              <label>Service Type</label>
            </div>
            <div className={cx("input-data")}>
              <select name="unit">
                {unit.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
              <div className={cx("underline")}></div>
              <label>Unit</label>
            </div>
          </div>
          <div className={cx("form-row")}>
            <div className={cx("input-data")}>
              <input type="text" required name="price" />
              <div className={cx("underline")}></div>
              <label>Price</label>
            </div>
            <div className={cx("input-data")}>
              <input type="text" required name="description" />
              <div className={cx("underline")}></div>
              <label>Description</label>
            </div>
          </div>

          <div className={cx("form-row submit-btn")}>
            <div className={cx("input-data")}>
              <div className={cx("inner")}>
                <button className={cx("input-btn")} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputService;
