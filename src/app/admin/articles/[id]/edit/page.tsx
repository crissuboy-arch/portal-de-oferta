import ArticleForm from "@/app/admin/articles/new/page"

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  return <ArticleForm id={params.id} />
}