const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/autonomous/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const body = await response.json();
    console.log('Autonomous attack start response:', body);
  } catch (error) {
    console.error('Failed to trigger autonomous attack:', error.message);
    process.exitCode = 1;
  }
})();

