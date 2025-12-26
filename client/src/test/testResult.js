import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";
import * as XLSX from "xlsx";

const testUsers = [
  { label: "Thành công", email: "datteo192004@gmail.com", password: "Dat@1912", expected: true },
  { label: "Sai mật khẩu", email: "datteo192004@gmail.com", password: "wrong", expected: false },
  { label: "Email không tồn tại", email: "none@gmail.com", password: "123", expected: false },
  { label: "Để trống email", email: "", password: "123", expected: false }
];

async function testLogin() {
  let driver = await new Builder().forBrowser("chrome").build();
  let testResults = []; // Mảng lưu kết quả

  try {
    await driver.manage().window().maximize();

    for (const user of testUsers) {
      let result = { 
        Case: user.label, 
        Email: user.email, 
        Status: "FAIL", 
        Note: "" 
      };

      try {
        await driver.get(encodeURI("http://localhost:3000/Đăng nhập"));
        await driver.wait(until.elementLocated(By.name("email")), 5000);

        await driver.findElement(By.name("email")).sendKeys(user.email);
        await driver.findElement(By.name("password")).sendKeys(user.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.sleep(2000); // Chờ React xử lý

        if (user.expected) {
          // Case mong đợi thành công
          await driver.get(encodeURI("http://localhost:3000/thông tin cá nhân"));
          await driver.wait(until.elementLocated(By.css('[data-testid="logout-btn"]')), 5000);
          
          result.Status = "PASS";
          result.Note = "Đăng nhập và chuyển trang thành công";
          
          // Logout để reset trạng thái
          await driver.findElement(By.css('[data-testid="logout-btn"]')).click();
        } else {
          // Case mong đợi thất bại
          let currentUrl = await driver.getCurrentUrl();
          if (currentUrl.includes(encodeURI("Đăng nhập"))) {
            result.Status = "PASS";
            result.Note = "Hệ thống chặn đăng nhập đúng như mong đợi";
          } else {
            result.Note = "Lỗi: Đáng lẽ phải chặn nhưng lại cho đăng nhập";
          }
        }
      } catch (e) {
        result.Note = "Lỗi kỹ thuật: " + e.message;
      }

      testResults.push(result);
      console.log(`Kết quả ${user.label}: ${result.Status}`);
    }

    // --- XUẤT FILE SAU KHI CHẠY XONG ---
    
    // 1. Xuất ra file JSON
    fs.writeFileSync("test_report.json", JSON.stringify(testResults, null, 2));
    console.log("\n✅ Đã lưu kết quả vào file test_report.json");

    // 2. Xuất ra file Excel
    const worksheet = XLSX.utils.json_to_sheet(testResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả Test");
    XLSX.writeFile(workbook, "Bao-Cao-Kiem-Thu.xlsx");
    console.log("✅ Đã lưu kết quả vào file Bao-Cao-Kiem-Thu.xlsx");

  } finally {
    await driver.quit();
  }
}

testLogin();