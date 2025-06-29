# Sistema de Monitoramento

Este documento descreve a estrutura de logs e métricas implementada na aplicação usando Winston e Prometheus.

## Estrutura de Arquivos

```
app/
├── utils/
│   ├── logger.ts          # Configuração do Winston
│   ├── metrics.ts         # Métricas do Prometheus
│   ├── monitoring.ts      # Sistema integrado de monitoramento
│   └── search.ts          # Funções de busca centralizadas
├── routes/
│   ├── metrics.tsx        # Endpoint para métricas Prometheus
│   ├── health.tsx         # Endpoint para health check
│   ├── search.tsx         # Rota de busca com monitoramento
│   └── result.favorite.ts # Rota de favoritos com monitoramento
└── entry.server.tsx       # Inicialização do monitoramento
```

## Logs (Winston)

### Configuração
- **Console**: Logs coloridos para desenvolvimento
- **Arquivos**: Logs estruturados em JSON para produção
- **Níveis**: error, warn, info, http, debug
- **Rotação**: Máximo 5MB por arquivo, 5 arquivos por tipo

### Arquivos de Log
- `logs/error.log`: Apenas erros
- `logs/combined.log`: Todos os logs
- `logs/http.log`: Requisições HTTP

### Exemplo de Uso
```typescript
import logger from '~/utils/logger';

logger.info('Aplicação iniciada', { 
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

logger.error('Erro na busca', {
  query: 'termo de busca',
  error: error.message,
  stack: error.stack
});
```

## Métricas (Prometheus)

### Métricas Disponíveis

#### HTTP
- `http_request_duration_seconds`: Duração das requisições
- `http_requests_total`: Total de requisições por método/rota/status

#### Busca
- `search_requests_total`: Total de buscas por tipo/status
- `search_duration_seconds`: Duração das buscas

#### Sistema
- `memory_usage_bytes`: Uso de memória (RSS, Heap, External)
- `active_users`: Número de usuários ativos
- `errors_total`: Total de erros por tipo/rota

#### Favoritos
- `favorite_actions_total`: Ações de favoritos (add/remove)

### Endpoints

#### Métricas Prometheus
```
GET /metrics
```
Retorna métricas no formato Prometheus.

#### Health Check
```
GET /health
```
Retorna status da aplicação, uso de memória e uptime.

## Monitoramento Integrado

### Funções de Monitoramento

#### `monitorSearch(query, type, fn)`
Monitora operações de busca:
- Registra início e fim da busca
- Mede duração
- Conta sucessos e erros
- Loga detalhes da operação

#### `monitorFavoriteAction(action, item, fn)`
Monitora ações de favoritos:
- Registra adição/remoção
- Conta sucessos e erros
- Loga detalhes do item

#### `recordHttpRequest(method, route, status, duration)`
Registra métricas de requisições HTTP.

#### `recordError(type, route)`
Registra erros para análise.

### Middleware de Monitoramento

O middleware `monitoringMiddleware` é aplicado automaticamente e:
- Loga todas as requisições
- Registra métricas de duração
- Atualiza métricas de memória
- Captura e loga erros

## Configuração

### Variáveis de Ambiente
```bash
NODE_ENV=production  # Define nível de log
GOOGLE_API_KEY=xxx   # Chave da API Google
GOOGLE_API_CX=xxx    # ID do Custom Search Engine
```

### Diretório de Logs
Crie o diretório `logs/` na raiz do projeto:
```bash
mkdir logs
```

## Visualização

### Prometheus
Configure o Prometheus para coletar métricas do endpoint `/metrics`:

```yaml
scrape_configs:
  - job_name: 'google-search-toolbox'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

### Grafana
Importe dashboards para visualizar:
- Taxa de requisições HTTP
- Duração das buscas
- Uso de memória
- Erros por tipo
- Ações de favoritos

## Alertas Recomendados

### Prometheus Alert Rules
```yaml
groups:
  - name: google-search-toolbox
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.1
        for: 2m
        
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 2
        for: 5m
        
      - alert: HighMemoryUsage
        expr: memory_usage_bytes{type="heapUsed"} / memory_usage_bytes{type="heapTotal"} > 0.8
        for: 5m
```

## Manutenção

### Limpeza de Logs
Os logs são rotacionados automaticamente, mas você pode limpar manualmente:
```bash
# Limpar logs antigos (mais de 30 dias)
find logs/ -name "*.log" -mtime +30 -delete
```

### Backup de Métricas
Para backup das métricas:
```bash
curl http://localhost:3000/metrics > metrics_backup.txt
```

## Troubleshooting

### Logs não aparecem
1. Verifique se o diretório `logs/` existe
2. Confirme permissões de escrita
3. Verifique `NODE_ENV` para nível de log

### Métricas não funcionam
1. Verifique se `prom-client` está instalado
2. Confirme se o endpoint `/metrics` responde
3. Verifique logs de erro no console

### Performance
- Logs são assíncronos e não bloqueiam a aplicação
- Métricas são otimizadas para baixo overhead
- Use `logger.debug()` apenas em desenvolvimento 