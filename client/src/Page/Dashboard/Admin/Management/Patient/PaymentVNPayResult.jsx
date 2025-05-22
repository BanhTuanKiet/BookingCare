import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Phone, Mail } from 'lucide-react';

// Giả lập axios config - thay thế bằng import thực tế của bạn
const axios = {
  get: async (url) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockResponses = ['success', 'fail', 'expired'];
    return { data: mockResponses[Math.floor(Math.random() * mockResponses.length)] };
  }
};

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

  // VNPay Logo Component
  const VNPayLogo = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 transform rotate-45 mr-2"></div>
        <div className="text-blue-600 font-bold text-xl">
          <span className="text-red-500">V</span>NPAY
        </div>
      </div>
    </div>
  );

  // Language selector
  const LanguageSelector = () => (
    <div className="absolute top-4 right-4 flex items-center space-x-1 text-sm text-gray-600">
      <div className="w-5 h-3 bg-red-500 relative">
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-500"></div>
        </div>
      </div>
      <span>En</span>
    </div>
  );

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
        <LanguageSelector />
        <div className="bg-white rounded-lg shadow-sm border max-w-md w-full p-8 text-center">
          <VNPayLogo />
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">Đang xử lý giao dịch</h2>
          <p className="text-gray-600 text-sm">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
        <LanguageSelector />
        <div className="bg-white rounded-lg shadow-sm border max-w-md w-full">
          <div className="p-8 text-center">
            <VNPayLogo />
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-medium text-red-600 mb-2">Thành công</h2>
            <p className="text-gray-700 text-sm mb-8">Đơn hàng đã được xử lý thành công</p>

            {/* Transaction Details */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã tra cứu </span>
                <span className="font-medium text-gray-800">
                  {Math.random().toString(36).substr(2, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Thời gian giao dịch </span>
                <span className="font-medium text-gray-800">
                  {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')} CH
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-lg">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">1900.5555.77</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">hotrovnpay@vnpay.vn</span>
              </div>
            </div>
            
            {/* Security badges */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                Secure
              </div>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                SSL
              </div>
            </div>

            <p className="text-center text-xs text-gray-500">
              Phát triển bởi VNPAY © 2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failure state
  if (status === "fail" || status === "fail_fetch") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
        <LanguageSelector />
        <div className="bg-white rounded-lg shadow-sm border max-w-md w-full">
          <div className="p-8 text-center">
            <VNPayLogo />
            
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-medium text-red-600 mb-2">Thông báo</h2>
            <p className="text-gray-700 text-sm mb-8">
              {status === "fail" 
                ? "Đơn hàng không tồn tại hoặc đã được xử lý" 
                : "Không thể kết nối đến máy chủ"
              }
            </p>

            {/* Transaction Details */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã tra cứu </span>
                <span className="font-medium text-gray-800">
                  {Math.random().toString(36).substr(2, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Thời gian giao dịch </span>
                <span className="font-medium text-gray-800">
                  {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')} CH
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-lg">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">1900.5555.77</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">hotrovnpay@vnpay.vn</span>
              </div>
            </div>
            
            {/* Security badges */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                Secure
              </div>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                SSL
              </div>
            </div>

            <p className="text-center text-xs text-gray-500">
              Phát triển bởi VNPAY © 2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Unknown status
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <LanguageSelector />
      <div className="bg-white rounded-lg shadow-sm border max-w-md w-full">
        <div className="p-8 text-center">
          <VNPayLogo />
          
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-medium text-red-600 mb-2">Thông báo</h2>
          <p className="text-gray-700 text-sm mb-4">Kết quả không xác định </p>
          <p className="text-xs text-gray-500 mb-8">Trạng thái: {status}</p>

          {/* Transaction Details */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mã tra cứu </span>
              <span className="font-medium text-gray-800">
                {Math.random().toString(36).substr(2, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Thời gian giao dịch </span>
              <span className="font-medium text-gray-800">
                {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')} CH
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-lg">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">1900.5555.77</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">hotrovnpay@vnpay.vn</span>
            </div>
          </div>
          
          {/* Security badges */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              Secure
            </div>
            <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              SSL
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            Phát triển bởi VNPAY © 2025
          </p>
        </div>
      </div>
    </div>
    );
};

export default PaymentVNPayResult;