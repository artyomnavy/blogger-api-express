import "reflect-metadata";
import {UsersRepository} from "./repositories/users-db-repository";
import {UsersQueryRepository} from "./repositories/users-db-query-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./controllers/users-controller";
import {PostsRepository} from "./repositories/posts-db-repository";
import {BlogsQueryRepository} from "./repositories/blogs-db-query-repository";
import {PostsQueryRepository} from "./repositories/posts-db-query-repository";
import {BlogsRepository} from "./repositories/blogs-db-repository";
import {CommentsQueryRepository} from "./repositories/comments-db-query-repository";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {DevicesRepository} from "./repositories/devices-db-repository";
import {DevicesQueryRepository} from "./repositories/devices-db-query-repository";
import {AuthRepository} from "./repositories/auth-db-repository";
import {AuthQueryRepository} from "./repositories/auth-db-query-repository";
import {PostsService} from "./domain/posts-service";
import {DevicesService} from "./domain/devices-service";
import {CommentsService} from "./domain/comments-service";
import {BlogsService} from "./domain/blogs-service";
import {AuthService} from "./domain/auth-service";
import {PostsController} from "./controllers/posts-controller";
import {DevicesController} from "./controllers/devices-controller";
import {CommentsController} from "./controllers/comments-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {EmailsAdapter} from "./adapters/EmailsAdapter";
import {EmailsManager} from "./managers/emails-manager";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {LikesRepository} from "./repositories/likes-db-repository";
import {LikesQueryRepository} from "./repositories/likes-db-query-repository";
import {Container} from "inversify";
import {CommentMapper} from "./types/comment/mapper";

export const container = new Container()

// Instances controllers
container.bind(UsersController).to(UsersController)
container.bind(BlogsController).to(BlogsController)
container.bind(PostsController).to(PostsController)
container.bind(CommentsController).to(CommentsController)
container.bind(DevicesController).to(DevicesController)
container.bind(AuthController).to(AuthController)

// Instances services
container.bind(UsersService).to(UsersService)
container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(CommentsService).to(CommentsService)
container.bind(DevicesService).to(DevicesService)
container.bind(AuthService).to(AuthService)
container.bind(JwtService).to(JwtService)

// Instances emails
container.bind(EmailsManager).to(EmailsManager)
container.bind(EmailsAdapter).to(EmailsAdapter)

// Instances query repositories
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(DevicesQueryRepository).to(DevicesQueryRepository)
container.bind(AuthQueryRepository).to(AuthQueryRepository)
container.bind(LikesQueryRepository).to(LikesQueryRepository)

// Instances repositories
container.bind(UsersRepository).to(UsersRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(DevicesRepository).to(DevicesRepository)
container.bind(AuthRepository).to(AuthRepository)
container.bind(LikesRepository).to(LikesRepository)

// Instances mapper
container.bind(CommentMapper).to(CommentMapper)