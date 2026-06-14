# Painel Pessoal Jonata

Painel pessoal em HTML, CSS e JavaScript puro para organizar rotina, tarefas, compras, financas, agenda e ideias.

## Como abrir

Abra o arquivo `index.html` no navegador.

## Arquivos principais

- `index.html`: estrutura das telas e secoes.
- `styles.css`: visual do painel.
- `script.js`: dados locais, interacoes, calculos e persistencia no navegador.
- `supabase-config.js`: configuracao da URL e anon key do Supabase.
- `supabase-schema.sql`: tabela e politicas de seguranca para salvar online.

## Estado atual

- Visao geral com metricas.
- Anotacoes rapidas.
- Tarefas e pendencias.
- Rotina diaria.
- Area pessoal com dados importantes, metas e documentos/links.
- Lista de compras.
- Coisas a comprar com prioridade, valor previsto e loja/link.
- Financeiro com custos fixos, variaveis, entradas, saidas e saldo.
- Agenda com compromissos, lembretes e prazos.
- Busca global.
- Resumo de hoje.
- Modulos reservados para crescer depois.

Os dados ficam salvos no proprio navegador usando armazenamento local.

## Salvar online com Supabase

1. Rode o SQL de `supabase-schema.sql` no Supabase.
2. Preencha `supabase-config.js` com a URL e anon key do projeto.
3. Abra o painel e clique em `Entrar`.

Quando estiver logado, o painel sincroniza o estado online por usuario.
