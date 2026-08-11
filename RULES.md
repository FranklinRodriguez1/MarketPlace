# Reglas de diseño — Cerca

Fuente: paleta y tokens exportados desde Stitch. Cualquier vista nueva (o rediseño de una existente) debe seguir esto por defecto, salvo que se indique lo contrario explícitamente.

## Paleta de colores

| Token     | Hex       | Uso                                                              |
|-----------|-----------|-------------------------------------------------------------------|
| Primary   | `#2F6690` | Acciones principales, elementos activos/seleccionados, marca      |
| Secondary | `#DEDBD1` | Botones secundarios, fondos suaves, superficies neutras cálidas   |
| Tertiary  | `#B23B2E` | Alertas, estados destructivos (eliminar), acentos de error        |
| Neutral   | `#F2F1EC` | Fondo base de pantallas y tarjetas (en vez de blanco puro)        |

Cada token tiene además una escala de tonos (oscuro → claro) para estados hover/pressed/disabled y variaciones de texto sobre el color; no se fijan hex exactos por paso, se generan a partir del color base.

## Tipografía

- **Headline** (títulos): `Space Grotesk`
- **Body** (texto de párrafo): `Inter`
- **Label** (etiquetas, botones, campos): `Inter`

> Nota: el proyecto hoy usa fuentes de sistema (`src/constants/theme.ts` → `Fonts`), no `Space Grotesk`/`Inter` como fuentes cargadas. Para adoptar esto habría que instalar `@expo-google-fonts/space-grotesk` y `@expo-google-fonts/inter` y cargarlas con `expo-font`. Mientras tanto, usar la fuente de sistema como fallback más cercano (sans, peso similar).

## Botones — 4 variantes

1. **Primary** — fondo `Primary` (#2F6690), texto blanco. Acción principal de la pantalla.
2. **Secondary** — fondo `Secondary`/neutral claro, texto oscuro. Acción alternativa.
3. **Inverted** — fondo negro/oscuro, texto blanco. Para contextos sobre fondos claros donde se quiere máximo contraste.
4. **Outlined** — fondo transparente o `Neutral`, borde visible, texto oscuro. Acción de bajo énfasis.

Esquinas redondeadas consistentes (~10–12px), padding horizontal generoso, altura táctil ≥ 44–48px.

## Otros patrones de UI observados

- **Buscador**: input tipo *pill*/rounded, ícono de lupa a la izquierda, fondo `Neutral`, sin borde marcado.
- **Barra de navegación / tabs**: contenedor redondeado con íconos circulares; el ítem activo tiene fondo `Primary` con ícono blanco, los inactivos quedan neutros.
- **Barras de progreso**: delgadas, extremos redondeados, color según estado (`Primary` = progreso normal, neutro = pendiente, `Tertiary` = error/riesgo).
- **Botones de ícono circulares**: para acciones puntuales (editar, eliminar, generar, etc.), color según semántica: `Primary`/neutro = acción normal, `Tertiary` = acción destructiva (ej. eliminar).
- **Tarjetas/contenedores**: fondo `Neutral`, esquinas redondeadas (~16px), sin sombras marcadas — el contraste de color hace el trabajo visual.

## Cómo aplicar esto al escribir código

- **`src/constants/theme.ts` es la implementación canónica de esta paleta.** No hardcodear hex sueltos en una vista o feature — usar siempre `useTheme()` (`src/hooks/use-theme.ts`) junto con `ThemedView`/`ThemedText` (`src/components/`).
- Mapeo de tokens de esta tabla → claves de `Colors` en `theme.ts`:
  - `Primary` → `primary`
  - `Secondary` → `secondary` y `border` (bordes de inputs/tarjetas)
  - `Tertiary` → `danger` (estados de error/destructivos)
  - `Neutral` → `background` (fondo de pantalla)
  - `surface` (`#FFFFFF` en claro) → token nuevo para tarjetas/elementos flotantes sobre el fondo neutral (ej. el card de login/register). No estaba en la tabla original de Stitch, se agregó para poder diferenciar fondo de pantalla vs. superficie elevada.
  - `backgroundElement` / `backgroundSelected` → variaciones del fondo para chips, tags, filas seleccionadas — no vienen de la captura, son derivadas.
- Los botones deben mapear siempre a una de las 4 variantes de arriba, no crear variantes ad-hoc.
- Mantener el radio de borde consistente entre inputs, botones y tarjetas.
- El fondo por defecto de una pantalla es `Neutral` (#F2F1EC), no blanco puro, salvo que la pantalla lo pida explícitamente.
- El texto blanco fijo (`#FFFFFF`) sobre botones de color primario/danger es válido tal cual (no es un token de tema, es contraste fijo).
- **Modo oscuro**: la captura de Stitch solo definía la paleta clara. Los valores de `Colors.dark` en `theme.ts` son una derivación razonable (mismas relaciones de tono que existían antes) hecha por Claude, no vienen de ningún mockup — si en algún momento se define un modo oscuro real, hay que reemplazarlos explícitamente.
