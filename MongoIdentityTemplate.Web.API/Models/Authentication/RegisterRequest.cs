using System.ComponentModel.DataAnnotations;

namespace MongoIdentityTemplate.Web.API.Models.Authentication
{
    public class RegisterRequest
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        [Required]
        public required Gender Gender { get; set; }
    }
}
