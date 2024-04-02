import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { CommonModule } from './common';
import { ChannelInitializationService } from './channel.init.service';
import { DatabaseModule } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./**/*.graphql'],
    }),
    ChannelModule,
    MessageModule,
    CommonModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [ChannelInitializationService],
})
export class ApplicationModule {}
