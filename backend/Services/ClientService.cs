using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using shared.models.Identity;

namespace backend.Services;

public class ClientService : IClientService
{

    private ConcurrentDictionary<string, List<WebSocket>> _sockets = new ConcurrentDictionary<string, List<WebSocket>>();

    private readonly IServiceScopeFactory _scopeFactory;

    public ClientService(IServiceScopeFactory scopeFactory)
    {
        this._scopeFactory = scopeFactory;
    }
    
    public async Task HandleWebSocketConnection(WebSocket socket)
    {
        var buffer = new byte[1024 * 2];
        var hadFirstMessage = false;

        string? userId = null;

        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), default);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                break;
            }

            var message = System.Text.Encoding.UTF8.GetString(buffer[..result.Count]);

            message = message.Replace("\"", "");
            
            if (!hadFirstMessage)
            {
                using(var scope = _scopeFactory.CreateScope()) 
                {
                    var db = scope.ServiceProvider.GetRequiredService<MuseContext>();

                    // when we exit the using block,
                    // the IServiceScope will dispose itself 
                    // and dispose all of the services that it resolved.
                    var user = db.Users.SingleOrDefault(u => u.WebSocketToken == message);

                    if (user == null)
                    {
                        if (result.CloseStatus != null)
                        {
                            await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                        }

                        return;
                    }
                    userId = user.Id;

                    if (!_sockets.ContainsKey(userId))
                    {
                        _sockets[userId] = new List<WebSocket>();
                    }

                    _sockets[userId].Add(socket);

                    hadFirstMessage = true;
                }
            }

            if (userId == null)
            {
                continue;
            }

            if (message == "fetch")
            {
                var jsonString = this.GetKoboStatusAsString(userId);

                if (!string.IsNullOrEmpty(jsonString))
                {
                    var byteMessage = System.Text.Encoding.ASCII.GetBytes(jsonString);
                    
                    await socket.SendAsync(byteMessage, WebSocketMessageType.Text, true, default);
                }
            }
        }

        if (!string.IsNullOrEmpty(userId))
        {
            var sockets = _sockets[userId];
            
            sockets.Remove(socket);
        }
    }

    public string? GetKoboStatusAsString(string userId)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MuseContext>();
        var user = db.Users.Include(u => u.Kobos).SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return null;
        }
        
        var options = new JsonSerializerOptions
        {
            WriteIndented = false,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var kobos = user.Kobos;
        var output = new KoboStatus();

        output.Kobos = kobos;
        var jsonString = JsonSerializer.Serialize(output, options);

        return jsonString;
    }

    public async Task SendCurrentKoboState(string userId)
    {
        var jsonString = this.GetKoboStatusAsString(userId);

        if (string.IsNullOrEmpty(jsonString))
        {
            return;
        }

        await SendMessageToUserSockets(userId, jsonString);

    }

    public async Task SendMessageToUserSockets(string userId, string message)
    {
        if (!_sockets.TryGetValue(userId, out var sockets))
        {
            return;
        }

        if (sockets.Count == 0)
        {
            return;
        }
        
        var byteMessage = System.Text.Encoding.ASCII.GetBytes(message);

        foreach (var socket in sockets)
        {
            await socket.SendAsync(byteMessage, WebSocketMessageType.Text, true, default);
        }
    }
}