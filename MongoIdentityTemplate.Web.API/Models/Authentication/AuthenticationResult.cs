namespace MongoIdentityTemplate.Web.API.Models.Authentication
{
    public class AuthenticationResult
    {
        public required Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required Gender Gender { get; set; }
        public required IEnumerable<string> Roles { get; set; }
        public required string Token { get; set; }
        public required int ExpiresIn { get; set; }
    }
}
