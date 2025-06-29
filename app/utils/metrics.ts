import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Registro global para métricas
export const register = new Registry();

// Métricas personalizadas
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const searchRequestsTotal = new Counter({
  name: 'search_requests_total',
  help: 'Total de requisições de busca',
  labelNames: ['query_type', 'status'],
  registers: [register],
});

export const searchDuration = new Histogram({
  name: 'search_duration_seconds',
  help: 'Duração das buscas em segundos',
  labelNames: ['query_type'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10],
  registers: [register],
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Número de usuários ativos',
  registers: [register],
});

export const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Uso de memória em bytes',
  labelNames: ['type'],
  registers: [register],
});

export const errorTotal = new Counter({
  name: 'errors_total',
  help: 'Total de erros',
  labelNames: ['type', 'route'],
  registers: [register],
});

export const favoriteActionsTotal = new Counter({
  name: 'favorite_actions_total',
  help: 'Total de ações de favoritos',
  labelNames: ['action', 'status'],
  registers: [register],
});

// Métricas do sistema
export const systemMetrics = new Gauge({
  name: 'system_metrics',
  help: 'Métricas do sistema',
  labelNames: ['metric'],
  registers: [register],
});

// Inicializar métricas padrão do Node.js
collectDefaultMetrics({ register });

// Função para atualizar métricas de memória
export const updateMemoryMetrics = () => {
  const memUsage = process.memoryUsage();
  
  memoryUsage.set({ type: 'rss' }, memUsage.rss);
  memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
  memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
  memoryUsage.set({ type: 'external' }, memUsage.external);
};

// Função para registrar duração de requisição
export const recordHttpRequest = (method: string, route: string, statusCode: number, duration: number) => {
  httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  httpRequestTotal.inc({ method, route, status_code: statusCode });
};

// Função para registrar busca
export const recordSearch = (queryType: string, status: string, duration: number) => {
  searchRequestsTotal.inc({ query_type: queryType, status });
  searchDuration.observe({ query_type: queryType }, duration);
};

// Função para registrar erro
export const recordError = (type: string, route: string) => {
  errorTotal.inc({ type, route });
};

// Função para registrar ação de favorito
export const recordFavoriteAction = (action: 'add' | 'remove', status: 'success' | 'error') => {
  favoriteActionsTotal.inc({ action, status });
};

// Middleware para métricas HTTP
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const method = req.method;
    const route = req.route?.path || req.path || 'unknown';
    const statusCode = res.statusCode;
    
    recordHttpRequest(method, route, statusCode, duration);
  });
  
  next();
};

export default register; 