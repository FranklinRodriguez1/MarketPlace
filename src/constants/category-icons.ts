import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type CategoryIcon = keyof typeof MaterialIcons.glyphMap;

export const DEFAULT_CATEGORY_ICON: CategoryIcon = 'category';

// Íconos conocidos por slug; cualquier categoría nueva del backend cae en DEFAULT_CATEGORY_ICON.
export const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  'aire-acondicionado': 'ac-unit',
  bartender: 'local-bar',
  carpinteria: 'construction',
  catering: 'restaurant',
  cerrajeria: 'lock',
  'clases-de-guitarra': 'music-note',
  'clases-de-ingles': 'language',
  'clases-de-matematicas': 'calculate',
  contabilidad: 'account-balance',
  costura: 'checkroom',
  'cuidado-de-adultos': 'elderly',
  decoracion: 'palette',
  'diseno-grafico': 'design-services',
  'dj-para-eventos': 'headset',
  electricidad: 'bolt',
  'entrenamiento-personal': 'fitness-center',
  fotografia: 'photo-camera',
  fumigacion: 'pest-control',
  impermeabilizacion: 'water-drop',
  'instalacion-de-pisos': 'grid-on',
  jardineria: 'yard',
  'limpieza-del-hogar': 'cleaning-services',
  manicure: 'spa',
  masajes: 'self-improvement',
  mudanzas: 'local-shipping',
  ninera: 'child-care',
  nutricion: 'restaurant-menu',
  'paseo-de-perros': 'pets',
  peluqueria: 'content-cut',
  pintura: 'format-paint',
  plomeria: 'plumbing',
  'redes-y-wifi': 'wifi',
  'reparacion-de-celulares': 'phone-android',
  'reparacion-de-pc': 'computer',
  reposteria: 'cake',
  soldadura: 'build',
  tapiceria: 'chair',
  'veterinaria-a-domicilio': 'medical-services',
  vidrieria: 'window',
  yoga: 'accessibility-new',
};
