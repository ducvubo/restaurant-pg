import { ICategory } from '../category-blog/category-blog.interface'

export interface IArticle {
  atlId: string
  atlResId?: string
  category: ICategory
  catId: string
  atlTitle: string
  atlDescription: string
  atlSlug: string
  atlImage: string
  atlType: 'DEFAULT' | 'VIDEO' | 'IMAGE'
  atlContent: any
  atlStatus:
    | 'DRAFT'
    | 'PENDING_APPROVAL'
    | 'REJECTED'
    | 'PENDING_PUBLISH'
    | 'PUBLISH_SCHEDULE'
    | 'PUBLISHED'
    | 'UNPUBLISHED'
  atlPublishedTime?: Date
  atlPublishedSchedule?: Date
  atlView: number
  listArticleRelated: string[]
  listArticleNote: string[]
  articleDefaultModel: {
    content: string
  }
  listArticleImage: {
    imageLink: string
    imageName: string
    imageDescription: string
    Id: string
  }[]
  articleVideoModel: {
    videoArticleType: 'LINK' | 'EMBED'
    contentVideo: string
    description: string
  }
  isDeleted: number
}
