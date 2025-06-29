# Google Analytics Configuration

## Configuração

O Google Analytics 4 (GA4) foi configurado na aplicação com a chave de rastreamento `G-YBNE4SR1N9`.

### Arquivos Configurados

1. **`app/root.tsx`** - Scripts do GA4 carregados no head do documento
2. **`app/utils/analytics.ts`** - Funções utilitárias para rastreamento
3. **`app/utils/useAnalytics.ts`** - Hook personalizado para facilitar o uso

## Eventos Rastreados

### Eventos Automáticos
- **Page Views**: Rastreados automaticamente em todas as páginas
- **Search Results**: Visualização de resultados de busca

### Eventos de Interação
- **Search**: Quando o usuário realiza uma busca
- **Button Clicks**: Cliques em botões (toggle sites, favorite)
- **Result Clicks**: Cliques nos resultados de busca
- **Favorite Actions**: Adicionar/remover favoritos

## Como Usar

### Funções Básicas

```typescript
import { trackEvent, trackCustomEvent, trackSearch } from '~/utils/analytics';

// Rastrear evento básico
trackEvent('click', 'button', 'submit_search');

// Rastrear evento customizado
trackCustomEvent('user_action', {
  action_type: 'download',
  file_name: 'report.pdf'
});

// Rastrear busca
trackSearch('termo de busca', 25);
```

### Hook Personalizado

```typescript
import { useAnalytics } from '~/utils/useAnalytics';

function MyComponent() {
  const { trackEvent, trackCustomEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('click', 'button', 'my_button');
  };

  return <button onClick={handleClick}>Clique aqui</button>;
}
```

## Eventos Implementados

### SearchInput
- Busca realizada
- Toggle de sites expandido/recolhido

### FavoriteButton
- Adicionar/remover favorito

### CardResult
- Clique em resultado de busca

### ResultPage
- Visualização de resultados

## Variáveis de Ambiente

Para usar uma chave diferente do GA4, crie um arquivo `.env` na raiz do projeto:

```env
GOOGLE_ANALYTICS_ID=G-YBNE4SR1N9
```

E atualize a constante `GA_TRACKING_ID` nos arquivos:
- `app/root.tsx`
- `app/utils/analytics.ts`

## Verificação

Para verificar se o GA4 está funcionando:

1. Abra o DevTools (F12)
2. Vá para a aba Network
3. Procure por requisições para `google-analytics.com` ou `googletagmanager.com`
4. Verifique se o `dataLayer` está sendo populado no console

## Próximos Passos

- Implementar rastreamento de erros
- Adicionar eventos de conversão
- Configurar goals no Google Analytics
- Implementar rastreamento de tempo na página 