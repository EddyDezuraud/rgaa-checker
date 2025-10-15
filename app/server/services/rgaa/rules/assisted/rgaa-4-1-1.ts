import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-4-1-1',
  label: 'Présence de sous-titres synchronisés pour les vidéos',
  theme: 'Multimédia',
  type: 'assisted',
  wcag: ['1.2.2'],
  description: 'Identifie les vidéos avec audio et demande une validation humaine sur la qualité des sous-titres.',
  remediation: 'Fournir des sous-titres synchronisés couvrant l’intégralité des dialogues et sons pertinents.',
  async isApplicable ({ page }) {
    const videos = await page.$$eval('video', nodes => nodes.length)
    return videos > 0
  },
  async run ({ page }) {
    const items = await page.$$eval('video', (nodes) => {
      return nodes.map((node, index) => ({
        snippet: node.outerHTML.slice(0, 200),
        hasTrack: node.querySelectorAll('track[kind="subtitles"], track[kind="captions"]').length > 0,
        index
      }))
    })
    const missing = items.filter(item => !item.hasTrack)
    return {
      id: 'rgaa-4-1-1',
      auditId: '',
      criterionId: '4.1.1',
      label: 'Présence de sous-titres synchronisés pour les vidéos',
      theme: 'Multimédia',
      type: 'assisted',
      wcag: ['1.2.2'],
      status: missing.length === 0 ? 'needs_review' : 'failed',
      description: missing.length === 0
        ? 'Sous-titres détectés. Vérifier manuellement leur exhaustivité.'
        : `${missing.length} vidéo(s) sans piste de sous-titres détectée.`,
      remediation: 'Ajouter une piste de sous-titres (.vtt) synchronisée avec les dialogues et sons importants.',
      evidence: items.map((item) => ({
        id: `rgaa-4-1-1-${item.index}`,
        type: 'dom',
        snippet: item.snippet,
        description: item.hasTrack ? 'Piste détectée – vérifier qualité' : 'Aucune piste de sous-titre'
      }))
    }
  }
}

export default rule
