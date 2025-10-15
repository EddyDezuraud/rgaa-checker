import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-8-1-1',
  label: 'Présence des éléments obligatoires',
  theme: 'Éléments obligatoires',
  type: 'assisted',
  wcag: ['2.4.1'],
  description: 'Vérifie la présence d’un lien d’accès rapide et d’une zone de recherche.',
  remediation: 'Ajouter un lien « Aller au contenu » et les éléments obligatoires manquants.',
  async isApplicable ({ page }) {
    const body = await page.$('body')
    return !!body
  },
  async run ({ page }) {
    const skipLink = await page.$('a[href^="#main"], a.skip-link')
    const search = await page.$('input[type="search"], form[role="search"]')
    return {
      id: 'rgaa-8-1-1',
      auditId: '',
      criterionId: '8.1.1',
      label: 'Présence des éléments obligatoires',
      theme: 'Éléments obligatoires',
      type: 'assisted',
      wcag: ['2.4.1'],
      status: skipLink && search ? 'needs_review' : 'failed',
      description: skipLink && search
        ? 'Lien d’accès rapide et recherche détectés. Vérifier leur pertinence.'
        : 'Lien d’accès rapide ou zone de recherche manquant.',
      remediation: 'Ajouter un lien d’évitement et une zone de recherche accessible.',
      evidence: [
        {
          id: 'rgaa-8-1-1-skip',
          type: 'note',
          description: skipLink ? 'Lien de contournement détecté' : 'Lien de contournement manquant'
        },
        {
          id: 'rgaa-8-1-1-search',
          type: 'note',
          description: search ? 'Zone de recherche détectée' : 'Zone de recherche manquante'
        }
      ]
    }
  }
}

export default rule
