namespace server.Util
{
    public static class CookieUtil
    {
        public static void SetCookie(HttpResponse response, string key, string value, int expireTime)
        {
            CookieOptions option = new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(expireTime),
            };
            response.Cookies.Append(key, value, option);
        }

        public static string GetCookie(HttpRequest request, string key)
        {
            return request.Cookies[key];
        }
    }
}