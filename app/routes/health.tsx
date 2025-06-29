import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { healthCheck } from '../utils/monitoring';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const health = await healthCheck();
    return json(health);
  } catch (error) {
    return json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    );
  }
}; 