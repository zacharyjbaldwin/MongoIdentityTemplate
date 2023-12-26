using MongoIdentityTemplate.Web.API.Data.Entities;

namespace MongoIdentityTemplate.Web.API.Utility.Token.Interface
{
    public interface ITokenUtility
    {
        string CreateToken(User user);
    }
}
