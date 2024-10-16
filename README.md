# Travel Expense Planner PWA

## Descrição

Trabalho de conclusão da disciplina **Arquitetura para Aplicações Móveis** de pós graduação em Arquitetura de sistemas distribuidos.

Este projeto é uma aplicação web progressiva (PWA) para controle e planejamento de despesas de viagem. O objetivo é fornecer uma experiência semelhante a de um aplicativo nativo, mas utilizando tecnologias web como **HTML**, **CSS** e **JavaScript**, tornando-o leve e acessível em diversos dispositivos como **Smartphones**, **Tablets** e **iPads**.

O aplicativo permite ao usuário gerenciar as despesas de uma única viagem, exibindo uma visão geral dos gastos e convertendo automaticamente o valor da moeda de origem para a moeda de destino (ex.: BRL para USD) utilizando a **Exchangerate-API**.

## Funcionalidades

- Adicionar despesas com descrição, quantidade, valor, moeda de origem e valor convertido.
- Editar despesas diretamente da lista ao clicar no ícone de lápis, carregando os dados no formulário.
- Excluir despesas ao clicar no ícone de lixeira.
- Atualização dinâmica da lista de despesas, com suporte a **scrollView** à medida que os itens são adicionados.
- Exibição do total de despesas no rodapé da página.
- Suporte para instalação do PWA diretamente na barra de endereço do navegador.
- Responsividade para uso em dispositivos móveis e desktops.

## Tecnologias Utilizadas

- **HTML**: Estrutura básica do aplicativo.
- **CSS**: Estilos e layout responsivo.
- **JavaScript**: Lógica do aplicativo.
- **API de Conversão de Moeda**: [Exchangerate-API](https://www.exchangerate-api.com/)
  - URL da API: `https://api.exchangerate-api.com/v4/latest/${currencyFrom}`

## Como Funciona

1. O usuário cadastra uma despesa, fornecendo a descrição, quantidade, valor e moeda de origem.
2. O aplicativo consulta a API de conversão de moedas para calcular o valor convertido.
3. A lista de despesas é atualizada dinamicamente e exibida na tela principal.
4. O usuário pode editar ou excluir despesas da lista.
5. O total das despesas é exibido no rodapé da página.

## Instalação do PWA

Para instalar o PWA, o ícone de instalação aparecerá automaticamente na barra de endereço do navegador. Basta clicar nele para adicionar um atalho na área de trabalho ou na tela inicial do dispositivo.

## Hospedagem

Este projeto está hospedado no Netlify, uma plataforma de hospedagem estática com suporte a CI/CD. Para visualizar o projeto publicado, acesse o seguinte link:

> TODO: AJUSTAR APÓS A PUBLICAÇÃO [Exemplo do App Publicado](https://main--serene-salmiakki-4d8c53.netlify.app/)

## Como Executar o Projeto Localmente
Siga os passos abaixo para configurar e executar o projeto localmente em sua máquina:

1. Clone o repositório para sua máquina:

Primeiro, faça o clone do repositório Git para o seu ambiente local, usando o seguinte comando no terminal:

```bash
git clone https://github.com/seu-usuario/travel-expense-planner.git
```

2. Abra o projeto na sua IDE:

Após clonar o repositório, navegue até a pasta do projeto e abra-o em sua IDE preferida. Recomendamos o [Visual Studio Code](https://code.visualstudio.com/download) por sua simplicidade e ótimo suporte para desenvolvimento web.

3. Instale o plugin [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):

No Visual Studio Code, instale a extensão Live Server, que facilita a execução de arquivos HTML diretamente no navegador.
 - No VS Code, vá até a aba de extensões (ícone de quadrado no menu lateral).
 - Pesquise por "Live Server".
 - Clique em Instalar.

4. Execute o projeto com o Live Server:

Com o Live Server instalado, clique com o botão direito do mouse no arquivo **index.html** na aba de Explorador de Arquivos do VS Code e selecione a opção **Open with Live Server**. Isso abrirá a aplicação automaticamente em seu navegador padrão.

5. Acesse o aplicativo no navegador:

A aplicação será carregada em uma nova aba do navegador no endereço:

```bash
http://localhost:5501/index.html
```
Qualquer alteração feita no código será refletida automaticamente no navegador sem a necessidade de recarregar a página.