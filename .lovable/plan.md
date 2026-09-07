# Nova página — Instituto Cultural Tradição Makumba Brasil

Página única, escura e ancestral (preto, dourado, vermelho profundo), com seções bem separadas e um encadeamento que puxa o leitor de uma para a outra.

## Estrutura da página

1. **Topo (abertura)**
   - Foto do Tatá Rogério em destaque, sobre fundo escuro com brilho dourado suave.
   - Nome da casa, uma frase forte de abertura e um botão de WhatsApp.

2. **Quem Somos**
   - O texto atual reescrito com mais força e ritmo, em blocos curtos e legíveis.

3. **Nossa Missão**
   - Três pontos destacados: guardar e resgatar as tradições, aprimoramento humano pela ancestralidade, ensinamentos e medicinas.

4. **As Vertentes**
   - Um cartão para cada uma: Makumba Carioca, Quimbanda, Culto Tradicional Yorùbá, Bruxaria Tradicional Ibero Celta, Hoodoo e Pajelança.
   - Cada cartão com uma linha curta de descrição, respeitando que são cultuadas em separado.

5. **O Dirigente — Tatá Rogério**
   - Foto e apresentação dele como dirigente da casa.

6. **Contato**
   - Botão grande de WhatsApp: 13 99727-4710.
   - Rodapé com o nome do instituto.

## Detalhes visuais

- Fundo quase preto, dourado como destaque, vermelho profundo em detalhes.
- Tipografia com título de presença marcante e texto de leitura confortável.
- Entradas suaves ao rolar a página e leve reação ao passar o mouse nos cartões — sem exageros.
- Feito para celular primeiro, funcionando bem também no computador.

## Sobre os textos

Vou escrever os textos das vertentes e a apresentação do Tatá Rogério a partir do que já existe no site. Se algum detalhe da história dele ou de uma vertente estiver errado, você me diz e eu ajusto — não vou inventar datas, endereço ou horários.

## Detalhes técnicos

- Reescrever `src/routes/index.tsx` como a página completa, com componentes de seção em `src/components/`.
- Tokens de cor/tipografia definidos em `src/styles.css` (`@theme` + `:root`), sem cores fixas nos componentes.
- Foto enviada publicada via `lovable-assets` e importada pelo ponteiro `.asset.json`.
- Fontes carregadas por `<link>` no `src/routes/__root.tsx`.
- `head()` próprio na rota inicial: título, descrição e og/twitter específicos do instituto.
