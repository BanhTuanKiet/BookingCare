using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

public class AppointmentTests : TestBase
{
    private void PerformLogin()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/Đăng%20nhập");

        var loginPage = new LoginPage(driver);
        loginPage.Login("banhtuankiet2908@gmail.com", "Tuan2908Kiet@");

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        // Đợi URL thay đổi để chắc chắn đã đăng nhập xong
        wait.Until(d => d.Url.Contains("localhost:3000"));

        driver.Navigate().GoToUrl("http://localhost:3000/đặt%20lịch%20khám");

        // Thêm một bước đợi để form hiển thị hoàn toàn
        wait.Until(ExpectedConditions.ElementIsVisible(By.TagName("form")));
    }

    private string HandleAlert()
    {
        // Tăng thời gian đợi lên một chút nếu mạng chậm
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));
        try
        {
            // Đợi cho đến khi Alert thực sự xuất hiện
            IAlert alert = wait.Until(ExpectedConditions.AlertIsPresent());
            string alertText = alert.Text;
            alert.Accept();
            return alertText;
        }
        catch (WebDriverTimeoutException)
        {
            Assert.Fail("Lỗi: Đã nhấn Submit nhưng không thấy Alert nào xuất hiện sau 15 giây.");
            return string.Empty;
        }
    }

    [Test]
    public void Patient_Can_Book_Appointment_Successfully()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        page.SelectDepartment("Khoa Nội tổng quát");
        page.SelectDoctor("TRẦN HỮU LỢI");
        page.SelectService("Khám tổng quát");
        page.SelectDate(DateTime.Now.AddDays(2).ToString("yyyy-MM-dd"));
        page.SelectTime("Sáng");
        page.Submit();

        // SỬA Ở ĐÂY: Dùng HandleAlert thay vì tìm Toastify__toast-body
        string message = HandleAlert();
        Assert.That(message.ToLower(), Does.Contain("thành công"));
    }
    
    [Test]
    public void Cannot_Book_In_The_Past()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        page.SelectDepartment("Khoa Nội tổng quát");
        page.SelectDoctor("TRẦN HỮU LỢI");
        page.SelectService("Khám tổng quát");
        page.SelectDate(DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"));
        page.SelectTime("Sáng");

        page.Submit();
        string message = HandleAlert();
        Assert.That(message, Does.Contain("tối thiểu trước 1 ngày"));
    }

    [Test]
    public void Cannot_Book_More_Than_15_Days()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        page.SelectDepartment("Khoa Nội tổng quát");
        page.SelectDoctor("TRẦN HỮU LỢI");
        page.SelectService("Khám tổng quát");
        page.SelectDate(DateTime.Now.AddDays(20).ToString("yyyy-MM-dd"));
        page.SelectTime("Sáng");

        page.Submit();

        string message = HandleAlert();
        Assert.That(message, Does.Contain("quá 15 ngày"));
    }
}