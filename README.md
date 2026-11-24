# Fichas Tecnicas Casa Do Sertao

Crie uma aplicação web moderna e completa de Gestão de Fichas Técnicas de Produção para uma indústria de panificação ("Casa do Sertão").

### 1. Identidade Visual e Branding
- **Logo da Empresa**: Inclua a logo da "Casa do Sertão" no cabeçalho/menu lateral da aplicação (mantendo os tons terrosos/marrom característicos da marca).
- **Design System**: Interface limpa, profissional, intuitiva e responsiva (utilizando Tailwind CSS e Shadcn UI), com paleta de cores acolhedora que remeta à panificação artesanal/industrial (tons de marrom, bege, creme e branco).

### 2. Categorização e Organização
- O sistema deve permitir organizar, filtrar e cadastrar fichas técnicas nas seguintes categorias fixas (com opção de filtro rápido por abas ou cards):
  1. **Bolos Fofos**
  2. **Bolos Ligados**
  3. **Biscoitos**
  4. **Rocamboles**
  5. **Recheios**
  6. **Diversos**
- Barra de busca rápida pelo nome do produto/receita ou ingrediente.

### 3. Cadastro e Edição de Ficha Técnica (Formulário Completo)
Crie um formulário intuitivo para adicionar e editar receitas contendo os seguintes campos:
- **Informações Básicas**:
  - Nome do Produto / Receita.
  - Seleção da Categoria (Bolos Fofos, Bolos Ligados, Biscoitos, Rocamboles, Recheios, Diversos).
  - **Upload de Imagem do Produto**: Campo para anexar e visualizar a foto do produto pronto.
- **Rendimento e Medidas**:
  - Campo numérico para o **Rendimento** (ex: 10, 50, 12.5).
  - Seleção de **Unidade de Medida do Rendimento** (ex: Unidades, Kg, Gramas, Formas, Assadeiras, Litros).
- **Lista Dinâmica de Matérias-Primas (Ingredientes)**:
  - Botão para *"+ Adicionar Matéria-Prima"*, permitindo inserir múltiplas linhas com:
    - Nome do Ingrediente / Matéria-Prima.
    - Quantidade.
    - Unidade de Medida (ex: Kg, g, L, ml, Unidades, Colheres).
  - Possibilidade de reordenar ou remover ingredientes facilmente.
- **Modo de Preparo e Equipamentos**:
  - Campo de texto estruturado/rico para **Utensílios e Equipamentos Utilizados** (ex: batedeira planetária, forma específica, temperatura e tempo de forno).
  - Campo de texto detalhado (ou passo a passo numerado) para a **Forma de Preparo**.

### 4. Visualização, Impressão e Exportação em PDF
- **Tela de Visualização da Ficha Técnica**: Ao clicar em uma receita cadastrada, abrir uma visualização limpa e formatada como um documento padrão de produção industrial (mostrando cabeçalho com logo da Casa do Sertão, foto do produto, categoria, rendimento, tabela organizada de matérias-primas, utensílios e modo de preparo).
- **Impressão e PDF**:
  - Incluir botões em destaque na visualização da ficha: **"Imprimir Ficha"** (acionando layout otimizado para impressão `@media print`, ocultando menus e botões desnecessários) e **"Gerar PDF"** (exportando a ficha técnica formatada em A4 pronta para arquivamento ou envio para a equipe de produção).

### 5. Armazenamento e Dados Iniciais
- Configure o armazenamento local (LocalStorage) ou integração com banco de dados (Supabase, se disponível) para que as receitas fiquem salvas, além de incluir 2 ou 3 receitas de exemplo pré-cadastradas (como *Rocambole de Chocolate* e *Bolo de Macaxeira*) para demonstrar o funcionamento imediato do sistema.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fichas-tecnicas-casa-do-sertao.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d307540a-f93f-42da-b54f-5d0757c4ecc1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
