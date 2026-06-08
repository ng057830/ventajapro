// EJEMPLO DE CONFIGURACIÓN COMERCIAL - VentajaBets (site-config.example.js)
// Renombra este archivo a site-config.js y coloca aquí tus enlaces de Hotmart, Mercado Pago y Afiliados

window.VB_COMMERCIAL_CONFIG = {
  // 1. Checkout principal de Hotmart (Precio base $47 USD. Convierte automáticamente a moneda local)
  checkoutUrlGlobal: "https://pay.hotmart.com/YOUR_HOTMART_PRODUCT_ID?checkoutMode=10",
  
  // 2. Checkout local de Mercado Pago / PSE (Solo para Colombia, precio fijo $69.900 COP)
  checkoutUrlCO: "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=YOUR_MERCADO_PAGO_PREFERENCE_ID",
  
  // 3. Enlaces de afiliados reales para cada país (ej: obtenidos en AfiliaGo, NetHive, Codere Partners)
  partnerCampaigns: {
    CO: [
      {
        name: "Codere Colombia",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=co-seo",
        label: "Bono $100.000 COP | Registrarme"
      },
      {
        name: "Wplay Colombia",
        url: "https://wplay.co/registro?affiliateId=YOUR_WPLAY_AFFILIATE_ID",
        label: "Bono $200.000 COP | Registrarme"
      }
    ],
    MX: [
      {
        name: "Caliente México",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=mx-seo",
        label: "Bono $3.000 MXN gratis | Registrarme"
      },
      {
        name: "Codere México",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=mx-codere",
        label: "Bono Triple $5.000 MXN | Registrarme"
      }
    ],
    ES: [
      {
        name: "Bet365 España",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=es-seo",
        label: "Ver bono / Registrarme"
      },
      {
        name: "Codere España",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=es-codere",
        label: "Ver bono / Registrarme"
      }
    ],
    PE: [
      {
        name: "Betano Perú",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=pe-seo",
        label: "Bono S/500 | Registrarme"
      },
      {
        name: "Inkabet Perú",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=pe-inka",
        label: "Bono S/400 | Registrarme"
      }
    ],
    DEFAULT: [
      {
        name: "Bet365 Internacional",
        url: "https://c.afiliago.com/click.asp?c=356&p=64&subid=global-seo",
        label: "Ver bono / Registrarme"
      }
    ]
  }
};
