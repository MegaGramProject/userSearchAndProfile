namespace Megagram.Data;

using Megagram.Models;
using Microsoft.EntityFrameworkCore;


public class PSQLDBContext : DbContext
{

    public DbSet<UserNotification> user_notifications { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserNotification>(entity =>
        {
            entity.HasKey(e => new { e.recipient, e.subject, e.action, e.origin_datetime });
        });
    }

    public PSQLDBContext(DbContextOptions<PSQLDBContext> options) : base(options)
    {
    }


}