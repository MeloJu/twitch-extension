# GPT.md - Guia de Execucao do Projeto

## 1) Objetivo do Projeto
Construir uma extensao de navegador para quem assiste lives no YouTube, mas prefere acompanhar o chat da Twitch em paralelo.

Objetivos principais:
- Exibir o chat da Twitch em uma aba separada, side panel, ou overlay configuravel.
- Manter base de codigo com arquitetura SOLID, testes automatizados e fluxo profissional de GitHub.

---

## 2) Problema e Proposta de Valor
Problema:
- Usuario assiste live no YouTube Premium (sem anuncios), mas quer experiencia de chat da Twitch.

Proposta:
- Sincronizar consumo de video no YouTube com interacao social da Twitch.
- Reduzir friccao: abrir chat com 1 clique e manter configuracoes por canal.

---

## 3) Escopo do MVP (Primeira Versao)
### Funcional
- Detectar quando usuario esta em pagina de live do YouTube.
- Permitir mapear canal do YouTube -> canal da Twitch.
- Abrir chat da Twitch:
  - em nova aba, ou
  - em side panel da extensao.
- Configuracoes persistentes no armazenamento da extensao.

### Nao Funcional
- Baixo impacto de performance.
- Zero coleta de dados sensiveis sem consentimento.
- Logs com nivel configuravel (dev/prod).
- Compatibilidade inicial: Chrome/Edge (Manifest V3).

### Fora do MVP
- Sincronizacao temporal perfeita entre stream e chat.
- Analise semantica/IA do chat.
- Suporte multi-plataforma alem de YouTube + Twitch.

---

## 4) Requisitos de Produto
### RQ-01 - Mapeamento de canais
- Usuario cadastra par: youtubeChannelId -> twitchChannelName.
- Extensao recupera mapeamento automaticamente ao abrir live.

### RQ-02 - Abertura rapida do chat
- Acao de abrir chat em 1 clique (acao da extensao).
- Opcoes: aba separada ou side panel.

### RQ-03 - Janela de chat da Twitch
- Exibir chat em aba separada ou side panel, com abertura em 1 clique.
- Permitir configurar modo padrao de abertura (aba ou side panel).

### RQ-04 - Persistencia local
- Configuracoes e mapeamentos em storage local/sync da extensao.

### RQ-05 - Observabilidade minima
- Logs estruturados para fluxo principal (detectar live, abrir chat, recuperar mapeamento).

---

## 5) Arquitetura (SOLID + Clean Architecture leve)
Adotar separacao por camadas para manter testabilidade e evolucao.

### Camadas
- Domain:
  - Entidades (ChannelMapping, SessionConfig)
  - Contratos (interfaces) e regras de negocio
- Application:
  - Casos de uso (OpenChatTab, OpenChatSidePanel, SaveMapping, GetMapping)
- Infrastructure:
  - Adaptadores de browser APIs, storage e parser de DOM
- Presentation:
  - Popup, side panel, options page
  - ViewModels sem logica de negocio pesada

### Principios SOLID aplicados
- S: cada modulo com responsabilidade unica.
- O: adicionar novo provider de chat sem alterar regras centrais.
- L: implementacoes de provider devem respeitar contrato base.
- I: interfaces pequenas e especificas (ex.: IChatWindowOpener).
- D: casos de uso dependem de interfaces, nao de implementacoes.

### Estrutura sugerida
- src/domain/entities
- src/domain/contracts
- src/application/use-cases
- src/infrastructure/browser
- src/infrastructure/providers
- src/presentation/popup
- src/presentation/options
- src/presentation/sidepanel
- src/shared

---

## 6) Decisoes Tecnicas
Stack proposta (escalavel e robusta):
- Runtime de extensao: Manifest V3.
- Build/dev: WXT (baseado em Vite), com suporte limpo para background, content scripts, popup e side panel.
- Linguagem: TypeScript com strict true.
- UI: React + CSS Modules (ou Tailwind apenas se o projeto realmente exigir design system grande).
- Validacao de dados: zod para validar configuracoes, mapeamentos e contratos entre camadas.
- Testes unitarios/integracao: Vitest.
- Testes E2E: Playwright com extensao carregada no Chromium.
- Qualidade: ESLint + Prettier + Husky + lint-staged + Commitlint (Conventional Commits).
- CI: GitHub Actions com gates de lint, typecheck, unit/integration e E2E.

Diretrizes anti-hardcode:
- Nao fixar URL em uso direto no codigo; centralizar endpoints/rotas em modulo de configuracao tipado.
- Nao fixar nome de canal Twitch em codigo; tudo vem de mapeamento persistido no storage.
- Nao espalhar chaves de storage; usar constantes centralizadas e tipadas.
- Nao acoplar browser API diretamente nos casos de uso; usar interfaces e adaptadores.
- Nao usar valores magicos (timeouts, retries, limites); extrair para configuracao versionada.

Diretriz geral:
- Preferir simplicidade com fronteiras claras entre camadas, mantendo evolucao incremental sem quebrar contratos.

---

## 7) Qualidade de Codigo
### Padroes
- ESLint + Prettier obrigatorios.
- tsconfig com strict, noImplicitAny, noUncheckedIndexedAccess.
- Nomenclatura clara e sem abreviacoes ambigua.
- Funcoes pequenas e orientadas a caso de uso.

### Revisao de codigo
Checklist de PR:
- Requisito atendido?
- Cobertura de testes adequada?
- Mudanca manteve contratos e nao quebrou comportamento?
- Observabilidade e erros tratados?
- Riscos de seguranca/privacidade avaliados?

---

## 8) Estrategia de Testes
### Piramide de testes
- Unitarios (maioria): regras de negocio e casos de uso.
- Integracao: storage adapter, parser de DOM, abertura de aba/side panel.
- E2E: fluxo real da extensao no navegador.

### Stack sugerida
- Unit/integracao: Vitest + Testing Library quando aplicavel.
- E2E: Playwright carregando extensao em Chromium.

### Cenarios E2E minimos
- E2E-01: detectar live no YouTube e habilitar acao de abrir chat.
- E2E-02: abrir chat da Twitch em aba separada.
- E2E-03: salvar e recuperar mapeamento de canal.
- E2E-04: abrir chat da Twitch em side panel.
- E2E-05: respeitar preferencia de abertura padrao (aba/side panel).

### Meta inicial de cobertura
- Unitarios: >= 80% em domain/application.
- Integracao: fluxos criticos de storage/abertura de chat.
- E2E: happy path completo + 2 cenarios de erro.

---

## 9) GitHub Flow e Commits Semanticos
Padrao: Conventional Commits.

Formato:
- type(scope): descricao curta

Tipos permitidos:
- feat: nova funcionalidade
- fix: correcao de bug
- refactor: mudanca sem alterar comportamento externo
- test: adicao/ajuste de testes
- docs: documentacao
- chore: tarefas tecnicas (build, tooling, deps)
- ci: pipeline

Exemplos:
- feat(mapping): add youtube to twitch channel mapping
- feat(chat): open twitch popout in side panel
- fix(chat): fallback to new tab when side panel is unavailable
- test(e2e): cover chat open from youtube live page

Branch naming:
- feat/<tema>
- fix/<tema>
- chore/<tema>

Regras:
- Uma branch por objetivo.
- PR pequeno e focado.
- Squash merge com mensagem semantica.

---

## 10) CI/CD (GitHub Actions)
Pipeline minima:
- job lint
- job test:unit
- job test:integration
- job test:e2e (em gate principal ou nightly)
- artifact do build da extensao

Gates obrigatorios para merge:
- lint ok
- testes unitarios/integracao ok
- revisao de codigo aprovada

---

## 11) Seguranca, Privacidade e Compliance
- Nao armazenar tokens/sessoes de usuario da Twitch/YouTube sem necessidade.
- Minimizar permissoes no manifest (principio do menor privilegio).
- Declarar claramente o que e coletado e para qual finalidade.
- Respeitar ToS das plataformas (Twitch/YouTube) e politicas da Chrome Web Store.
- Abertura do chat deve ser acao explicita do usuario.

---

## 12) Definicao de Pronto (Definition of Done)
Uma entrega so e considerada pronta quando:
- Requisito funcional implementado.
- Testes unitarios relevantes adicionados e passando.
- E2E atualizado para fluxo impactado (quando aplicavel).
- Lint/typecheck sem erros.
- Documentacao atualizada (README + changelog).
- PR aprovado e mergeado com commit semantico.

---

## 13) Roadmap por Fases
### Fase 0 - Fundacao
- Setup repositorio, tooling, CI, estrutura de pastas.
- Manifest MV3 + popup/options base.

### Fase 1 - MVP funcional
- Mapeamento de canais.
- Abrir chat da Twitch (aba/side panel).
- Persistencia local.
- Preferencia de abertura padrao (aba ou side panel).

### Fase 2 - Robustez
- Melhorias de parser/captura.
- Telemetria local e tratamento de erros.
- Mais cobertura E2E.

### Fase 3 - Escala
- Multi-mapeamento e perfis.
- Melhor UX de configuracao.
- Publicacao beta controlada.

---

## 14) Convencoes de Colaboracao com GPT
Sempre que pedir implementacao, usar este formato:
1. Contexto da feature
2. Requisito funcional
3. Requisito tecnico (arquitetura/camadas)
4. Criterios de aceite
5. Testes esperados (unit/integracao/e2e)
6. Tipo de commit semantico esperado

Template rapido:
- Feature:
- Porque:
- Escopo:
- Fora de escopo:
- Criterios de aceite:
- Testes:
- Commit esperado:

---

## 15) Primeiras Issues Recomendadas
- chore(setup): bootstrap extension mv3 with typescript, lint, tests
- feat(mapping): CRUD de mapeamento youtube -> twitch
- feat(chat): open twitch chat from youtube live page
- feat(chat): add preferred open mode (tab or side panel)
- test(e2e): mvp end to end user flow
- docs(architecture): document clean architecture and module boundaries

---

## 16) Riscos e Mitigacoes
- Mudancas de DOM em Twitch/YouTube:
  - Mitigacao: adaptadores isolados + testes de regressao.
- Restricoes de extensao MV3:
  - Mitigacao: validar design com prototipo tecnico cedo.
- Quebra por politicas de plataforma:
  - Mitigacao: revisar ToS e permissoes antes de publicar.

---

## 17) Decisao Inicial Recomendada
Comecar com a opcao de abrir chat em aba separada (mais simples e robusta) e, depois, evoluir para side panel com melhor UX.

Isso reduz risco tecnico no MVP e acelera entrega de valor.
