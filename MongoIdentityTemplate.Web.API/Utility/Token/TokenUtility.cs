using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver.Linq;
using MongoIdentityTemplate.Web.API.Data.Entities;
using MongoIdentityTemplate.Web.API.Utility.Token.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MongoIdentityTemplate.Web.API.Utility.Token
{
    public class TokenUtility : ITokenUtility
    {
        private readonly double _durationHours;
        private readonly SymmetricSecurityKey _key;

        public TokenUtility(IConfiguration config)
        {
            _durationHours = double.Parse(config["JWT:DurationHours"]!);
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:TokenSecret"]!));
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Gender, ((int)user.Gender).ToString())
            };

            claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(_durationHours),
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
