import './ArticleListPage.css'


const articles =[
    {
      article_id: 1,
      image: "",
      title: '첫 번째 기사',
      date: '2026-03-31',
      content: '이것은 첫 번째 기사 내용 일부입니다.',
    },
    {
      article_id: 2,
      image: "",
      title: '두 번째 기사',
      date: '2026-03-30',
      content: '이것은 두 번째 기사 내용 일부입니다.',
    },
    {
      article_id: 3,
      image: "",
      title: '세 번째 기사',
      date: '2026-03-29',
      content: '이것은 세 번째 기사 내용 일부입니다.',
    },
  ]






function ArticleList({articles}){
  return (
    <div className= "article-list">
      {articles.map((article) => (

        <div className= "article-card" key ={article.article_id}>
          <h2 className= "article-title">{article.title}</h2>
          <p className= "article-date">{article.date}</p>
          <p className= "article-content">{article.content}</p>
        </div>

      ))}

  </div>
  )
}


function ArticleListPage(){
  return (
    <div className= "page">
      
      
      <div className= "main">
        <h1 className= "page-title">전체 기사 보기</h1>
      </div>
      <ArticleList articles={articles} />

    </div>
  )
}
export default ArticleListPage
