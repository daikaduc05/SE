import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationUser } from 'src/users/entities/notification-user.entity';
import { Notification } from 'src/users/entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { TypeNotiEnum } from 'src/enum/typeNoti.enum';
@WebSocketGateway({
  cors: {
    origin: '*', // hoặc ['http://127.0.0.1:5500']
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  private readonly userIdToClientIdMap: Map<number, string> = new Map();
  constructor(
    @Inject('NOTIFICATION_USER_REPOSITORY')
    private readonly notificationUserRepository: Repository<NotificationUser>,
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepository: Repository<Notification>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Xử lý handshake để xác thực kết nối
    const handshake = client.handshake;
    this.logger.log(`Handshake: ${JSON.stringify(handshake)}`);
    const userId = handshake.query.userId as string;
    if (userId) {
      this.userIdToClientIdMap.set(parseInt(userId, 10), client.id);
      this.logger.log(`Mapped userId ${userId} to clientId ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, clientId] of this.userIdToClientIdMap.entries()) {
      if (clientId === client.id) {
        this.userIdToClientIdMap.delete(userId);
        this.logger.log(`Removed mapping for userId ${userId}`);
      }
    }
  }

  @OnEvent('triggerNoti')
  handleTriggerNoti(payload: { userId: number; message: string; type: TypeNotiEnum; id: number }) {
    this.logger.log(`Sending notification to user ${payload.userId}: ${payload.message}`);
    const clientId = this.userIdToClientIdMap.get(payload.userId);
    if (clientId) {
      this.server
        .to(clientId)
        .emit(`noti:${payload.userId}`, payload.message, payload.type, payload.id);
    } else {
      this.logger.warn(`No client found for userId ${payload.userId}`);
    }
  }
}
