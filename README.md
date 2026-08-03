# ZadInventory

Sistema de controle de estoque: **Angular** (frontend) + **Spring Boot** (backend) + **MySQL**.

O backend roda como **container único**: um jar executável com Tomcat embutido, pronto para
deploy no **AWS Elastic Beanstalk** com o banco no **RDS**. Toda a configuração sensível vem
de variáveis de ambiente — não há credencial no código.

## Arquitetura

| Componente | Tecnologia | Observação |
|---|---|---|
| Frontend | Angular + Nginx | build estático servido pelo Nginx |
| Backend | Spring Boot 3.5 (Java 17), jar com Tomcat embutido | container único, porta 8080 |
| Banco | MySQL 8.0 | RDS em produção, container no teste local |
| Autenticação | JWT próprio (`JwtAuthenticationFilter` + `JwtService`) | login em `POST /api/auth/login` |

## Variáveis de ambiente

Obrigatórias para o backend subir — sem elas a aplicação falha no start:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_HOST` | Host do MySQL | `zadinventory.xxxx.us-east-1.rds.amazonaws.com` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_NAME` | Nome do database | `zadinventory` |
| `DB_USER` | Usuário do banco | `admin` |
| `DB_PASSWORD` | Senha do banco | *(defina no ambiente, nunca no código)* |
| `JWT_SECRET` | Chave de assinatura do JWT, em **Base64**, com no mínimo 32 bytes | *(gere uma por ambiente)* |
| `CORS_ORIGINS` | Origens liberadas no CORS, separadas por vírgula | `https://app.exemplo.com,http://localhost:4200` |

Gerando um `JWT_SECRET` válido:

```bash
openssl rand -base64 32
```

## Teste local (Docker)

Sobe MySQL 8.0 + backend na mesma rede:

```bash
cd backend
docker compose up --build
```

A API fica em `http://localhost:8080`. Os valores default do `docker-compose.yml` são
**apenas para desenvolvimento local**; sobrescreva-os com um arquivo `.env` (já ignorado
pelo Git) se quiser outros.

## Build do backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/zadinventory-0.0.1-SNAPSHOT.jar
```

O jar é autocontido (Tomcat embutido) — não precisa de Tomcat externo nem de deploy de `.war`.

## Deploy — Elastic Beanstalk + RDS

1. **RDS**: crie uma instância MySQL 8.0 e anote endpoint, database, usuário e senha.
2. **Source bundle**: gere um zip com o conteúdo da pasta `backend/` (o `Dockerfile` precisa
   ficar na raiz do zip):
   ```bash
   cd backend
   zip -r ../zadinventory-backend.zip . -x "target/*" ".git/*"
   ```
3. **Elastic Beanstalk**: crie um ambiente com a plataforma **Docker** e faça upload do zip.
   O EB constrói a imagem pelo `Dockerfile` e publica o container na porta 8080.
4. **Configuração → Updates, monitoring, and logging → Environment properties**: cadastre
   todas as variáveis da tabela acima.
5. **Security group**: libere a porta 3306 do RDS para o security group do ambiente EB.

## Frontend

```bash
cd frontend
npm install
npm run build
```

O build sai em `dist/zadinventory-frontend/browser/`. O `frontend/default.conf` é a config do
Nginx e ainda aponta para os IPs do ambiente antigo — ajuste o `proxy_pass` de `/api/` para a
URL do ambiente Elastic Beanstalk antes de publicar.

## Usuários

| Tipo | Role |
|---|---|
| Administrador | `ROLE_GERENTE` |
| Usuário limitado | `ROLE_FUNCIONARIO` |

## Pasta `banco/`

Mantida como referência do ambiente antigo (MariaDB + Keycloak em VMs). **Não é usada** na
arquitetura de container único — em produção o banco é o RDS, e no teste local é o serviço
`mysql` do `backend/docker-compose.yml`.
