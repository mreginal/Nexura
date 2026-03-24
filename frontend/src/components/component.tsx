type Props = {
  link: string;
};

const Component = ({ link }: Props) => {
  return (
    <div
      style={{
        fontFamily: "'Montserrat', Arial, sans-serif",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#3C0059",
          fontSize: "50px",
          marginBottom: "10px",
        }}
      >
        Nexura
      </h1>

      <p style={{ fontSize: "20px", color: "#7C7C7C", fontWeight:"bold" }}>
        Recuperação de senha
      </p>

      <p style={{ margin: "20px 0" }}>
        Clique no botão abaixo para redefinir sua senha:
      </p>

      <a
        href={link}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          textDecoration: "none",
          fontWeight: "bold",
          marginTop: "10px",
          backgroundColor: "#3C0059",
          borderRadius: "15px",
          color: "#FFFFFF"
        }}
      >
        Redefinir senha
      </a>

      <p
        style={{
          fontSize: "14px",
          color: "#C2C2C2",
          marginTop: "30px",
        }}
      >
        Este link expira em 30 minutos.
      </p>

      <div style={{ marginTop: "40px" }}>
        <img
          src="https://i.imgur.com/S0qfvwG.png"
          alt="Nexura"
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default Component;