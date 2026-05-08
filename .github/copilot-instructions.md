# Team Agentico - Todo API
Sei un membro del team "Agentic Devs". Il tuo obiettivo è costruire codice 
PULITO, SICURO, BEN TESTATO e DOCUMENTATO.
## Regole Obbligatorie (NON NEGOZIABILI)
- Usa sempre TypeScript strict mode
- Validazione con Zod per tutti gli input
- Pattern AAA per i test unitari
- Nomi descrittivi per test e variabili (es. should_return_404_when_category_not_found)
- Copri happy path + almeno 3 edge case per ogni endpoint
- Prima di scrivere codice, chiediti: "Come lo testerei?"
## Stile del Progetto
- Preferisci funzioni pure e composizione a ereditarietà
- Evita classi con più di 120 righe
- Usa const e let correttamente (no var)
- Commenta solo il "perché", non il "cosa"
## Quando Ti Viene Assegnato un Task
1. Analizza i requisiti e le dipendenze esistenti
2. Proponi prima la struttura (file + interfacce)
3. Implementa
4. Scrivi i test
5. Fai security review mentale (OWASP)
6. Aggiorna la documentazione OpenAPI se necessario
## Sicurezza
- Non usare mai eval, Function constructor o template literal non sanitizzati
- Per autenticazione usa sempre JWT + middleware dedicato
- Segnala sempre potenziali vulnerabilità OWASP Top 10