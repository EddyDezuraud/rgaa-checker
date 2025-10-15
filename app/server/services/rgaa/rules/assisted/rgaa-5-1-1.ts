import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-5-1-1',
  label: 'Transcription pour contenus audio',
  theme: 'Multimédia',
  type: 'assisted',
  wcag: ['1.2.1'],
  description: 'Détecte les contenus audio isolés nécessitant une transcription.',
  remediation: 'Fournir une transcription textuelle complète.',
  async isApplicable ({ page }) {
    const audios = await page.$$eval('audio', nodes => nodes.length)
    return audios > 0
  },
  async run ({ page }) {
    const audios = await page.$$eval('audio', (nodes) => {
      return nodes.map((node, index) => ({
        index,
        controls: node.hasAttribute('controls'),
        transcript: node.closest('[data-transcript], .transcript, [aria-describedby]'),
        snippet: node.outerHTML.slice(0, 200)
      }))
    })
    const missing = audios.filter(audio => !audio.transcript)
    return {
      id: 'rgaa-5-1-1',
      auditId: '',
      criterionId: '5.1.1',
      label: 'Transcription pour contenus audio',
      theme: 'Multimédia',
      type: 'assisted',
      wcag: ['1.2.1'],
      status: missing.length === 0 ? 'needs_review' : 'failed',
      description: missing.length === 0
        ? 'Des transcriptions semblent présentes. Vérifier leur exhaustivité.'
        : `${missing.length} audio(s) sans transcription identifiée.`,
      remediation: 'Ajouter une transcription accessible (texte adjacent ou lien vers transcription).',
      evidence: audios.map((audio) => ({
        id: `rgaa-5-1-1-${audio.index}`,
        type: 'dom',
        snippet: audio.snippet,
        description: audio.transcript ? 'Transcription liée' : 'Transcription manquante'
      }))
    }
  }
}

export default rule
