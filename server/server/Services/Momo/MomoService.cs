using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using server.Models;
using server.Services;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

public class MomoService : IMomoService
{
    private readonly MomoOptionModel _options;
    private readonly HttpClient _httpClient;

    public MomoService(IOptions<MomoOptionModel> options)
    {
        _options = options.Value;
        _httpClient = new HttpClient();
    }

    public async Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(string orderId, string orderInfo, int amount)
    {
        var requestId = Guid.NewGuid().ToString(); // NEW

        var rawData = $"accessKey={_options.AccessKey}&amount={amount}&extraData=&ipnUrl={_options.NotifyUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_options.PartnerCode}&redirectUrl={_options.ReturnUrl}&requestId={requestId}&requestType={_options.RequestType}";
        var signature = ComputeHmacSha256(rawData, _options.SecretKey);

        var requestBody = new
        {
            partnerCode = _options.PartnerCode,
            accessKey = _options.AccessKey,
            requestId = requestId,
            amount = amount, // NO toString
            orderId = orderId,
            orderInfo = orderInfo,
            redirectUrl = _options.ReturnUrl,
            ipnUrl = _options.NotifyUrl,
            lang = "vi",
            extraData = "",
            requestType = _options.RequestType,
            signature = signature
        };

        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(_options.MomoApiUrl, content);

        var responseContent = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<MomoCreatePaymentResponseModel>(responseContent);

        return data;
    }


    public MomoExecuteResponseModel PaymentExecuteAsync(IQueryCollection collection)
    {
        return new MomoExecuteResponseModel
        {
            Amount = collection["amount"],
            OrderId = collection["orderId"],
            OrderInfo = collection["orderInfo"]
        };
    }

    private string ComputeHmacSha256(string message, string secretKey)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }

    // public async Task<MomoPaymentStatusResponseModel> CheckPaymentStatusAsync(string orderId)
    // {
    //     var requestBody = new
    //     {
    //         partnerCode = _options.PartnerCode,
    //         accessKey = _options.AccessKey,
    //         orderId = orderId,
    //         signature = ComputeHmacSha256($"partnerCode={_options.PartnerCode}&orderId={orderId}", _options.SecretKey)
    //     };

    //     var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
    //     var response = await _httpClient.PostAsync(_options.MomoStatusApiUrl, content);

    //     var responseContent = await response.Content.ReadAsStringAsync();
    //     return JsonConvert.DeserializeObject<MomoPaymentStatusResponseModel>(responseContent);
    // }

}
