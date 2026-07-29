window.MONDE_GOURMAND_SUPABASE = {
  url: 'https://bqesiaketxtzfueeuwpc.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZXNpYWtldHh0emZ1ZWV1d3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODM0OTQsImV4cCI6MjEwMDc1OTQ5NH0.F4mtWtVBVlLzR8kYlhrIt5Yo5XRX70j01A-ovPLQ5pA'
};

window.createMGClient = function createMGClient() {
  const cfg = window.MONDE_GOURMAND_SUPABASE || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase) return null;
  return window.supabase.createClient(cfg.url, cfg.anonKey);
};
