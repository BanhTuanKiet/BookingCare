using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

public class AppointmentPage
{
    private readonly IWebDriver driver;
    private readonly WebDriverWait wait;

    public AppointmentPage(IWebDriver driver)
    {
        this.driver = driver;
        wait = new WebDriverWait(driver, TimeSpan.FromSeconds(20));
    }

    private IWebElement GetSelect(string id)
    {
        return wait.Until(d =>
        {
            var select = d.FindElement(By.Id(id));
            return select.FindElements(By.TagName("option")).Count > 1 ? select : null;
        });
    }

    private void SelectDropdownByText(string id, string text)
    {
        var element = GetSelect(id);
        var select = new SelectElement(element);
        select.SelectByText(text);

        // 🔥 BẮT BUỘC: trigger React onChange
        IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
        js.ExecuteScript(
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
            element
        );
    }

    public void SelectDepartment(string value)
        => SelectDropdownByText("department", value);

    public void SelectDoctor(string value)
        => SelectDropdownByText("doctor", value);

    public void SelectService(string value)
        => SelectDropdownByText("service", value);

    public void SelectTime(string value)
        => SelectDropdownByText("appointmentTime", value);

    public void SelectDate(string date)
    {
        IWebElement dateInput = wait.Until(
            ExpectedConditions.ElementIsVisible(By.Id("appointmentDate"))
        );

        dateInput.Clear();
        dateInput.SendKeys(date);

        IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
        js.ExecuteScript("arguments[0].value = arguments[1];", dateInput, date);
        js.ExecuteScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", dateInput);
        js.ExecuteScript("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", dateInput);
    }

    private IWebElement SubmitButton =>
        wait.Until(d => d.FindElement(By.Id("btn-submit-appointment")));

    public void Submit() => SubmitButton.Click();
}
