using System.ComponentModel.DataAnnotations;

namespace MongoIdentityTemplate.Web.API.Models.Authentication
{
    public class LoginRequest
    {
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
