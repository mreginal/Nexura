import "./style.css"
import logo from '../../assets/images/logo_purple.png'

export default function Loading() {
  return (
    <div className="container-loading">
      <img src={logo} alt="logo-roxa-nexura" />
      <h1 id="logo-txt">Nexura</h1>
    </div>
  )
}