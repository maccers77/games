export { GameShell } from './GameShell';
export { Header } from './Header';
export { SettingsPanel } from './SettingsPanel';
export { PlayArea } from './PlayArea';
export { ResultBanner, type BannerTone } from './ResultBanner';

export { formatCurrency } from './lib/currency';
export {
  postToHost,
  postGameResult,
  type GameId,
  type GameResultEvent,
} from './lib/host';
export {
  loadEmbedConfig,
  type EmbedConfig,
  type LoadEmbedOptions,
} from './lib/embed';
