using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using MongoIdentityTemplate.Web.API.Data;
using MongoIdentityTemplate.Web.API.Data.Entities;
using MongoIdentityTemplate.Web.API.Utility.Token;
using MongoIdentityTemplate.Web.API.Utility.Token.Interface;
using System.Text;

namespace MongoIdentityTemplate.Web.API
{
    public static class StartupExtensions
    {
        public static void AddAppSpecifics(this IServiceCollection services, IConfiguration config)
        {
            // Database
            var mongoDbClient = new MongoClient(config["MongoDB:ConnectionString"]);
            services.AddDbContext<UserDbContext>(options =>
                options.UseMongoDB(mongoDbClient, config["MongoDB:Databases:Authentication"]!));

            // Utilities
            services.AddScoped<ITokenUtility, TokenUtility>();

            // Identity
            services.AddIdentityCore<User>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 1;
                options.Password.RequireNonAlphanumeric = false;
            })
                .AddEntityFrameworkStores<UserDbContext>();

            // Authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:TokenSecret"]!)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            // Authorization
            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("RequireAdminOrBelow", z => z.RequireRole("admin"));
            //});
        }
    }
}
