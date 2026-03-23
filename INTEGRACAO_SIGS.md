# 🏥 Guia de Integração: Fluxo Totem ↔ SIGS Prefeitura (PET SAÚDE DIGITAL)

Este documento descreve o mapeamento técnico do fluxo de integração de 9 passos solicitado para o projeto **Totem NGA**.

## 1. Mapeamento do Fluxo (Totem Prototype)

Abaixo estão os 9 passos da integração vinculados aos arquivos e lógicas já implementados no código:

| Passo | Descrição | Onde ocorre no Projeto | Arquivo de Referência |
| :--- | :--- | :--- | :--- |
| **1** | Paciente digita o CPF | Tela de Identificação (Input Numérico) | `frontend/src/app/totem/identificacao/page.tsx` |
| **2** | Consulta na integração | Função `validarConsultaAgendada` | `frontend/src/services/consultaService.ts` |
| **3** | Retorna setor | Objeto `consulta.setor_nome` (Backend) | `backend/src/sigs/sigs.service.ts` |
| **4** | Grava confirmação | Execução do `sigsService.checkIn(id)` | `frontend/src/app/totem/confirmacao/page.tsx` |
| **5** | Fila de espera | Paciente inserido em `pacientes_fila` | `frontend/src/services/filaService.ts` |
| **6** | Dirige-se ao setor | Guia visual via Faixas Coloridas (UI) | `frontend/src/app/totem/confirmacao/page.tsx` |
| **7** | Médico chama | Endpoint `POST /fila/:id/chamar` | `backend/src/fila/fila.controller.ts` |
| **8** | SIGS p/ integração | Atualização automática para status `chamando` | `backend/src/fila/fila.service.ts` |
| **9** | Painel da TV | Monitoramento e Voz (TTS) | `frontend/src/features/tv/InterfaceTV.tsx` |

---

## 2. Detalhes Técnicos da Implementação

### Passo 2 & 3: Consulta de Agendamento
- **Backend**: O `SigsService` realiza a busca na tabela `agendamentos_sigs` filtrando por CPF e verificando se o `check_in` ainda é falso.
- **Frontend**: O serviço `consultaService.ts` converte o formato do banco central para o esquema visual do Totem.

### Passo 4: Confirmação de Presença
- No momento da confirmação no Totem, o sistema dispara dois comandos:
  1. Marca `check_in: true` na tabela do SIGS (Prefeitura).
  2. Cria um registro na tabela `pacientes_fila` para iniciar a gestão de tempo e ordem de chamada.

### Passo 7 & 8: Chamada Médica
- Quando o médico clica em "Chamar", o backend:
  1. Atualiza o status do paciente para `chamando`.
  2. Gera um registro na tabela `chamadas_tv`.
  3. O Painel de TV, através de um intervalo de sincronização (Polling), detecta a nova entrada em milissegundos.

### Passo 9: Painel Visual e Sonoro
- O componente `InterfaceTV.tsx` utiliza a API de síntese de voz do navegador (`window.speechSynthesis`) para ler o nome do paciente e a sala, após disparar um alerta sonoro (Chime).

---

## 3. Próximos Passos para Produção

1.  **Conexão Externa**: Substituir a URL do banco no `.env` do backend pela string de conexão fornecida pela TI da prefeitura ou NGA.
2.  **Mapeamento de Nomes**: Garantir que as strings de setores (ex: "Setor Verde") retornadas pela prefeitura coincidam com os IDs de estilo definidos no `TotemContext.tsx`.
3.  **Ambiente de TV**: O painel deve ser aberto em modo tela cheia (F11) nos monitores das salas de espera.

---

## 4. Estrutura de Dados de Integração

Para que os 9 passos ocorram, o sistema espera que a prefeitura disponibilize os seguintes dados:

### 4.1. Entidade Principal: `Agendamentos`
Esta entidade é consultada via CPF para validar a presença no dia.

| Atributo (Campo) | Tipo | Descrição | Onde conversa no Totem |
| :--- | :--- | :--- | :--- |
| **`cpf`** | String | CPF do paciente (com ou sem pontuação) | Identificação do paciente na primeira tela |
| **`nome_paciente`** | String | Nome completo do paciente | Exibido na tela de confirmação |
| **`data_agendamento`** | Date | Data da consulta (YYYY-MM-DD) | Filtro para garantir que a consulta é para o dia de hoje |
| **`horario`** | String | Horário previsto da consulta | Ajuda o paciente a confirmar qual a consulta correta |
| **`setor_nome`** | String | Nome do setor (ex: "Setor Verde") | Usado para guiar o paciente (Passo 3 e 6) |
| **`medico_nome`** | String | Nome do médico/profissional | Exibido na tela para o paciente saber quem o chamará |
| **`check_in`** | Boolean | Status de presença (Inicia como `false`) | O Totem altera para `true` quando o paciente confirma (Passo 4) |

### 4.2. Entidade de Apoio: `Médicos`
Essencial para a gestão de salas e chamadas no Painel de TV.

| Atributo (Campo) | Tipo | Descrição | Onde conversa no Totem |
| :--- | :--- | :--- | :--- |
| **`id`** | String | Identificador único do médico | Vinculação interna na fila |
| **`nome`** | String | Nome do médico | Exibido no Painel da TV (Passo 9) |
| **`especialidade`** | String | Área de atuação | Informação adicional para o paciente |
| **`crm`** | String | Registro profissional | Identificação técnica |


