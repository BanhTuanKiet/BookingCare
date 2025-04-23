namespace server.Services
{
    public interface IAuth
    {
        Task<string> GetRefreshToken();
        bool VerifyToken(string token);
    }
}
