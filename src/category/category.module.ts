import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
