import "./style.css"

type HeaderProps ={
  title:String
}

export default function Header({title}: HeaderProps){
  return (
    <>
      <header id="header-init">
              <h1>Nexura</h1>
              <h1 id="h1-line">|</h1>
              <h2>{title}</h2>
            </header>
    </>
  )
}