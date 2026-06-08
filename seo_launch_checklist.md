# Lista de Verificación de Lanzamiento SEO (seo_launch_checklist.md) - VentajaBets

Usa esta lista de verificación técnica antes de subir la carpeta final a producción para garantizar el correcto posicionamiento y la indexabilidad orgánica en Google.

---

## 1. Verificaciones de Meta Tags y Contenido
- [ ] **Títulos Únicos:** Verificar que cada una de las 20 páginas indexables tiene un tag `<title>` menor a 60 caracteres y que incluye la palabra clave principal + la marca "VentajaBets".
- [ ] **Descripciones de Meta:** Comprobar que cada página tiene una `<meta name="description">` de entre 140 y 160 caracteres, con un llamado a la acción claro y el tono pícaro y vendedor característico.
- [ ] **Etiquetas de Canonical:** Comprobar en el código fuente de cada archivo HTML que la etiqueta `<link rel="canonical" href="https://ventajabets.com/nombre-pagina.html">` apunta a su propia URL y no hay URLs cruzadas (especialmente entre `calculadora-surebets.html` y `calculadora-arbitraje-apuestas.html`).
- [ ] **Contenido Visible (No Flaco):** Verificar que todas las páginas nuevas superan las 700 palabras de contenido educativo de valor y que no contienen párrafos duplicados o autogenerados a ciegas.

---

## 2. Marcado Estructurado (JSON-LD Schema)
- [ ] **Esquema FAQPage:** Verificar con la herramienta oficial de Google Rich Results Test que el marcado de preguntas frecuentes (`FAQPage`) de cada landing page coincide exactamente con las preguntas y respuestas visibles en el HTML del sitio.
- [ ] **Esquema BreadcrumbList:** Validar que los breadcrumbs estructurados corresponden al flujo jerárquico real (`Inicio > Trucos > [Página]`).
- [ ] **Esquema Product y Course:** Validar en `sistema.html` que los datos de precio (`$69.900 COP`) y moneda (`COP`) no contienen caracteres especiales de formato en el campo `"price": "69900"`.
- [ ] **Cero Búsquedas Internas:** Asegurar que no hay etiquetas `SearchAction` ya que no tenemos un endpoint funcional de búsqueda.

---

## 3. Crawlability & Indexabilidad
- [ ] **Sitemap.xml:** Comprobar que el archivo `sitemap.xml` contiene exactamente 21 URLs (el dominio raíz y los 20 archivos HTML indexables) y que **no** incluye a `404.html`.
- [ ] **Robots.txt:** Confirmar que `robots.txt` no bloquea ninguna ruta crítica de assets como `/assets/`, `styles.css` o `scripts.js`.
- [ ] **Página de Error 404:** Escribir una URL no existente en tu servidor local (ej: `/pagina-falsa`) y comprobar que carga el diseño de `404.html` con la barra legal superior, el footer simplificado y los enlaces directos a las calculadoras principales.
- [ ] **Barra de Advertencia Legal:** Confirmar que la barra legal de edad se muestra en la parte superior de todas las páginas de la suite de manera discreta y sin errores en dispositivos móviles.

---

## 4. Google Search Console & Analytics
- [ ] **Propiedad en Search Console:** Registrar el dominio `https://ventajabets.com/` en Google Search Console.
- [ ] **Envío de Sitemap:** Enviar el enlace de `sitemap.xml` para acelerar el descubrimiento y la indexación de las 12 nuevas páginas de captación orgánica.
- [ ] **Inspección de URLs:** Inspeccionar manualmente `calculadora-surebets.html` y `calculadora-arbitraje-apuestas.html` una vez desplegadas para verificar la correcta renderización móvil.

---

## 5. Configuración Comercial Multi-País y Afiliaciones
- [ ] **Crear producto en Hotmart:** Configurar el infoproducto "VentajaBets Pro - Acceso de por Vida" en Hotmart. Establecer el precio base en 17 USD (o equivalente en tu moneda) y activar la entrega automática.
- [ ] **Pegar checkout de Hotmart:** Copiar el enlace de pago de Hotmart y pegarlo en la propiedad `checkoutUrlGlobal` del archivo `site-config.js`.
- [ ] **Crear link de Mercado Pago (Colombia):** Si deseas dar soporte de pago local con PSE en Colombia, genera un enlace o preferencia de pago por $69.900 COP en Mercado Pago Colombia y pégalo en la propiedad `checkoutUrlCO` de `site-config.js`.
- [ ] **Aplicar a AfiliaGo:** Registrarse en AfiliaGo para obtener campañas de apuestas para España y Latinoamérica (Bet365, Caliente, Betano, Codere, etc.).
- [ ] **Aplicar a Codere Partners:** Registrarse directamente en Codere Partners para obtener enlaces de afiliación específicos para Colombia, México y España.
- [ ] **Aplicar a NetHive / Wplay:** Obtener tus códigos de seguimiento de NetHive para enlazar Wplay en Colombia.
- [ ] **Configurar links por país:** Pegar todos tus enlaces reales de afiliados en el listado `partnerCampaigns` dentro de `site-config.js` (agrupados por `CO`, `MX`, `ES`, `PE` y `DEFAULT`).
- [ ] **Probar país Colombia:** Cargar la web con la URL `index.html?country=CO` o cambiar a Colombia en el selector y verificar que se muestra la Liga BetPlay, el ejemplo Millonarios vs Nacional, y que en `sistema.html` aparece la opción de pagar con Mercado Pago.
- [ ] **Probar país México:** Cargar `index.html?country=MX` y comprobar que se muestra la Liga MX, ejemplo América vs Chivas, precios en MXN y socios locales en `partners.html`.
- [ ] **Probar país España:** Cargar `index.html?country=ES` y comprobar que se muestra LaLiga EA Sports, ejemplo Real Madrid vs Barcelona, precios en EUR (€43) y regulación DGOJ en el pie.
- [ ] **Probar país Perú:** Cargar `index.html?country=PE` y comprobar que se muestra la Liga 1, Universitario vs Alianza Lima, precios en PEN (S/170) y regulación MINCETUR en el pie.

