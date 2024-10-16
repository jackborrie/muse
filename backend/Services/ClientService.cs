using System.Net.WebSockets;
using backend.Services.Interfaces;

namespace backend.Services;

public class ClientService : IClientService
{

    private List<WebSocket> _sockets = new List<WebSocket>();
    private MuseContext _context;

    public ClientService(MuseContext context)
    {
        this._context = context;
    }
    
    public async Task HandleWebSocketConnection(WebSocket socket)
    {
        var buffer = new byte[1024 * 2];
        var hadFirstMessage = false;

        _sockets.Add(socket);
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
                var user = _context.Users.SingleOrDefault(u => u.WebSocketToken == message);

                if (user == null)
                {
                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                    return;
                }

                

            }
        }

        _sockets.Remove(socket);
    }
    
}