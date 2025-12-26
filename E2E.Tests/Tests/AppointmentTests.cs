using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using NUnit.Framework;

public class AppointmentTests : TestBase
{
    private void PerformLogin()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/Đăng%20nhập");

        var loginPage = new LoginPage(driver);
        loginPage.Login("banhtuankiet2908@gmail.com", "Tuan2908Kiet@");

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(8));

        wait.Until(d => d.Url.Contains("localhost:3000"));

        driver.Navigate().GoToUrl("http://localhost:3000/đặt%20lịch%20khám");

        wait.Until(ExpectedConditions.ElementIsVisible(By.TagName("form")));
    }

    private string HandleAlert()
    {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        var alert = wait.Until(ExpectedConditions.AlertIsPresent());
        string text = alert.Text;
        alert.Accept();
        return text;
    }

    private void FillValidBaseForm(AppointmentPage page)
    {
        // Đợi department load
        new WebDriverWait(driver, TimeSpan.FromSeconds(8))
            .Until(d => d.FindElements(By.CssSelector("#department option")).Count > 1);

        page.SelectDepartment("Khoa Nội tổng quát");

        // Đợi doctor load theo department
        new WebDriverWait(driver, TimeSpan.FromSeconds(8))
            .Until(d => d.FindElements(By.CssSelector("#doctor option")).Count > 1);

        page.SelectDoctor("TRẦN HỮU LỢI");

        page.SelectService("Khám tổng quát");
        page.SelectTime("Sáng");
    }

    [Test]
    public void Cannot_Book_In_The_Past()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        FillValidBaseForm(page);
        page.SelectDate("2020-01-01");

        page.Submit();

        string message = HandleAlert();
        Assert.That(message, Does.Contain("tối thiểu trước 1 ngày"));
    }

    [Test]
    public void Patient_Can_Book_Appointment_Successfully()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        FillValidBaseForm(page);
        page.SelectDate("2025-12-30");

        page.Submit();

        string message = HandleAlert();
        Assert.That(message.ToLower(), Does.Contain("thành công"));
    }

    [Test]
    public void Cannot_Book_More_Than_15_Days()
    {
        PerformLogin();
        var page = new AppointmentPage(driver);

        FillValidBaseForm(page);
        page.SelectDate("2026-02-02");

        page.Submit();

        string message = HandleAlert();
        Assert.That(message, Does.Contain("15 ngày"));
    }
}
