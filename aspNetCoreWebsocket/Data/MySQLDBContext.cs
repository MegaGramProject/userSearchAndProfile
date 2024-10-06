namespace Megagram.Data;

using Megagram.Models;
using Microsoft.EntityFrameworkCore;


public class MySQLDBContext : DbContext
{

    public DbSet<FollowRequest> followRequests { get; set; }
    
    
    public MySQLDBContext(DbContextOptions<MySQLDBContext> options) : base(options)
    {
    }


}