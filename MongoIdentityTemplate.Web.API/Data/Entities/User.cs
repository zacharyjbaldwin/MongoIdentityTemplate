using Microsoft.AspNetCore.Identity;
using MongoIdentityTemplate.Web.API.Models;
using System.ComponentModel.DataAnnotations;

namespace MongoIdentityTemplate.Web.API.Data.Entities
{
    public class User : IdentityUser<string>
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required]
        public required Gender Gender { get; set; }
        [Required]
        public required string[] Roles { get; set; }
    }
}
