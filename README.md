# Valtor - leitor de capítulos

Este projeto é um site estático para publicar capítulos ilustrados, sem banco de dados.

## Como adicionar um novo capítulo

1. Crie uma pasta para as imagens do capítulo.

   Exemplo:

   ```text
   Capitulos/Capitulo-02/
   ```

2. Coloque as páginas numeradas em ordem dentro da pasta.

   Exemplo:

   ```text
   Capitulos/Capitulo-02/1.png
   Capitulos/Capitulo-02/2.png
   Capitulos/Capitulo-02/3.png
   ```

3. Abra `script.js` e adicione um novo item no array `chapters`.

   Modelo:

   ```js
   {
     id: "capitulo-02",
     number: "Capítulo II",
     title: "Nome do capítulo",
     world: "Local ou arco",
     description: "Resumo curto exibido no topo do leitor.",
     folder: "Capitulos/Capitulo-02",
     pages: 18,
     extension: "png",
     format: "HQ",
     tone: "Valtor",
   }
   ```

4. Ajuste `pages` para a quantidade total de imagens e `extension` para o tipo do arquivo, como `png`, `jpg` ou `webp`.

## Estrutura recomendada

```text
index.html
styles.css
script.js
Ilustrações/
Capitulos/
  Capitulo-02/
  Capitulo-03/
```