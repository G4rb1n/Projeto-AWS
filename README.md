# PM3 - Grupo 6 - ZadInventory

## Arquitetura
- **VM1 - Frontend** (Nginx + Angular)
- **VM2 - Backend** (Spring Boot + Docker)
- **VM3 - Banco** (MariaDB + Keycloak)

## Pré-requisitos
- Docker e Docker Compose em cada VM
- Java 17 + Maven (para compilar o backend)
- Node.js 18+ e Angular CLI (para compilar o frontend)
- Certificados SSL wildcard

## Configuração dos IPs

Atualize os IPs nos arquivos abaixo antes de subir:

| Arquivo | O que mudar |
|---|---|
| `backend/docker-compose.yml` | IP do banco no SPRING_DATASOURCE_URL |
| `backend/docker-compose.yml` | Domínio no JWT_ISSUER_URI |
| `banco/docker-compose.yml` | IP do banco no KC_DB_URL_HOST |
| `frontend/default.conf` | IP do backend no proxy_pass /api/ |
| `frontend/default.conf` | IP do banco no proxy_pass /realms/ |
| `backend/src/.../SecurityConfig.java` | IP do banco no jwkSetUri |

Adicione no `/etc/hosts` de cada VM e do cliente:
```
IP_VM_FRONTEND    sistema1.net sistema2.net
IP_VM_BANCO       auth.projeto.local
```

## Subindo o projeto

### 1. VM3 - Banco (subir primeiro)
```bash
cd banco
docker compose up -d
```

### 2. VM2 - Backend
```bash
# Compile
cd backend
mvn clean package -DskipTests

# Copie o .war para a VM
scp target/zadinventory-0.0.1-SNAPSHOT.war user@IP_VM_BACKEND:/opt/backend/zadinventory-0.0.1-SNAPSHOT.jar

# Na VM do backend
cd /opt/backend
docker compose up -d
```

### 3. VM1 - Frontend
```bash
# Compile
cd frontend
npm install
npm run build

# Copie o dist para a VM
scp -r dist/zadinventory-frontend/browser/* user@IP_VM_FRONTEND:/var/www/localhost/htdocs/dist/zadinventory-frontend/browser/

# Na VM do frontend
docker compose up -d
```

## Keycloak
Acesse `http://IP_VM_BANCO:8080/admin` com `admin/admin` e configure:
- Realm: `zadinventory`
- Client: `zadinventory-frontend`
- Valid Redirect URIs: `https://sistema1.net/*`
- Web Origins: `https://sistema1.net`

## Usuários
| Tipo | Role Keycloak |
|---|---|
| Administrador | GERENTE |
| Usuário Limitado | FUNCIONARIO |
| Exclusivo Sistema 1 | SISTEMA1 |
| Exclusivo Sistema 2 | SISTEMA2 |