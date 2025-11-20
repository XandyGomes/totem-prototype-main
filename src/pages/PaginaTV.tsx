import InterfaceTV from "@/components/InterfaceTV";

const PaginaTV = () => {
  // Para demonstração, pode ser TV geral ou de setor específico
  const isSetorEspecifico = new URLSearchParams(window.location.search).get('setor');
  
  return (
    <InterfaceTV 
      setorFoco={isSetorEspecifico || undefined}
      titulo={isSetorEspecifico ? `CHAMADAS - ${isSetorEspecifico.toUpperCase()}` : "CHAMADAS GERAIS - NGA"}
    />
  );
};

export default PaginaTV;
