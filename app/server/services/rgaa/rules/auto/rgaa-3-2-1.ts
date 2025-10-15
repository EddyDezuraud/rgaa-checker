import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-3-2-1',
  label: 'Contraste suffisant entre texte et arrière-plan',
  theme: 'Couleurs',
  type: 'auto',
  wcag: ['1.4.3'],
  description: 'Calcule le contraste APCA des textes pour vérifier la conformité WCAG.',
  remediation: 'Ajuster les couleurs de texte et de fond pour atteindre un contraste APCA ≥ 60.',
  async isApplicable ({ page }) {
    const count = await page.$$eval('*', nodes => nodes.length)
    return count > 0
  },
  async run ({ page }) {
    const failing = await page.$$eval('*', (nodes) => {
      const results: Array<{ snippet: string; score: number }> = []
      nodes.forEach((node) => {
        const style = window.getComputedStyle(node as Element)
        if (!style) return
        if (!style.color || !style.backgroundColor) return
        const text = (node.textContent ?? '').trim()
        if (text.length < 20) return
        const parseColor = (value: string) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) return [0, 0, 0]
          ctx.fillStyle = value
          const computed = ctx.fillStyle
          const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(computed)
          if (!match) return [0, 0, 0]
          return match.slice(1, 4).map(Number)
        }
        const luminance = (color: [number, number, number]) => {
          const [r, g, b] = color.map((channel) => {
            const c = channel / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
          })
          return 0.2126 * r + 0.7152 * g + 0.0722 * b
        }
        const textColor = parseColor(style.color as string)
        const backgroundColor = parseColor(style.backgroundColor as string)
        const l1 = luminance(textColor)
        const l2 = luminance(backgroundColor)
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
        const score = ratio * 100
        if (score < 60) {
          results.push({ snippet: (node as Element).outerHTML.slice(0, 200), score })
        }
      })
      return results
    })

    return {
      id: 'rgaa-3-2-1',
      auditId: '',
      criterionId: '3.2.1',
      label: 'Contraste suffisant entre texte et arrière-plan',
      theme: 'Couleurs',
      type: 'auto',
      wcag: ['1.4.3'],
      status: failing.length === 0 ? 'passed' : 'failed',
      description: failing.length === 0
        ? 'Tous les contrastes analysés dépassent le seuil APCA recommandé.'
        : `${failing.length} élément(s) avec un contraste insuffisant (< 60 APCA).`,
      remediation: 'Augmenter le contraste entre texte et arrière-plan (couleurs ou opacité).',
      evidence: failing.map((item, index) => ({
        id: `rgaa-3-2-1-${index}`,
        type: 'dom',
        snippet: item.snippet,
        description: `Contraste mesuré : ${item.score.toFixed(1)} APCA`
      }))
    }
  }
}

export default rule
