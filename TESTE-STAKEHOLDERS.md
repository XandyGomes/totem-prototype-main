# 🏥 NGA - TESTES STAKEHOLDERS

## 🎯 Acesso Rápido para Testes

Para facilitar os testes da equipe, criamos uma página especial com botões de navegação direta para todas as interfaces do sistema.

### 🚀 Como Acessar

**Acesse diretamente a página de testes:**
```
https://[SEU-DOMINIO]/teste
```

### 📱 Interfaces Disponíveis

| Interface | Descrição | Acesso Direto |
|-----------|-----------|---------------|
| **TOTEM** | Interface do paciente - fluxo completo | `/` |
| **MÉDICO** | Interface profissional - gestão de filas | `/medico` |
| **TV** | Painel de chamadas público | `/tv` |
| **ADMIN** | Painel administrativo | `/admin` |

### ✅ Fluxo de Teste Recomendado

1. **Comece pelo TOTEM** (`/`)
   - Simule o processo completo do paciente
   - Teste identificação por CPF
   - Experimente diferentes tipos de prioridade
   - Verifique a geração de senhas

2. **Teste a Interface MÉDICA** (`/medico`)
   - Explore a gestão de filas
   - Teste a chamada de pacientes
   - Verifique a funcionalidade de pausar/retomar

3. **Observe o Painel TV** (`/tv`)
   - Veja as chamadas em tempo real
   - Verifique a exibição de senhas e salas
   - Observe as animações e alertas

4. **Configure via ADMIN** (`/admin`)
   - Teste a alocação de médicos
   - Configure salas e setores
   - Experimente diferentes configurações

### 🔍 Pontos de Atenção para Testes

#### Responsividade
- [ ] Teste em desktop (1920x1080 recomendado)
- [ ] Teste em tablets
- [ ] Verifique legibilidade em diferentes tamanhos

#### Funcionalidades Core
- [ ] Fluxo completo do paciente no totem
- [ ] Geração e chamada de senhas
- [ ] Sincronização entre interfaces
- [ ] Alocação de médicos e salas

#### UX/UI
- [ ] Navegação intuitiva
- [ ] Ícones e textos claros
- [ ] Feedback visual adequado
- [ ] Tempos de resposta aceitáveis

### 📝 Como Reportar Feedback

Durante os testes, anote:

1. **Problemas encontrados**
   - Tela onde ocorreu
   - Passos para reproduzir
   - Comportamento esperado vs. real

2. **Sugestões de melhoria**
   - Interface específica
   - Funcionalidade a melhorar
   - Justificativa da mudança

3. **Pontos positivos**
   - Funcionalidades que funcionam bem
   - Interface intuitiva
   - Fluxos eficientes

### ⚙️ Configurações de Teste

**Dados de Teste Sugeridos:**
- CPFs válidos: `123.456.789-00`, `987.654.321-00`
- Nomes fictícios: Use nomes genéricos
- Prioridades: Teste todos os tipos disponíveis

**Browsers Recomendados:**
- Chrome (versão mais recente)
- Firefox (versão mais recente)
- Edge (versão mais recente)

### 🚨 Importante

- Esta é uma **versão de teste** - use apenas dados fictícios
- A página `/teste` é temporária e será removida na versão final
- Reporte todos os bugs e sugestões para a equipe de desenvolvimento

---

**Desenvolvido para NGA - Núcleo de Gestão Ambulatorial**  
*Sistema de Totem Inteligente para Gestão de Filas Médicas*
