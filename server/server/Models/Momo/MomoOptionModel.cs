namespace server.Models
{
   public class MomoOptionModel
    {
        public string PartnerCode { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string MomoApiUrl { get; set; }
        public string ReturnUrl { get; set; }
        public string NotifyUrl { get; set; }
        public string RequestType { get; set; }
            public string MomoStatusApiUrl { get; set; }
    }


}