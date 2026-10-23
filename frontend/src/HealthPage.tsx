import { useState } from 'react';

type HealthState = {
  status: 'idle' | 'loading' | 'healthy' | 'error';
  message: string;
};

const services = [
  { id: 'node', name: 'Node', endpoint: '/api/node/health' },
  { id: 'python', name: 'Python', endpoint: '/api/python/health' },
] as const;

type ServiceId = (typeof services)[number]['id'];

function HealthPage() {
  const [health, setHealth] = useState<Record<ServiceId, HealthState>>({
    node: { status: 'idle', message: 'Not checked' },
    python: { status: 'idle', message: 'Not checked' },
  });

  async function checkHealth(service: (typeof services)[number]) {
    setHealth((current) => ({
      ...current,
      [service.id]: { status: 'loading', message: 'Checking...' },
    }));

    let result: HealthState;

    try {
      const response = await fetch(service.endpoint, {
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });

      if (!response.ok) {
        result = {
          status: 'error',
          message: `Unhealthy (HTTP ${response.status})`,
        };
      } else {
        const data: unknown = await response.json();
        result =
          typeof data === 'object' &&
          data !== null &&
          'status' in data &&
          data.status === 'ok'
            ? { status: 'healthy', message: 'Healthy (ok)' }
            : { status: 'error', message: 'Unexpected health response' };
      }
    } catch (error) {
      result = {
        status: 'error',
        message:
          error instanceof Error && error.name === 'TimeoutError'
            ? 'Request timed out'
            : 'Unable to reach API',
      };
    }

    setHealth((current) => ({ ...current, [service.id]: result }));
  }

  return (
    <main className="health-page">
      <h1>API Health</h1>
      <div className="health-services">
        {services.map((service) => (
          <section
            className="health-service"
            key={service.id}
          >
            <button
              type="button"
              disabled={health[service.id].status === 'loading'}
              onClick={() => void checkHealth(service)}
              aria-describedby={`${service.id}-status`}
            >
              Check {service.name} health
            </button>
            <p
              id={`${service.id}-status`}
              role="status"
              className={`health-status ${health[service.id].status}`}
            >
              {health[service.id].message}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}

export default HealthPage;
