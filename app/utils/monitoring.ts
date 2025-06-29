import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, AppLoadContext } from '@remix-run/node';
import logger from './logger';
import { 
  register, 
  updateMemoryMetrics, 
  recordHttpRequest, 
  recordError,
  recordSearch,
  recordFavoriteAction,
  activeUsers
} from './metrics';

// Middleware de monitoramento para Remix
export const monitoringMiddleware = (request: Request, context: AppLoadContext) => {
  const start = Date.now();
  const url = new URL(request.url);
  const method = request.method;
  const pathname = url.pathname;
  
  // Log da requisição
  logger.info(`Incoming request: ${method} ${pathname}`, {
    method,
    pathname,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    timestamp: new Date().toISOString(),
  });

  // Atualizar métricas de memória
  updateMemoryMetrics();

  // Retornar função para ser chamada após o processamento da requisição
  return {
    logSuccess: (status: number) => {
      const duration = (Date.now() - start) / 1000;
      
      // Registrar métricas HTTP
      recordHttpRequest(method, pathname, status, duration);
      
      // Log da resposta
      logger.info(`Request completed: ${method} ${pathname} - ${status}`, {
        method,
        pathname,
        status,
        duration,
        timestamp: new Date().toISOString(),
      });
    },
    logError: (error: Error) => {
      const duration = (Date.now() - start) / 1000;
      
      // Registrar erro
      recordError('request_error', pathname);
      
      // Log do erro
      logger.error(`Request failed: ${method} ${pathname}`, {
        method,
        pathname,
        error: error.message,
        stack: error.stack,
        duration,
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Função para monitorar buscas
export const monitorSearch = async (query: string, queryType: string, fn: () => Promise<any>) => {
  const start = Date.now();
  
  try {
    logger.info(`Search initiated: ${queryType}`, {
      query,
      queryType,
      timestamp: new Date().toISOString(),
    });

    const result = await fn();
    const duration = (Date.now() - start) / 1000;
    
    // Registrar busca bem-sucedida
    recordSearch(queryType, 'success', duration);
    
    logger.info(`Search completed: ${queryType}`, {
      query,
      queryType,
      duration,
      resultCount: result?.items?.length || 0,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    
    // Registrar busca com erro
    recordSearch(queryType, 'error', duration);
    recordError('search_error', queryType);
    
    logger.error(`Search failed: ${queryType}`, {
      query,
      queryType,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

// Função para monitorar ações de favoritos
export const monitorFavoriteAction = async (
  action: 'add' | 'remove', 
  data: {
    link: string,
  }, 
) => {
  try {
    logger.info(`Favorite action: ${action}`, {
      action,
      timestamp: new Date().toISOString(),
    });

    // Registrar ação bem-sucedida
    recordFavoriteAction(action, 'success');
    
    logger.info(`Favorite action completed: ${action}`, {
      action,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    // Registrar ação com erro
    recordFavoriteAction(action, 'error');
    recordError('favorite_error', action);
    
    logger.error(`Favorite action failed: ${action}`, {
      action,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

// Função para monitorar usuários ativos
export const updateActiveUsers = (count: number) => {
  activeUsers.set(count);
  logger.info(`Active users updated: ${count}`, {
    activeUsers: count,
    timestamp: new Date().toISOString(),
  });
};

// Endpoint para métricas Prometheus
export const metricsLoader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const metrics = await register.metrics();
    
    logger.debug('Metrics endpoint accessed', {
      timestamp: new Date().toISOString(),
    });

    return new Response(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    logger.error('Error generating metrics', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    return json({ error: 'Failed to generate metrics' }, { status: 500 });
  }
};

// Função para health check
export const healthCheck = async () => {
  try {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime,
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
      },
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
    };

    logger.info('Health check performed', health);
    
    return health;
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
};

// Função para inicializar monitoramento
export const initializeMonitoring = () => {
  logger.info('Monitoring system initialized', {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  // Atualizar métricas de memória periodicamente
  setInterval(updateMemoryMetrics, 30000); // A cada 30 segundos

  // Log de inicialização do sistema
  logger.info('Application started', {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
}; 