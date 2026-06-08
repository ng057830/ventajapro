// CONFIGURACIÓN COMERCIAL ACTIVA - VentajaBets (site-config.js)
// Modifica aquí tus enlaces de Hotmart, Mercado Pago y Afiliados

window.VB_COMMERCIAL_CONFIG = {
  // 1. Checkout principal de Hotmart (Precio base $47 USD)
  checkoutUrlGlobal: "https://pay.hotmart.com/YOUR_HOTMART_PRODUCT_ID?checkoutMode=10",
  
  // 2. Checkout local de Mercado Pago / PSE (Solo para Colombia, precio fijo $69.900 COP)
  checkoutUrlCO: "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=YOUR_MERCADO_PAGO_PREFERENCE_ID",
  
  // 3. Enlaces de afiliados (AfiliaGo, NetHive, Codere Partners, etc.)
  partnerCampaigns: {
    CO: [
      {
        name: "Codere Colombia",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono $100.000 COP | Registrarme"
      },
      {
        name: "Wplay",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono $200.000 COP | Registrarme"
      }
    ],
    MX: [
      {
        name: "Caliente MX",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono $3.000 MXN | Registrarme"
      },
      {
        name: "Codere México",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono Triple $5.000 MXN | Registrarme"
      }
    ],
    ES: [
      {
        name: "Bet365 España",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Ver bono / Registrarme"
      },
      {
        name: "Codere España",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Ver bono / Registrarme"
      }
    ],
    PE: [
      {
        name: "Betano Perú",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono S/500 | Registrarme"
      },
      {
        name: "Inkabet",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Bono S/400 | Registrarme"
      }
    ],
    DEFAULT: [
      {
        name: "Bet365 Internacional",
        url: "https://c.afiliago.com/click.asp?c=356&p=64",
        label: "Ver bono / Registrarme"
      }
    ]
  }
};
