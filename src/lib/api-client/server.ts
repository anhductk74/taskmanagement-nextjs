export function getBackendBaseUrl(): string {
  return (
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080'
  );
}

export const serverJsonHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

