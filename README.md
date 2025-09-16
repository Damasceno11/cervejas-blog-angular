# Cervejas Blog 🍻

## 📖 Sobre o Projeto

O **Cervejas Blog** é uma aplicação web simples e funcional, criada para entusiastas do fascinante mundo das cervejas. Desenvolvido como parte da formação Full Stack **+Devs2Blu**, o projeto demonstra a aplicação de conceitos modernos de frontend com Angular, simulando um ambiente de backend de forma eficiente com JSON Server.

A plataforma permite que os usuários explorem posts sobre diferentes tipos de cerveja, filtrem conteúdo por categoria ou título e interajam com o conteúdo de maneira dinâmica.

-----

## ✨ Principais Funcionalidades

  - **Listagem e Visualização de Posts:** Navegue por uma lista de artigos sobre cervejas, ordenados por data de publicação.
  - **Pesquisa Dinâmica:** Um sistema de busca inteligente que filtra os posts por título e categoria diretamente no frontend, proporcionando uma experiência de usuário rápida e fluida.
  - **Contador de Visualizações:** Cada post possui um contador de visualizações que é incrementado a cada acesso, permitindo medir a popularidade do conteúdo.
  - **Sistema de Login Simulado:** Uma implementação de autenticação simples que valida as credenciais do usuário contra o JSON Server.
  - **Design Responsivo:** Interface construída com Angular Material, garantindo uma experiência agradável em diferentes dispositivos.
  - **Categorias com Cores Dinâmicas:** Identificação visual intuitiva das categorias de posts através de indicadores coloridos.

-----

## 🛠️ Tecnologias e Ferramentas

O projeto foi construído com as seguintes tecnologias:

| Tecnologia | Descrição |
| :--- | :--- |
| **Angular** | Framework frontend para a construção da interface e lógica do cliente. |
| **JSON Server** | Utilizado para simular uma API RESTful completa, agilizando o desenvolvimento. |
| **Angular Material** | Biblioteca de componentes de UI para um design moderno e consistente. |
| **Sass** | Pré-processador CSS para uma estilização mais organizada e poderosa. |
| **TypeScript** | Superset do JavaScript que adiciona tipagem estática ao código. |
| **npm** | Gerenciador de pacotes para o ecossistema Node.js. |

-----

## 📸 Imagens do Projeto

*Mais imagens e capturas de tela podem ser encontradas no diretório `/public/images`.*

<img width="1919" height="1074" alt="tela-principal" src="https://github.com/user-attachments/assets/dce03e68-8351-401a-a807-924a77ec8381" />

*Tela de CRUD post, pagina admin.*

<img width="1919" height="1079" alt="admin" src="https://github.com/user-attachments/assets/d29088b3-74ef-4161-896e-aa7f434eeb0e" />

*Tela de CRUD categoria, pagina admin/categories.*

<img width="1919" height="1079" alt="crud-categoria" src="https://github.com/user-attachments/assets/43ec6784-defd-429b-8aa3-86c81eabcddd" />

*Tela de detalhes de um post, mostrando o contador de views e categoria.*

<img width="1919" height="1075" alt="post" src="https://github.com/user-attachments/assets/329273e5-98df-44ad-a857-9c5b958a6336" />

*Demonstração do filtro dinâmico de posts.*

<img width="1919" height="1079" alt="pesquisadinamica" src="https://github.com/user-attachments/assets/3dc31273-af55-4ed3-a591-0c9c18cfe851" />

*Tela de Stats dos posts, pagina admin/stats.*

<img width="1919" height="1078" alt="stats" src="https://github.com/user-attachments/assets/00814027-fcda-4407-a5fa-9ab06c2c27db" />

-----

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

```bash
# 1. Clone o repositório
git clone https://github.com/Damasceno11/Cervejas-Blog.git

# 2. Navegue até o diretório do projeto
cd Cervejas-Blog

# 3. Instale as dependências do frontend
npm install

# 4. Inicie o servidor do Angular (frontend)
# O app estará disponível em http://localhost:4200/
ng serve

# 5. Em um novo terminal, inicie o JSON Server (backend)
# A API estará disponível em http://localhost:3000/
npm run server
```

-----

## 💡 Desafios de Implementação e Soluções

A construção deste projeto, mesmo em escala de aprendizado, apresentou desafios interessantes que exigiram soluções criativas e robustas.

### 1\. Filtragem de Posts no Frontend 🔍

O maior desafio foi criar uma barra de pesquisa dinâmica. A limitação do JSON Server para lidar com filtros complexos (como buscas *case-insensitive* e com normalização de acentos) nos levou a mover essa lógica para o lado do cliente.

**Solução:** A função `getPosts` no `ApiService` passou a buscar todos os posts e aplicar os filtros de categoria e busca diretamente no array retornado, garantindo uma busca precisa e flexível.

\<details\>
\<summary\>Clique para ver o código\</summary\>

```typescript
// api.service.ts
import { map } from 'rxjs/operators';
// ... outros imports

@Injectable({ providedIn: 'root' })
export class ApiService {
  // ...
  getPosts(category?: string, query?: string): Observable<Post[]> {
    let params = new HttpParams().set('_sort', 'date').set('_order', 'desc');

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params }).pipe(
      map((posts) => {
        let filteredPosts = posts;

        if (category) {
          filteredPosts = filteredPosts.filter((post) => post.category === category);
        }

        if (query) {
          const lower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          filteredPosts = filteredPosts.filter((post) =>
            post.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lower)
          );
        }
        return filteredPosts;
      }),
      catchError(this.handleError)
    );
  }
}
```

\</details\>

### 2\. Autenticação Simples com JSON Server 🔐

Simular um sistema de autenticação sem um backend real foi outro ponto crucial.

**Solução:** Implementamos uma verificação de credenciais no `ApiService`. A função `login` realiza uma requisição `GET` ao endpoint `/users` com os parâmetros de `username` e `password`. Se a API retornar um usuário, o login é bem-sucedido e os dados são salvos no `localStorage`.

\<details\>
\<summary\>Clique para ver o código\</summary\>

```typescript
// api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  // ...
  login(username: string, password: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
      .pipe(catchError(this.handleError));
  }
}
```

\</details\>

### 3\. Gerenciamento de Visualizações 📈

Para acompanhar a popularidade dos posts, era necessário incrementar o contador de visualizações de forma persistente.

**Solução:** No componente `PostDetails`, ao carregar os dados de um post, chamamos o método `updatePostViews` do `ApiService`. Este método dispara uma requisição `PATCH` para o JSON Server, atualizando apenas o campo de visualizações do post específico.

\<details\>
\<summary\>Clique para ver o código\</summary\>

```typescript
// post-details.ts
export class PostDetails implements OnInit, OnDestroy {
  // ...
  private loadPost(id: string): void {
    this.apiService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        // Atualiza visualizações
        if (this.post) {
          const newViews = (this.post.views || 0) + 1;
          this.apiService.updatePostViews(id, newViews).subscribe();
        }
      },
      error: (error) => this.handleError(error),
    });
  }
}
```

\</details\>

-----

## 👨‍💻 Desenvolvido por

\<table\>
\<tr\>
\<td align="center"\>
\<a href="[https://github.com/Damasceno11](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/Damasceno11)"\>
\<img src="[https://avatars.githubusercontent.com/u/101623334?v=4](https://www.google.com/search?q=https://avatars.githubusercontent.com/u/101623334%3Fv%3D4)" width="100px;" alt="Foto de Pedro Damasceno"/\>
\<br /\>
\<sub\>\<b\>Pedro Paulo Damasceno Muniz\</b\>\</sub\>
\</a\>
\</td\>
\</tr\>
\</table\>

📊 Contador | 💻 Analista de Sistemas em Formação

🎓 Formação Intensiva em Desenvolvimento Full Stack pelo **+Devs2Blu**

📍 Blumenau/SC - Brasil

-----

## 🙏 Agradecimentos

  - **Professor Ralf Lima:** Pela orientação e mentoria em desenvolvimento front-end e back-end.
  - **Blusoft:** Pela iniciativa e pela parceria na formação de novos talentos.
  - **Proway Cursos:** Pelo treinamento, suporte e infraestrutura.
  - **+Devs2Blu:** Pela oportunidade e pela formação intensiva de alta qualidade.
