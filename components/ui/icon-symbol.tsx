// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'rocket-launch',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'brain.fill': 'psychology',
  'folder.fill': 'folder',
  'checkmark.circle': 'check-circle',
  'lightbulb': 'lightbulb',
  'lightbulb.fill': 'lightbulb',
  'gear': 'settings',
  'chart.bar.fill': 'bar-chart',
  'sparkles': 'auto-awesome',
  'scope': 'gps-fixed',
  'doc.text.fill': 'description',
  'briefcase.fill': 'work',
  'figure.roll': 'accessible',
  'books.vertical.fill': 'menu-book',
  'party.popper': 'celebration',
  'arrow.clockwise': 'refresh',
  'arrow.right': 'arrow-forward',
  'checkmark': 'check',
  'person.fill': 'person',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
