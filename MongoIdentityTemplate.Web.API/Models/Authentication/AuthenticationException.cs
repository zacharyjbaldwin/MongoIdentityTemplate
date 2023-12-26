namespace MongoIdentityTemplate.Web.API.Models.Authentication
{
    public class AuthenticationException
    {
        public required AuthenticationExceptionCode Code { get; set; }
        public required string Message { get; set; }
    }
}
