import { Module } from '@nestjs/common';
import { ChannelInitializationService } from './channel.init.service';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common';
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
    CommonModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [ChannelInitializationService],
})
export class ApplicationModule {}
