using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver.Linq;
using MongoIdentityTemplate.Web.API.Data.Entities;
using MongoIdentityTemplate.Web.API.Models.Authentication;
using MongoIdentityTemplate.Web.API.Utility.Token.Interface;

namespace MongoIdentityTemplate.Web.API.Controllers
{
    [ApiController]
    [Route("authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ITokenUtility _tokenUtility;
        private readonly UserManager<User> _userManager;

        public AuthenticationController(ITokenUtility tokenUtility, UserManager<User> userManager)
        {
            _tokenUtility = tokenUtility;
            _userManager = userManager;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(z => z.Email == request.Email);

            if (user == null) return Unauthorized();

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized();
            }

            return Ok(CreateAuthenticationResult(user));
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email) != null;
            if (userExists) return Conflict(new AuthenticationException()
            {
                Code = AuthenticationExceptionCode.DuplicateEmail,
                Message = "The provided email address is already in use."
            });

            var user = new User()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                UserName = request.Email,
                Gender = request.Gender,
                Roles = new string[] { "member" }
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded) return Unauthorized(new AuthenticationException()
            {
                Code = AuthenticationExceptionCode.GenericError,
                Message = "An error occurred."
            });

            return Ok(CreateAuthenticationResult(user));
        }

        private AuthenticationResult CreateAuthenticationResult(User user)
        {
            return new AuthenticationResult()
            {
                Id = Guid.Parse(user.Id),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                Gender = user.Gender,
                Roles = user.Roles.ToList(),
                Token = _tokenUtility.CreateToken(user),
                ExpiresIn = 3600
            };
        }
    }
}
