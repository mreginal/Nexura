import "./style.css"

export default function Stepper({ step }: { step: number }) {
  return (
    <div className="stepper">
      {[1, 2, 3].map((item) => (
        <div key={item} className="step-item">
          <span className={`step-number ${step >= item ? "active" : ""}`}>
            {item}
          </span>

          <div className={`step-bar ${step >= item ? "active" : ""}`} />
        </div>
      ))}
    </div>
  )
}