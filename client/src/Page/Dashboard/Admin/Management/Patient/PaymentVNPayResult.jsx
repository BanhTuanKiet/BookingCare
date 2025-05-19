import { useEffect, useState } from 'react'
import axios from '../../../../../Util/AxiosConfig'

const PaymentVNPayResult = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
  const fetchResult = async () => {
    try {
      // Lấy query hiện tại từ URL
      const query = window.location.search;

      const res = await axios.get(`/medicalrecords/callback${query}`);
      const text = res.data; // axios trả về .data

      setStatus(text);
    } catch (error) {
      setStatus("fail_fetch");
      console.error("Lỗi khi gọi callback:", error);
    }
  };

  fetchResult();
}, []);


  if (status === "loading") return <p>Đang xử lý thanh toán...</p>;

  if (status === "success") {
    return (
      <div>
        <h2>✅ Thanh toán thành công</h2>
        <p>Cảm ơn bạn đã sử dụng dịch vụ!</p>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div>
        <h2>❌ Thanh toán thất bại</h2>
        <p>Không tìm thấy lịch hẹn tương ứng.</p>
      </div>
    );
  }

  return <p>⚠️ Kết quả không xác định: {status}</p>;
};

export default PaymentVNPayResult;
