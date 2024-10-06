using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Megagram.Data;
using Megagram.Models;
using System.Timers;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policyBuilder =>
        {
            policyBuilder.WithOrigins("http://localhost:8019")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<MySQLDBContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQLConnection"),
        new MySqlServerVersion(new Version(8, 0))
    ));
builder.Services.AddScoped<MySQLDBContext>();


builder.Services.AddDbContext<PSQLDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PSQLConnection")));
builder.Services.AddScoped<PSQLDBContext>();

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");


app.UseRouting();
app.MapGet("/allNotifications", async () => {
    using (var scope = app.Services.CreateScope())
    {
        var psqlDBContext = scope.ServiceProvider.GetRequiredService<PSQLDBContext>();


        var notifications = await psqlDBContext.user_notifications.ToListAsync();
        return notifications;
    }
});

app.MapGet("/allFollowRequests", async () => {
    using (var scope = app.Services.CreateScope())
    {
        var mysqlDBContext = scope.ServiceProvider.GetRequiredService<MySQLDBContext>();


        var followRequests = await mysqlDBContext.followRequests.ToListAsync();
        return followRequests;
    }
});

app.UseWebSockets();


var webSocketHandler = new WebSocketHandler(app);

// Middleware to handle WebSocket connections
app.Use(async (context, next) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await webSocketHandler.HandleWebSocketConnection(webSocket);
    }
    else
    {
        await next();
    }
});

app.Run();


public class WebSocketHandler
{
    // Key: usernames, Value: List of WebSockets for that username
    private Dictionary<string, List<WebSocket>> usernameToClientListMappings = new Dictionary<string, List<WebSocket>>();

    // Key: username of each one of those who subscribed to updates of notifications, Value: Latest notification of that username
    private Dictionary<string, UserNotification> usernameToNotificationMappings = new Dictionary<string, UserNotification>();

    // Key: username of each one of those who subscribed to updates of notifications, Value: Set of follow-requesters of that username
    private Dictionary<string, HashSet<string>> usernameToFollowRequestsMappings = new Dictionary<string, HashSet<string>>();

    private WebApplication app;
    private System.Timers.Timer _timer1; // Timer for UpdateNotificationsToUsers()
    private System.Timers.Timer _timer2; // Timer for UpdateFollowRequestsToUsers()
    private bool _isMethod1Running = false; // Flag to control UpdateNotificationsToUsers() execution
    private bool _isMethod2Running = false; // Flag to control UpdateFollowRequestsToUsers() execution

    public WebSocketHandler(WebApplication app) {
        this.app = app;
         _timer1 = new System.Timers.Timer(5000); // Set interval to 5 seconds
        _timer1.Elapsed += Timer1Elapsed!;
        _timer1.AutoReset = true; // Repeat the timer
        _timer1.Enabled = true; // Start the timer

        // Initialize Timer for the second method
        _timer2 = new System.Timers.Timer(5000);
        _timer2.Elapsed += Timer2Elapsed!;
        _timer2.AutoReset = true;
        _timer2.Enabled = true;
    }

    private async void Timer1Elapsed(object sender, ElapsedEventArgs e)
    {
        if(!_isMethod1Running) {
            _isMethod1Running = true;
            await UpdateNotificationsToUsers();
            _isMethod1Running = false;
        }
    }


    private async void Timer2Elapsed(object sender, ElapsedEventArgs e)
    {
        if(!_isMethod2Running) {
            _isMethod2Running = true;
            await UpdateFollowRequestsToUsers();
            _isMethod2Running = false;
        }
    }

    
    public async Task UpdateNotificationsToUsers()
    {
        foreach (var username in usernameToNotificationMappings.Keys)
        {
            UserNotification latestNotificationOfUser = usernameToNotificationMappings[username];

            using (var scope = app.Services.CreateScope())
            {
                var psqlDBContext = scope.ServiceProvider.GetRequiredService<PSQLDBContext>();

                var newNotifications = await psqlDBContext.user_notifications
                    .Where(un => un.recipient == username)
                    .Where(un => un.origin_datetime > latestNotificationOfUser.origin_datetime)
                    .OrderByDescending(un => un.origin_datetime)
                    .ToListAsync();

                if (newNotifications.Count > 0)
                {
                    var output = new List<object> {"user-notifications-update", newNotifications};
                    var outputBytesAfterStringifying = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(output));
                    var messageType = WebSocketMessageType.Text;
                    var endOfMessage = true;

                    foreach (var clientWebSocket in usernameToClientListMappings[username])
                    {
                        await clientWebSocket.SendAsync(
                            new ArraySegment<byte>(outputBytesAfterStringifying, 0, outputBytesAfterStringifying.Length), // Buffer to send
                            messageType, // Message type
                            endOfMessage, // End of message
                            CancellationToken.None // Cancellation token
                        );
                    }
                    usernameToNotificationMappings[username] = newNotifications[0];
                }
            }
        }
    }

    

    public async Task UpdateFollowRequestsToUsers()
    {
        foreach (var username in usernameToFollowRequestsMappings.Keys)
        {
            using (var scope = app.Services.CreateScope())
            {
                var mysqlDBContext = scope.ServiceProvider.GetRequiredService<MySQLDBContext>();

                var currentFollowRequestsOfUser = await mysqlDBContext.followRequests
                    .Where(fr => fr.requestee == username)
                    .OrderBy(fr => fr.requester)
                    .ToListAsync();

                var justRequestersOfUser = mysqlDBContext.followRequests
                    .Where(fr => fr.requestee == username)
                    .Select(x => x.requester);

                var setOfCurrentFollowRequestsOfUser = new HashSet<string>(justRequestersOfUser);


                if (!setOfCurrentFollowRequestsOfUser.SetEquals(usernameToFollowRequestsMappings[username]))
                {
                    var output = new List<object> {"follow-requests-update", currentFollowRequestsOfUser};
                    var outputBytesAfterStringifying = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(output));
                    var messageType = WebSocketMessageType.Text;
                    var endOfMessage = true;

                    foreach (var clientWebSocket in usernameToClientListMappings[username])
                    {
                        await clientWebSocket.SendAsync(
                            new ArraySegment<byte>(outputBytesAfterStringifying, 0, outputBytesAfterStringifying.Length), // Buffer to send
                            messageType, // Message type
                            endOfMessage, // End of message
                            CancellationToken.None // Cancellation token
                        );
                    }

                    usernameToFollowRequestsMappings[username] = setOfCurrentFollowRequestsOfUser;
                }
            }
        }
    }


    public async Task HandleWebSocketConnection(WebSocket webSocket)
    {
        Console.WriteLine("Client connected");
        
        var buffer = new byte[1024 * 4]; // Buffer to hold the incoming message
        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        string? username = "";


        while (!result.CloseStatus.HasValue) // Keep reading until the WebSocket is closed
        {
            string receivedMessageAsString = Encoding.UTF8.GetString(buffer, 0, result.Count); // Decode received message
            List<string>? receivedMessage = JsonSerializer.Deserialize<List<string>?>(receivedMessageAsString);

            if(receivedMessage?[0] == "user-notifications") {
                username = receivedMessage?[1];

                if (!usernameToClientListMappings.ContainsKey(username!))
                {
                    usernameToClientListMappings[username!] = new List<WebSocket>();
                }
                usernameToClientListMappings[username!].Add(webSocket);

                if(!usernameToNotificationMappings.ContainsKey(username!)) {
                    using (var scope = app.Services.CreateScope())
                    {
                        var psqlDBContext = scope.ServiceProvider.GetRequiredService<PSQLDBContext>();

                        var notification = await psqlDBContext.user_notifications
                        .Where(un => un.recipient == username)
                        .OrderByDescending(un => un.origin_datetime)
                        .Take(1)
                        .FirstOrDefaultAsync();

                        if(notification==null) {
                            notification = new UserNotification {
                                recipient = "",
                                subject = "",
                                action = "",
                                isread = false,
                                origin_datetime = DateTime.SpecifyKind(new DateTime(2001, 01, 01), DateTimeKind.Utc)
                            };
                        }

                        usernameToNotificationMappings[username!] = notification!;
                    }
                }

            }

            else if(receivedMessage?[0] == "follow-requests") {
                username = receivedMessage?[1];

                if (!usernameToClientListMappings.ContainsKey(username!))
                {
                    usernameToClientListMappings[username!] = new List<WebSocket>();
                }
                usernameToClientListMappings[username!].Add(webSocket);

                if(!usernameToFollowRequestsMappings.ContainsKey(username!)) {
                    using (var scope = app.Services.CreateScope())
                    {
                        var mysqlDBContext = scope.ServiceProvider.GetRequiredService<MySQLDBContext>();

                        var followRequests = await mysqlDBContext.followRequests
                        .Where(fr => fr.requestee == username)
                        .Select(fr => fr.requester)
                        .ToListAsync();

                    usernameToFollowRequestsMappings[username!] = new HashSet<string>(followRequests);
                        
                    }
                }
            }

            // Continue receiving data
            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }


        usernameToClientListMappings.Remove(username!);
        usernameToNotificationMappings.Remove(username!);
        usernameToFollowRequestsMappings.Remove(username!);

        // Close the WebSocket connection gracefully
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);

        Console.WriteLine("Client disconnected");
    }

    
}
