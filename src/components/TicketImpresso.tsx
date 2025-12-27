import { useTotem, mockSetores } from "@/contexts/TotemContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createPortal } from "react-dom";

const TicketImpresso = () => {
    const { state } = useTotem();
    const { senhaGerada, pacienteIdentificacao, consulta } = state;

    const dataAtual = new Date();

    // Dados para impressão (se não houver estado, usa dados falsos para teste)
    const dadosImpressao = senhaGerada || {
        numero: "P-001",
        prioridade: { descricao: "Prioridade Teste (Mock)", tipo: "mock" },
        horario: new Date().toLocaleTimeString(),
    };

    const pacienteNome = consulta?.paciente?.nome || "Paciente Visitante";
    const pacienteDoc = pacienteIdentificacao || "000.***.***-**";
    const setorNome = consulta?.setor || "Triagem";
    const especialidade = consulta?.medico?.especialidade || "Clínica Geral";
    const medicoNome = consulta?.medico?.nome || "Plantonista";
    const sala = consulta?.sala || "A definir";

    // Lógica para cor da linha (reutilizada de Confirmacao)
    const setor = senhaGerada?.setor || mockSetores.find(s =>
        s.nome.toLowerCase() === (consulta?.setor || "").toLowerCase()
    ) || mockSetores[0];

    const getLineName = (corNome: string) => {
        const lineNames: { [key: string]: string } = {
            'verde': 'LINHA VERDE',
            'amarelo': 'LINHA AMARELA',
            'azul': 'LINHA AZUL',
            'violeta': 'LINHA VIOLETA',
            'laranja': 'LINHA LARANJA'
        };
        return lineNames[corNome] || 'LINHA CINZA';
    };

    const lineName = getLineName(setor.corNome);

    return createPortal(
        <div
            id="print-ticket"
            className="hidden font-mono text-center w-[80mm]"
            style={{
                paddingTop: "5mm",
                paddingLeft: "5mm",
                // paddingRight é automatico pelo width 80mm
            }}
        >
            {/* Cabeçalho */}
            <div className="border-b-2 border-dashed border-black pb-2 mb-2">
                <h2 className="text-xl font-bold uppercase">Saúde Digital</h2>
                <p className="text-sm">Totem de Autoatendimento</p>
                <p className="text-xs mt-1">
                    {format(dataAtual, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                </p>
            </div>

            {/* Informações da Senha */}
            <div className="py-2">
                <p className="text-sm font-bold uppercase mb-1">
                    {dadosImpressao.prioridade.descricao}
                </p>
                <h1 className="text-5xl font-black my-2 tracking-wider border-2 border-black py-2 rounded">
                    {dadosImpressao.numero}
                </h1>
            </div>

            {/* Instrução de Setor e Linha */}
            <div className="border-b-2 border-dashed border-black pb-2 mb-2">
                <p className="text-lg font-black uppercase mt-2">
                    {setorNome}
                </p>
                <div className="border-2 border-black rounded p-1 mt-2 inline-block px-4">
                    <p className="text-xs font-bold uppercase">SIGA A</p>
                    <p className="text-lg font-black uppercase">{lineName}</p>
                </div>
                <p className="text-[10px] font-bold mt-2 uppercase">
                    Aguarde a chamada da sua senha no painel
                </p>
            </div>

            {/* Detalhes do Medico e Paciente */}
            <div className="text-xs text-left py-1 space-y-1">
                <div className="mb-2">
                    <p><strong>Especialidade:</strong> {especialidade}</p>
                    <p><strong>Médico:</strong> {medicoNome}</p>
                </div>

                <div className="border-t border-dashed border-black pt-2">
                    <p><strong>CPF/CNS:</strong> {pacienteDoc}</p>
                    <p className="truncate"><strong>Nome:</strong> {pacienteNome}</p>
                </div>
            </div>

            {/* Rodapé */}
            <div className="border-t-2 border-dashed border-black pt-2 mt-2 pb-8">
                <p className="text-sm font-bold">Aguarde ser chamado pelo painel.</p>
                <p className="text-xs mt-2">Obrigado!</p>
            </div>
        </div>,
        document.body
    );
};

export default TicketImpresso;
