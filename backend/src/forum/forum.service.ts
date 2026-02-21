import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  async getPosts(categoryId?: string, limit = 20, offset = 0) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    });
  }

  async getPostById(id: string) {
    const post = await this.prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    // Increment views
    await this.prisma.forumPost.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return post;
  }

  async createPost(userId: string, data: any) {
    return this.prisma.forumPost.create({
      data: {
        ...data,
        userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
      },
    });
  }

  async createComment(userId: string, postId: string, content: string) {
    return this.prisma.forumComment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }
}
