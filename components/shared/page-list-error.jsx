import { Button } from '@/components/catalyst/button';

function getErrorMessage(error) {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return {
      title: 'Problem z bazą danych',
      message: 'Sprawdź połączenie z internetem lub spróbuj ponownie za chwilę.',
      actionText: 'Spróbuj ponownie'
    };
  }
  
  if (errorMessage.includes('failed to fetch')) {
    return {
      title: 'Problem z połączeniem',
      message: 'Nie udało się nawiązać połączenia z serwerem.',
      actionText: 'Odśwież stronę'
    };
  }
  
  return {
    title: 'Wystąpił nieoczekiwany błąd',
    message: 'Odśwież stronę lub skontaktuj się z administratorem.',
    actionText: 'Spróbuj ponownie'
  };
}

export function PageListError({ error, searchParams, basePath }) {
  const errorInfo = getErrorMessage(error);
  const hasFilters = Object.values(searchParams || {}).some(value => value && value !== '');
  
  // Build current URL with filters
  const currentUrl = hasFilters 
    ? `${basePath}?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(searchParams).filter(([_, value]) => value && value !== '')
        )
      )}` 
    : basePath;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="size-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg className="size-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {errorInfo.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {errorInfo.message}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href={currentUrl}>
            {errorInfo.actionText}
          </Button>
          <Button plain href={basePath}>
            Wyczyść filtry
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
              Szczegóły błędu (dev)
            </summary>
            <div className="mt-2 text-xs text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 p-3 rounded border overflow-auto">
              {error.message}
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}