import classNames from "classnames/bind";
import style from "./inputService.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import CurrencyInput from "react-currency-input-field";
import "bootstrap/dist/css/bootstrap.min.css";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { SvgIcon } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputServiceTypeModal from "src/components/inputServiceType/inputServiceTypeModal";
import InputUnitModal from "src/components/inputUnit/inputUnitModal";

const cx = classNames.bind(style);
const handleSubmit = async (code, price1) => {
  // Lấy giá trị từ các trường nhập liệu
  const serviceCodeInpt = document.querySelector('input[name="serviceCode"]');
  const serviceNameInpt = document.querySelector('input[name="serviceName"]');
  const descriptionInpt = document.querySelector('input[name="description"]');
  // const priceInpt = document.querySelector('input[name="price"]');

  const unitIput = document.querySelector('select[name="unit"]');
  const serviceTypeIput = document.querySelector('select[name="serviceType"]');

  const serviceCode = serviceCodeInpt?.value;
  const serviceName = serviceNameInpt?.value;
  const description = descriptionInpt?.value;
  const price = price1;
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
    price,
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
    toast.success("Thêm Thành Công !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(response); //

    if (response.status === 200) {
      // Xử lý khi API thành công
      console.log("API call successful");
      window.location.href = `/input/inputCombo/inputCombo?code=CB_${code}`;
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
        inputUnitModal;
        alert("Có lỗi xảy ra trong quá trình gọi API");
      }
    } else {
      console.log("Không thể kết nối đến API");
    }
  }
};

function InputService({ code }) {
  const [serviceType, setServiceType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [price, setPrice] = useState(0);
  const [showServiceType, setShowServiceType] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  const handleCloseServiceType = () => setShowServiceType(false);
  const handleShowServiceType = () => setShowServiceType(true);

  const handleShowUnit = () => setShowUnit(true);
  const handleCloseUnit = () => setShowUnit(false);
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
      <h1>Thêm Dịch Vụ</h1>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          value={code}
          disabled
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

      <div
        style={{
          display: "flex",
        }}
      >
        <select className="form-select" aria-label="Default select example" name="serviceType">
          {serviceType.map((serviceType) => (
            <option key={serviceType.id} value={serviceType.id}>
              {serviceType.serviceTypeName}
            </option>
          ))}
        </select>
        <Button style={{ marginRight: 20 }} variant="primary" onClick={handleShowServiceType}>
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        </Button>
        <Modal
          style={{ marginTop: 50 }}
          show={showServiceType}
          onHide={handleCloseServiceType}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Loại Dịch Vụ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputServiceTypeModal code={code} />
          </Modal.Body>
        </Modal>
      </div>
      <br></br>
      <p>Đơn Vị Tính </p>
      <div style={{ display: "flex" }}>
        <select className="form-select" aria-label="Default select example" name="unit">
          {unit.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.unitName}
            </option>
          ))}
        </select>
        <Button style={{ marginRight: 20 }} variant="primary" onClick={handleShowUnit}>
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        </Button>
        <Modal
          style={{ marginTop: 50 }}
          show={showUnit}
          onHide={handleCloseUnit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Đơn Vị</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputUnitModal code={code} />
          </Modal.Body>
        </Modal>
      </div>
      <br></br>
      <p
        style={{
          marginLeft: 10,
        }}
      >
        Đơn giá
      </p>
      <CurrencyInput
        className="form-control"
        id="input-example"
        name="price"
        placeholder="Please enter a number"
        defaultValue={0}
        decimalsLimit={2}
        value={price}
        onValueChange={(value) => setPrice(value)}
      />

      <br />
      <button
        className={(cx("input-btn"), "btn btn-primary")}
        onClick={() => {
          Swal.fire({
            title: "Bạn có chắc chắn muốn thêm ? ",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const isSubmitSuccess = await handleSubmit(event, price);
              if (isSubmitSuccess) {
                Swal.fire("Thêm thành công !", "success");
                toast.success("Thêm Thành Công !");
              }
            }
          });
        }}
      >
        Thêm mới
      </button>
      <ToastContainer />
    </div>
  );
}
InputService.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default InputService;
